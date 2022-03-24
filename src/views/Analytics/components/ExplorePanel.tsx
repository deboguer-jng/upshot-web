import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { InputRoundedSearch } from '@upshot-tech/upshot-ui'
import { Box, Flex, Panel, SwitchDropdown } from '@upshot-tech/upshot-ui'
import router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import Collectors from './ExplorePanel/Collectors'
import ExploreListedNFTs from './ExplorePanel/ListedNFTs'
import ExploreNFTs from './ExplorePanel/NFTs'
import TopCollections from './ExplorePanel/TopCollections'
import Traits from './ExplorePanel/Traits'

function searchForm(
  handleSearch,
  searchTerm,
  searchTermRef,
  handleChange,
  isMobile
) {
  return (
    <form style={isMobile ? { width: '100%' } : {}} onSubmit={handleSearch}>
      <InputRoundedSearch
        dark
        fullWidth
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

  const clearAutoFilter = () => {
    clearTimeout(autoFilter)
    setAutoFilter(undefined)
  }

  /**
   * Auto apply search filter with 500ms timeout.
   */
  const handleChange = (e: React.ChangeEvent) => {
    if (autoFilter) clearAutoFilter()

    setAutoFilter(
      setTimeout(() => {
        onSearch?.(searchTermRef?.current?.value ?? '')
      }, 500)
    )
  }

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    if (autoFilter) clearAutoFilter()
    e.preventDefault()

    onSearch?.(searchTermRef?.current?.value ?? '')
  }

  const dropdownOptions = ['Listed NFTs', 'NFTs', 'Collectors']
  if (!router.pathname.includes('/collection'))
    // if page is not collection page
    dropdownOptions.push('Collections')
  if (router.pathname.includes('/collection')) dropdownOptions.push('Traits')

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
          height: open ? '250px' : 'auto',
          zIndex: 2,
          background: `linear-gradient(
              180deg,
              rgba(35, 31, 32, 0.7) 0%,
              rgba(35, 31, 32, 0.85) 70%,
              rgba(35, 31, 32, 0) 100%
            )`,
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
            {searchForm(
              handleSearch,
              searchTerm,
              searchTermRef,
              handleChange,
              true
            )}
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
            {searchForm(
              handleSearch,
              searchTerm,
              searchTermRef,
              handleChange,
              false
            )}
          </Flex>
        ) : null}
      </Flex>
    </>
  )
}

export default function ExplorePanel({
  collectionId,
  collectionName,
  isAppraised,
}: {
  collectionId?: number
  collectionName?: string
  isAppraised?: boolean
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const [searchTerm, setSearchTerm] = useState('')
  const [tab, setTab] = useState(
    router.pathname.includes('/collection') ? 'Listed NFTs' : 'Collections'
  )
  const [selectedColumn, setSelectedColumn] = useState<number>(0)
  const [sortAscending, setSortAscending] = useState(false)
  const handleSearch = (searchTerm: string) => setSearchTerm(searchTerm)

  const handleChangeSelection = (columnIdx: number) => {
    if (columnIdx === selectedColumn) {
      // Toggle sort order for current selection.
      setSortAscending(!sortAscending)
    }

    setSelectedColumn(columnIdx)
  }

  useEffect(() => {
    // Reset sort + selection on new tab selection.
    switch (tab) {
      case 'Listed NFTs': {
        setSelectedColumn(isAppraised ? 3 : 2)
        setSortAscending(true)
        break
      }
      case 'NFTs': {
        setSelectedColumn(0)
        setSortAscending(true)
        break
      }
      default: {
        setSelectedColumn(0)
        setSortAscending(false)
        break
      }
    }
  }, [tab])

  return (
    <Panel
      sx={{
        marginLeft: isMobile ? '-1rem' : 0,
        marginRight: isMobile ? '-1rem' : 0,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 4, position: 'relative' }}>
        <ExplorePanelHead
          onChangeTab={(tab) => setTab(tab)}
          onSearch={handleSearch}
          {...{ searchTerm, tab }}
        />
        <Box sx={{ paddingTop: isMobile ? '110px' : '70px' }}>
          {tab === 'Listed NFTs' && (
            <ExploreListedNFTs
              onChangeSelection={handleChangeSelection}
              {...{ searchTerm, selectedColumn, sortAscending, collectionId }}
            />
          )}
          {tab === 'NFTs' && (
            <ExploreNFTs
              onChangeSelection={handleChangeSelection}
              {...{ searchTerm, selectedColumn, sortAscending, collectionId }}
            />
          )}
          {tab === 'Traits' && !!collectionId && (
            <Traits
              onChangeSelection={handleChangeSelection}
              {...{ searchTerm, selectedColumn, sortAscending, collectionId }}
            />
          )}
          {tab === 'Collectors' && !collectionId && (
            <Collectors searchTerm={searchTerm} />
          )}
          {tab === 'Collectors' && !!collectionId && (
            <Collectors
              id={collectionId}
              name={collectionName}
              searchTerm={searchTerm}
            />
          )}
          {tab === 'Collections' && (
            <TopCollections
              onChangeSelection={handleChangeSelection}
              {...{ searchTerm, selectedColumn, sortAscending }}
            />
          )}
        </Box>
      </Flex>
    </Panel>
  )
}
