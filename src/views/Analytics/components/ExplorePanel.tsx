import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { InputRoundedSearch } from '@upshot-tech/upshot-ui'
import { Box, Flex, Panel, SwitchDropdown } from '@upshot-tech/upshot-ui'
import router from 'next/router'
import React, { useRef, useState } from 'react'

import Collectors from './ExplorePanel/Collectors'
import ExploreNFTs from './ExplorePanel/NFTs'
import TopCollections from './ExplorePanel/TopCollections'
import TopCollectors from './ExplorePanel/TopCollectors'

function searchForm(handleSearch, searchTerm, searchTermRef, handleChange, isMobile) {
  return (
    <form style={isMobile ? { width: '100%' } : {}} onSubmit={handleSearch}>
      <InputRoundedSearch
        dark
        fullWidth
        hasButton
        defaultValue={searchTerm}
        ref={searchTermRef}
        onChange={handleChange}
        buttonProps={{
          type: 'button',
          onClick: handleSearch,
        }}
      />
    </form>
  )
}

interface ExplorePanelHeadProps {
  searchTerm: string
  tab?: string
  onChangeTab?: (tab: string) => void
  onSearch?: (searchTerm: string) => void
}

function ExplorePanelHead({
  onSearch,
  onChangeTab,
  tab,
  searchTerm,
}: ExplorePanelHeadProps) {
  const [autoFilter, setAutoFilter] = useState<any>()
  const [open, setOpen] = useState(false)
  const searchTermRef = useRef<HTMLInputElement>(null)
  const breakpointIndex = useBreakpointIndex()
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    onSearch?.(searchTermRef?.current?.value ?? '')
  }

  /**
   * Auto apply search filter with 500ms timeout.
   */
  const handleChange = (e: React.ChangeEvent) => {
    if (autoFilter) {
      clearTimeout(autoFilter)
      setAutoFilter(undefined)
    }

    setAutoFilter(
      setTimeout(() => {
        onSearch?.(searchTermRef?.current?.value ?? '')
      }, 500)
    )
  }

  const dropdownOptions = ['NFTs', 'Collectors']
  if (!router.pathname.includes('/collection'))
    // if page is not collection page
    dropdownOptions.push('Collections')

  return (
    <>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'row'],
          paddingBottom: '1rem',
          gap: 1,
          position: 'absolute',
          width: '100%',
          height: open ? '170px' : 'auto',
          zIndex: 2,
          background: 'rgba(35, 31, 32, 0.8)', 
        }}
      >
        {breakpointIndex <= 1 && !open && (
          <Flex
            sx={{
              justifyContent: 'flex-end',
              alignItems: 'stretch',
              position: 'absolute',
              zIndex: 0,
              top: 60,
              right: 0,
              width: '100%',
            }}
          >
            {searchForm(handleSearch, searchTerm, searchTermRef, handleChange, true)}
          </Flex>
        )}
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex
            variant="text.h1Secondary"
            sx={{ gap: 2, alignItems: 'flex-start' }}
          >
            Explore
            <SwitchDropdown
              onValueChange={(val) => onChangeTab?.(val)}
              value={tab ?? ''}
              options={dropdownOptions}
              onToggle={(status) => setOpen(status)}
            />
          </Flex>
        </Flex>

        {breakpointIndex > 1 && !open ? (
          <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            {searchForm(handleSearch, searchTerm, searchTermRef, handleChange, false)}
          </Flex>
        ) : null}
      </Flex>
    </>
  )
}

export default function ExplorePanel({
  collectionId,
  collectionName,
}: {
  collectionId?: number
  collectionName?: string
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const [searchTerm, setSearchTerm] = useState('')
  const [tab, setTab] = useState(
    router.pathname.includes('/collection') ? 'NFTs' : 'Collections'
  )
  const handleSearch = (searchTerm) => setSearchTerm(searchTerm)

  return (
    <Panel>
      <Flex sx={{ flexDirection: 'column', gap: 4, position: 'relative' }}>
        <ExplorePanelHead
          onChangeTab={(tab) => setTab(tab)}
          onSearch={handleSearch}
          {...{ searchTerm, tab }}
        />
        <Box sx={{ paddingTop: isMobile ? '110px' : '70px' }}>
          {tab === 'NFTs' && (
            <ExploreNFTs searchTerm={searchTerm} collectionId={collectionId} />
          )}
          {tab === 'Collectors' && !collectionId && <TopCollectors searchTerm={searchTerm} />}
          {tab === 'Collectors' && !!collectionId && (
            <Collectors id={collectionId} name={collectionName} searchTerm={searchTerm}/>
          )}
          {tab === 'Collections' && <TopCollections searchTerm={searchTerm} />}
        </Box>
      </Flex>
    </Panel>
  )
}
