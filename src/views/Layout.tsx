import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from 'constants/connectors'
import { useEagerConnect, useInactiveListener } from 'hooks/web3'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { useAppDispatch } from 'redux/hooks'
import { selectIsBeta } from 'redux/reducers/user'
import { setIsBeta } from 'redux/reducers/user'
import {
  selectActivatingConnector,
  selectAddress,
  setActivatingConnector,
  setAddress,
} from 'redux/reducers/web3'

import WaitList from '../views/WaitList'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const { connector, account, library } = useWeb3React()

  const dispatch = useAppDispatch()
  const activatingConnector = useAppSelector(selectActivatingConnector)
  const address = useAppSelector(selectAddress)
  const isBeta = useAppSelector(selectIsBeta)
  const router = useRouter()

  useEffect(() => {
    setReady(true)
  }, [])

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

    dispatch(setAddress(account || undefined))
    if (account !== address) {
      dispatch(setIsBeta(undefined))
      return
    }
  }, [account, library, dispatch, ready, address])

  // Eagerly connect to the Injected provider, if granted access and authenticated in redux.
  const triedEager = useEagerConnect(address)

  // React to Injected provider events, if it exists.
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <>{router.route === '/' || (isBeta && account) ? children : <WaitList />}</>
  )
}
