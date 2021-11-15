import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { InputRoundedSearch, Pagination } from '@upshot-tech/upshot-ui'
import {
  Box,
  Flex,
  Panel,
  Skeleton,
  SwitchDropdown,
} from '@upshot-tech/upshot-ui'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import { format } from 'date-fns'
import router from 'next/router'
import React, { useMemo, useRef, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { weiToEth } from 'utils/number'

import {
  GET_EXPLORE_NFTS,
  GetExploreNFTsData,
  GetExploreNFTsVars,
} from '../queries'
import Collectors from './Collectors'
import TopCollectors from './ExplorePanel/TopCollectors'
import ExploreNFTs from './ExplorePanel/NFTs'


function searchForm(handleSearch, searchTerm, searchTermRef, handleChange) {
  return (
    <form onSubmit={handleSearch}>
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

  return (
    <>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          paddingBottom: '1rem',
          gap: 1,
          position: 'absolute',
          width: '100%',
          zIndex: 2,
          background:
            'linear-gradient(180deg, #231F20 60.42%, rgba(35, 31, 32, 0) 100%)',
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex
            variant="text.h1Secondary"
            sx={{ gap: 2, alignItems: 'flex-start' }}
          >
            Explore
            <SwitchDropdown
              onChange={(val) => onChangeTab?.(val)}
              value={tab ?? ''}
              options={['NFTs', 'Collectors']}
            />
          </Flex>
        </Flex>

        {tab === 'NFTs' && breakpointIndex > 1 ? (
          <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            {searchForm(handleSearch, searchTerm, searchTermRef, handleChange)}
          </Flex>
        ) : null}

        {breakpointIndex <= 1 && tab === 'NFTs' && (
          <Flex
            sx={{
              justifyContent: 'flex-end',
              alignItems: 'stretch',
              position: 'absolute',
              zIndex: 0,
              top: 60,
              right: 0,
            }}
          >
            {searchForm(handleSearch, searchTerm, searchTermRef, handleChange)}
          </Flex>
        )}

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
  const [tab, setTab] = useState('NFTs')
  const handleSearch = (searchTerm) => setSearchTerm(searchTerm)

  return (
    <Panel>
      <Flex sx={{ flexDirection: 'column', gap: 4, position: 'relative' }}>
        <ExplorePanelHead
          onChangeTab={(tab) => setTab(tab)}
          onSearch={handleSearch}
          {...{ searchTerm, tab }}
        />
        <Box sx={{ paddingTop: isMobile && tab === 'NFTs' ? '110px' : '70px' }}>
          { tab === 'NFTs' && (
            <ExploreNFTs searchTerm={searchTerm} collectionId={collectionId} />
          )}
          { tab === 'Collectors' && !collectionId &&(
            <TopCollectors />
          )}
          { tab === 'Collectors' && !!collectionId && (
             <Collectors id={collectionId} name={collectionName} />
          )}
        </Box>
      </Flex>
    </Panel>
  )
}
