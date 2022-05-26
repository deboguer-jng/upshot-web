import { useLazyQuery, useMutation } from '@apollo/client'
import {
  ConnectModal,
  Flex,
  HelpModal,
  Icon,
  IconButton,
  Link,
  Modal,
  Navbar,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import {
  LOG_EVENT,
  LogEventData,
  LogEventVars,
  SIGN_IN,
  SignInData,
  SignInVars,
} from 'graphql/mutations'
import {
  GET_NAV_BAR_COLLECTIONS,
  GET_NONCE,
  GetNavBarCollectionsData,
  GetNavBarCollectionsVars,
  GetNonceData,
  GetNonceVars,
} from 'graphql/queries'
import { useAuth } from 'hooks/auth'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectFeatures } from 'redux/reducers/features'
import {
  selectShowHelpModal,
  selectShowSidebar,
  setShowHelpModal,
  setShowSidebar,
} from 'redux/reducers/layout'
import { setIsBeta } from 'redux/reducers/user'
import {
  resetWeb3,
  selectAddress,
  selectAuthToken,
  selectEns,
  setActivatingConnector,
  setAuthToken,
} from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'
import { getAuthPayload } from 'utils/auth'
import { logEvent } from 'utils/googleAnalytics'

import { BetaBanner } from '../BetaBanner'
import { Sidebar, SidebarShade, SideLink } from './Styled'

interface InputSuggestion {
  id: number | string
  name: string
  [key: string]: any
}

function useOutsideAlerter(ref) {
  const [status, setStatus] = useState(false)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setStatus(true)
      } else {
        setStatus(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return status
}

export const Nav = () => {
  const { theme } = useTheme()
  const { activate, deactivate, connector, library, account } = useWeb3React()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const features = useAppSelector(selectFeatures)

  const address = useAppSelector(selectAddress)
  const showSidebar = useAppSelector(selectShowSidebar)
  const sidebarRef = useRef(null)
  const ens = useAppSelector(selectEns)
  const [navSearchTerm, setNavSearchTerm] = useState('')
  const [getNavCollections, { data: navCollectionsData }] = useLazyQuery<
    GetNavBarCollectionsData,
    GetNavBarCollectionsVars
  >(GET_NAV_BAR_COLLECTIONS)
  const [open, setOpen] = useState(false)
  const helpOpen = useSelector(selectShowHelpModal)
  const authToken = useSelector(selectAuthToken)
  const modalRef = useRef<HTMLDivElement>(null)
  const helpModalRef = useRef<HTMLDivElement>(null)
  const isMobile = useBreakpointIndex() <= 1
  const toggleModal = () => setOpen(!open)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const outsideClicked = useOutsideAlerter(sidebarRef)
  const [isAuthed, triggerAuth] = useAuth();

  useEffect(() => {
    if (!router.query) return

    const collectionName = router.query.collectionName as string
    const collectionSearch = router.query.collectionSearch as string
    setNavSearchTerm(collectionSearch ?? collectionName ?? '')
  }, [router.query])

  useEffect(() => {
    if (outsideClicked && !isMobile && showSidebar) {
      handleToggleMenu()
    }
  }, [outsideClicked])

  const isAddress =
    navSearchTerm?.substring(0, 2) === '0x' && navSearchTerm?.length === 42

  const isENS = navSearchTerm && navSearchTerm.slice(-4) === '.eth'

  const handleConnect = (provider: ConnectorName) => {
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined
    }

    dispatch(setActivatingConnector(provider))
    activate(connectorsByName[provider], (err) => console.error(err))
    modalRef?.current?.click()
  }

  const handleNavKeyUp = () => {
    if (navCollectionsData?.collections?.assetSets?.length) return

    getNavCollections({ variables: { limit: 1000 } })
  }

  const suggestions = useMemo(() => {
    const suggestions = navCollectionsData?.collections?.assetSets ?? []

    return isAddress
      ? [{ id: 0, name: shortenAddress(navSearchTerm) }]
      : suggestions.filter(({ name }) =>
          name.toLowerCase().includes(navSearchTerm.toLowerCase())
        )
  }, [navCollectionsData, navSearchTerm, isAddress])

  const handleNavSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showSidebar) handleToggleMenu()
    ;(document.activeElement as HTMLElement).blur()

    if (isENS) {
      try {
        const provider = ethers.getDefaultProvider()
        const address = await provider.resolveName(navSearchTerm)
        if (!address) return

        router.push(`/analytics/user/${address}`)
      } catch (err) {
        console.warn(err)
      }

      return
    }

    isAddress
      ? router.push(`/analytics/user/${encodeURIComponent(navSearchTerm)}`)
      : router.push(
          `/analytics/search?collectionSearch=${encodeURIComponent(
            navSearchTerm
          )}`
        )
  }

  const handleSearchSuggestionChange = (item: InputSuggestion) => {
    if (showSidebar) handleToggleMenu()
    if (isAddress)
      return router.push(`/analytics/user/${encodeURIComponent(navSearchTerm)}`)
    if (!item?.id) return

    router.push(`/analytics/collection/${item.id}`)
  }

  const hideMetaMask =
    typeof window['ethereum'] === 'undefined' &&
    typeof window['web3'] === 'undefined'

  const handleDisconnect = () => {
    deactivate()
    if (showSidebar) handleToggleMenu()
    dispatch(resetWeb3())
    dispatch(setIsBeta(undefined))
  }

  const handleToggleMenu = () => {
    dispatch(setShowSidebar(!showSidebar))
  }

  const getVariant = () => {
    if (features?.status?.maintenance) return 'maintenance'

    return 'beta'
  }

  const handleShowSettings = () => {
    triggerAuth(() => {
      router.push('/analytics/settings')
    })
  }

  const sidebar = (
    <Sidebar ref={sidebarRef}>
      <Flex sx={{ flexDirection: 'column', gap: '32px', flexGrow: 1 }}>
        <Flex sx={{ flexDirection: 'column', gap: '32px' }}>
          <SideLink
            href="/"
            component={NextLink}
            sx={{ fontSize: 6, fontWeight: 'heading' }}
            $isActive={router.pathname === '/'}
          >
            Home
          </SideLink>
          <SideLink
            href="/analytics"
            component={NextLink}
            sx={{ fontSize: 6, fontWeight: 'heading' }}
            $isActive={router.pathname === '/analytics'}
            onClick={handleToggleMenu}
          >
            Analytics
          </SideLink>
          <SideLink
            href="https://docs.upshot.xyz"
            component={NextLink}
            sx={{ fontSize: 6, fontWeight: 'heading' }}
            target="_blank"
            onClick={handleToggleMenu}
          >
            API Docs
          </SideLink>
          <SideLink
            component={NextLink}
            href="https://jv3yfpod32j.typeform.com/to/CZ28JWz9"
            sx={{ fontSize: 6, fontWeight: 'heading' }}
            target="_blank"
            onClick={handleToggleMenu}
          >
            Feedback
          </SideLink>
        </Flex>
      </Flex>

      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          padding: 4,
        }}
      >
        <Link
          href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton onClick={handleToggleMenu}>
            <Icon color="white" icon="mirror" size={32} />
          </IconButton>
        </Link>

        <Link
          href="https://twitter.com/upshothq"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton onClick={handleToggleMenu}>
            <Icon color="white" icon="twitterCircle" size={32} />
          </IconButton>
        </Link>

        <Link
          href="https://discord.gg/upshot"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton onClick={handleToggleMenu}>
            <Icon color="white" icon="discord" size={32} />
          </IconButton>
        </Link>

        <Link
          href="https://www.instagram.com/upshot.hq/"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton onClick={handleToggleMenu}>
            <Icon color="white" icon="instagramCircle" size={32} />
          </IconButton>
        </Link>
      </Flex>
    </Sidebar>
  )

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: theme.zIndex.nav + 1,
        }}
      >
        <BetaBanner variant={getVariant()} />
        <Navbar
          linkComponent={NextLink}
          avatarImageUrl={address ? makeBlockie(address) : undefined}
          ensName={ens.name}
          searchValue={navSearchTerm}
          onSearchValueChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNavSearchTerm(e.currentTarget.value)
          }
          onSearch={handleNavSearch}
          onSearchSuggestionChange={handleSearchSuggestionChange}
          onSearchKeyUp={handleNavKeyUp}
          onConnectClick={() => {
            if (showSidebar) handleToggleMenu()
            toggleModal()
          }}
          onSettings={handleShowSettings}
          onDisconnectClick={handleDisconnect}
          onMenuClick={handleToggleMenu}
          onHelpClick={toggleHelpModal}
          searchSuggestions={suggestions}
          {...{ address, showSidebar }}
        >
          {showSidebar && sidebar}
        </Navbar>
        <Modal ref={modalRef} onClose={toggleModal} {...{ open }} hideScroll>
          <ConnectModal {...{ hideMetaMask }} onConnect={handleConnect} />
        </Modal>
        <Modal
          ref={helpModalRef}
          onClose={toggleHelpModal}
          hideScroll
          {...{ open: helpOpen }}
        >
          <HelpModal
            link="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
            onClose={toggleHelpModal}
          />
        </Modal>
      </Flex>
      {showSidebar && <SidebarShade />}
    </>
  )
}
