import { useMutation } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from 'constants/connectors'
import { ethers } from 'ethers'
import { useEagerConnect, useInactiveListener } from 'hooks/web3'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { useAppDispatch } from 'redux/hooks'
import { fetchFeatures } from 'redux/reducers/features'
import { setAlertState } from 'redux/reducers/layout'
import { selectIsBeta, setIsBeta } from 'redux/reducers/user'
import {
  removeTransaction,
  resetWeb3,
  selectActivatingConnector,
  selectAddress,
  selectTransactions,
  setActivatingConnector,
  setAddress,
  setChain,
  setEns,
} from 'redux/reducers/web3'

import { LOG_EVENT, LogEventData, LogEventVars } from '../graphql/mutations'
import { logEvent } from '../utils/googleAnalytics'
import WaitList from '../views/WaitList'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const { connector, account, library, deactivate } = useWeb3React()

  const dispatch = useAppDispatch()
  const activatingConnector = useAppSelector(selectActivatingConnector)
  const address = useAppSelector(selectAddress)
  const isBeta = useAppSelector(selectIsBeta)
  const txs = useAppSelector(selectTransactions)
  const router = useRouter()
  const [logUpshotEvent] = useMutation<LogEventData, LogEventVars>(LOG_EVENT, {
    onError: (err) => {
      console.error(err)
    },
  })

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!address) return // Only log events for authenticated users.

      logUpshotEvent({
        variables: {
          timestamp: Math.floor(Date.now() / 1000),
          address,
          type: 'route',
          value: url,
        },
      })
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [address, logUpshotEvent, router.events])

  useEffect(() => {
    dispatch(fetchFeatures())
    setReady(true)
  }, [dispatch])

  useEffect(() => {
    const watchTxs = async () => {
      const provider = new ethers.providers.Web3Provider(
        window['ethereum'],
        'any'
      )
      if (!provider) return

      txs.map((hash) =>
        provider.waitForTransaction(hash).then((tx) => {
          dispatch(removeTransaction(hash))

          let isSuccess = Boolean(tx.blockHash)

          dispatch(
            setAlertState({
              showAlert: true,
              alertText: `Transaction [${
                isSuccess ? 'SUCCESS' : 'FAIL'
              }] - ${hash.slice(0, 6)}...${hash.slice(-4)}`,
            })
          )
        })
      )
    }

    watchTxs()
  }, [dispatch, txs])

  // Recognize the connector currently being activated.
  useEffect(() => {
    if (
      activatingConnector &&
      connectorsByName[activatingConnector] === connector
    ) {
      dispatch(setActivatingConnector(undefined))
    }
  }, [activatingConnector, connector, dispatch])

  // Propogate account changes to the redux store.
  useEffect(() => {
    if (!ready) return

    const handleAccountsChanged = async () => {
      deactivate()
      dispatch(resetWeb3())
      dispatch(setIsBeta(undefined))
    }

    const handleChainChanged = async (chainId) => {
      if (chainId !== 1 && process.env.NODE_ENV !== 'development') {
        console.warn('Unsupported chain.')
      }

      dispatch(setChain(chainId))
    }

    if (window['ethereum']) {
      window['ethereum'].on('accountsChanged', handleAccountsChanged)
      window['ethereum'].on('chainChanged', handleChainChanged)
    }

    if (account && (!address || account !== address)) {
      logEvent('auth', 'signin', account)
      logUpshotEvent({
        variables: {
          timestamp: Math.floor(Date.now() / 1000),
          address: account,
          type: 'auth',
        },
      })

      library.getNetwork().then((network) => {
        if (!network.chainId) return

        if (
          network.chainId !== 1 &&
          typeof window['ethereum'] !== 'undefined' &&
          process.env.NODE_ENV !== 'development'
        ) {
          window['ethereum'].request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          })
        }

        handleChainChanged(network.chainId)
      })

      dispatch(setAddress(account))
    }

    const fetchEns = async (address: string) => {
      const provider = ethers.getDefaultProvider()
      if (!provider) return

      /* Reverse lookup of ENS name via address */
      let name
      try {
        name = await provider.lookupAddress(address)
      } catch (err) {
        console.error(err)
      }

      dispatch(setEns({ name }))
    }

    // Fetch ENS details
    if (account) fetchEns(account)

    if (window['ethereum'])
      return () => {
        window['ethereum'].removeListener(
          'accountsChanged',
          handleAccountsChanged
        )
        window['ethereum'].removeListener('chainChanged', handleChainChanged)
      }
  }, [account, library, dispatch, ready, address, deactivate, logUpshotEvent])

  // Eagerly connect to the Injected provider, if granted access and authenticated in redux.
  const triedEager = useEagerConnect(address)

  // React to Injected provider events, if it exists.
  useInactiveListener(!triedEager || !!activatingConnector)

  if (!ready) return null

  return (
    <>
      {process.env.NODE_ENV === 'development' ||
      router.route === '/' ||
      router.route.startsWith('/gmi') ||
      router.route.startsWith('/share') ||
      router.route.startsWith('/faq') ||
      isBeta ? (
        children
      ) : (
        <WaitList />
      )}
    </>
  )
}
