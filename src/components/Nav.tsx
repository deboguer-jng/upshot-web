import { useLazyQuery } from '@apollo/client'
import { ConnectModal, Modal, Navbar } from '@upshot-tech/upshot-ui'
import { InputSuggestion } from '@upshot-tech/upshot-ui/src/components/@UI/InputRoundedSearch'
import { useWeb3React } from '@web3-react/core'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import makeBlockie from 'ethereum-blockies-base64'
import {
  GET_NAV_BAR_COLLECTIONS,
  GetNavBarCollectionsData,
  GetNavBarCollectionsVars,
} from 'graphql/queries'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import {
  selectAddress,
  selectEns,
  setActivatingConnector,
} from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'

export const Nav = () => {
  const { activate } = useWeb3React()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)
  const ens = useAppSelector(selectEns)
  const [navSearchTerm, setNavSearchTerm] = useState('')
  const [getNavCollections, { data: navCollectionsData }] = useLazyQuery<
    GetNavBarCollectionsData,
    GetNavBarCollectionsVars
  >(GET_NAV_BAR_COLLECTIONS)
  const [open, setOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const toggleModal = () => setOpen(!open)

  const handleConnect = (provider: ConnectorName) => {
    dispatch(setActivatingConnector(provider))
    activate(connectorsByName[provider])
    modalRef?.current?.click()
  }

  const handleNavKeyUp = () => {
    if (navCollectionsData?.collections?.assetSets?.length) return

    getNavCollections({ variables: { limit: 1000 } })
  }

  const handleSearchSuggestionChange = (item: InputSuggestion) => {
    router.push(`/analytics/search?collection=${encodeURIComponent(item.name)}`)
  }

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault()

    router.push(`/analytics/search?query=${encodeURIComponent(navSearchTerm)}`)
  }

  const suggestions = useMemo(() => {
    const suggestions = navCollectionsData?.collections?.assetSets ?? []

    return suggestions.filter(({ name }) =>
      name.toLowerCase().includes(navSearchTerm.toLowerCase())
    )
  }, [navCollectionsData, navSearchTerm])

  return (
    <>
      <Navbar
        avatarImageUrl={
          ens.avatar ?? address ? makeBlockie(address) : undefined
        }
        ensName={ens.name}
        address={address ? shortenAddress(address) : undefined}
        searchValue={navSearchTerm}
        onSearchValueChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNavSearchTerm(e.currentTarget.value)
        }
        onSearch={handleNavSearch}
        onLogoClick={() => router.push('/')}
        onSearchSuggestionChange={handleSearchSuggestionChange}
        onSearchKeyUp={handleNavKeyUp}
        onConnectClick={toggleModal}
        searchSuggestions={suggestions}
      />
      <Modal ref={modalRef} onClose={toggleModal} {...{ open }}>
        <ConnectModal onConnect={handleConnect} />
      </Modal>
    </>
  )
}
