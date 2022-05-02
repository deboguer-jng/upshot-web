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
import { selectIsBeta } from 'redux/reducers/user'
import { setIsBeta } from 'redux/reducers/user'
import {
  selectActivatingConnector,
  selectAddress,
  setActivatingConnector,
  setAddress,
  setEns,
} from 'redux/reducers/web3'

import { LOG_EVENT, LogEventData, LogEventVars } from '../graphql/mutations'
import { logEvent } from '../utils/googleAnalytics'
import WaitList from '../views/WaitList'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const { connector, account, library } = useWeb3React()

  const dispatch = useAppDispatch()
  const activatingConnector = useAppSelector(selectActivatingConnector)
  const address = useAppSelector(selectAddress)
  const isBeta = useAppSelector(selectIsBeta)
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

    const handleAccountsChanged = async (accounts) => {
      if (!accounts.length) {
        dispatch(setAddress(undefined))
        dispatch(setEns({ name: undefined }))
        dispatch(setIsBeta(undefined))
      }
    }

    if (window['ethereum']) {
      window['ethereum'].on('accountsChanged', handleAccountsChanged)
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

      dispatch(setAddress(account))
    }

    if (account && address && account !== address) {
      dispatch(setIsBeta(undefined))
      return
    }

    const fetchEns = async (address: string) => {
      const provider = library
        ? new ethers.providers.Web3Provider(library.provider)
        : null

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
      return () =>
        window['ethereum'].removeListener(
          'accountsChanged',
          handleAccountsChanged
        )
  }, [account, library, dispatch, ready, address])

  // Eagerly connect to the Injected provider, if granted access and authenticated in redux.
  const triedEager = useEagerConnect(address)

  // React to Injected provider events, if it exists.
  useInactiveListener(!triedEager || !!activatingConnector)

  if (!ready) return null

  return (
    <>
      {['/', '/gmi'].includes(router.route) || isBeta ? children : <WaitList />}
    </>
  )
}
