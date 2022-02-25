import { useLazyQuery } from '@apollo/client'
import {
  ConnectModal,
  Container,
  Flex,
  Icon,
  IconButton,
  Modal,
  Navbar,
  Text,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import makeBlockie from 'ethereum-blockies-base64'
import {
  GET_NAV_BAR_COLLECTIONS,
  GetNavBarCollectionsData,
  GetNavBarCollectionsVars,
} from 'graphql/queries'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectShowSidebar, setShowSidebar } from 'redux/reducers/layout'
import {
  selectAddress,
  selectEns,
  setActivatingConnector,
  setAddress,
  setEns,
} from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'

import { BetaBanner } from '../BetaBanner'
import { Sidebar, SidebarShade, SideLink } from './Styled'

export const Nav = () => {
  const { theme } = useTheme()
  const { activate, deactivate } = useWeb3React()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)
  const showSidebar = useAppSelector(selectShowSidebar)
  const ens = useAppSelector(selectEns)
  const [navSearchTerm, setNavSearchTerm] = useState('')
  const [getNavCollections, { data: navCollectionsData }] = useLazyQuery<
    GetNavBarCollectionsData,
    GetNavBarCollectionsVars
  >(GET_NAV_BAR_COLLECTIONS)
  const [open, setOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const toggleModal = () => setOpen(!open)

  interface InputSuggestion {
    id: number
    name: string
  }

  const isAddress =
    navSearchTerm.substring(0, 2) === '0x' && navSearchTerm.length === 42

  const handleConnect = (provider: ConnectorName) => {
    dispatch(setActivatingConnector(provider))
    activate(connectorsByName[provider], (err) => console.error(err))
    modalRef?.current?.click()
  }

  const handleNavKeyUp = () => {
    if (navCollectionsData?.collections?.assetSets?.length) return

    getNavCollections({ variables: { limit: 1000 } })
  }

  const handleSearchSuggestionChange = (item: InputSuggestion) => {
    isAddress
      ? router.push(`/analytics/user/${encodeURIComponent(navSearchTerm)}`)
      : router.push(`/analytics/collection/${encodeURIComponent(item.id)}`)
  }

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault()

    isAddress
      ? router.push(`/analytics/user/${encodeURIComponent(navSearchTerm)}`)
      : router.push(
          `/analytics/search?query=${encodeURIComponent(navSearchTerm)}`
        )
  }

  const suggestions = useMemo(() => {
    const suggestions = navCollectionsData?.collections?.assetSets ?? []

    return isAddress
      ? [{ id: 0, name: shortenAddress(navSearchTerm) }]
      : suggestions.filter(({ name }) =>
          name.toLowerCase().includes(navSearchTerm.toLowerCase())
        )
  }, [navCollectionsData, navSearchTerm, isAddress])

  const hideMetaMask =
    typeof window['ethereum'] === 'undefined' &&
    typeof window['web3'] === 'undefined'

  const handleDisconnect = () => {
    deactivate()
    dispatch(setAddress(undefined))
    dispatch(setEns({ name: undefined, avatar: undefined }))
  }

  const handleToggleMenu = () => {
    dispatch(setShowSidebar(!showSidebar))
  }

  const sidebar = (
    <Sidebar>
      <Flex sx={{ flexDirection: 'column', gap: '32px', flexGrow: 1 }}>
        <Flex sx={{ flexDirection: 'column', gap: '32px' }}>
          <Link href="/" passHref>
            <SideLink
              sx={{ fontSize: 6, fontWeight: 'heading' }}
              $isActive={router.pathname === '/'}
            >
              Home
            </SideLink>
          </Link>
          <Link href="/analytics" passHref>
            <SideLink
              sx={{ fontSize: 6, fontWeight: 'heading' }}
              $isActive={router.pathname === '/analytics'}
            >
              Analytics
            </SideLink>
          </Link>
          <Link href="https://docs.upshot.xyz" passHref>
            <SideLink
              sx={{ fontSize: 6, fontWeight: 'heading' }}
              target="_blank"
            >
              API Docs
            </SideLink>
          </Link>
          <Link href="https://jv3yfpod32j.typeform.com/to/CZ28JWz9" passHref>
            <SideLink
              sx={{ fontSize: 6, fontWeight: 'heading' }}
              target="_blank"
            >
              Feedback
            </SideLink>
          </Link>
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
        <a
          href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <Icon color="white" icon="mirror" size={32} />
          </IconButton>
        </a>

        <a href="https://twitter.com/upshothq" target="_blank" rel="noreferrer">
          <IconButton>
            <Icon color="white" icon="twitterCircle" size={32} />
          </IconButton>
        </a>

        <a href="https://discord.gg/upshot" target="_blank" rel="noreferrer">
          <IconButton>
            <Icon color="white" icon="discord" size={32} />
          </IconButton>
        </a>

        <a
          href="https://www.instagram.com/upshot.hq/"
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <Icon color="white" icon="instagramCircle" size={32} />
          </IconButton>
        </a>
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
        <BetaBanner />
        <Navbar
          avatarImageUrl={address ? makeBlockie(address) : undefined}
          ensName={ens.name}
          searchValue={navSearchTerm}
          onSearchValueChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNavSearchTerm(e.currentTarget.value)
          }
          onSearch={handleNavSearch}
          onLogoClick={() => router.push('/')}
          onSearchSuggestionChange={handleSearchSuggestionChange}
          onSearchKeyUp={handleNavKeyUp}
          onConnectClick={toggleModal}
          onDisconnectClick={handleDisconnect}
          onMenuClick={handleToggleMenu}
          searchSuggestions={suggestions}
          {...{ address, showSidebar }}
        >
          {showSidebar && sidebar}
        </Navbar>
        <Modal ref={modalRef} onClose={toggleModal} {...{ open }}>
          <ConnectModal {...{ hideMetaMask }} onConnect={handleConnect} />
        </Modal>
      </Flex>
      {showSidebar && <SidebarShade />}
    </>
  )
}
