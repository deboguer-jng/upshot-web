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
import TopCollectors from './TopCollectors'

const columns = ['Last Sale', 'Total Sales', 'Sale Price', '% Change']

/**
 * Get price change label.
 *
 * @returns + prefixed percent if positive, - prefixed percent if negative.
 */
const getPriceChangeLabel = (val: number | null) => {
  if (val === null) return '-'

  const percentChange = val.toFixed(2) + '%'
  return val > 0 ? '+' + percentChange : percentChange
}

function CollectionTableHead() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell color="grey-500">NFT Name</TableCell>
        {isMobile ? (
          // Mobile only shows the first and last columns
          <TableCell color="grey-500">Details</TableCell>
        ) : (
          <>
            {columns.map((col, key) => (
              <TableCell key={key} color="grey-500">
                {col}
              </TableCell>
            ))}
          </>
        )}
      </TableRow>
    </TableHead>
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
          </Flex>
        ) : null}
      </Flex>
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
        </Flex>
      )}
    </>
  )
}

function ExplorePanelSkeleton() {
  return (
    <CollectionTable>
      <CollectionTableHead />
      <TableBody>
        {[...new Array(PAGE_SIZE)].map((_, idx) => (
          <Skeleton sx={{ height: 56 }} as="tr" key={idx}>
            <TableCell colSpan={6}>
              <Box sx={{ height: 40, width: '100%' }} />
            </TableCell>
          </Skeleton>
        ))}
      </TableBody>
    </CollectionTable>
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

  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [tab, setTab] = useState('NFTs')

  const { loading, error, data } = useQuery<
    GetExploreNFTsData,
    GetExploreNFTsVars
  >(GET_EXPLORE_NFTS, {
    errorPolicy: 'all',
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      searchTerm,
      collectionId,
    },
  })

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleSearch = (searchTerm) => setSearchTerm(searchTerm)

  const content = useMemo(() => {
    /* Loading state. */
    if (loading) return <ExplorePanelSkeleton />

    /* Error state. */
    if (error) return <div>There was an error completing your request.</div>

    if (!data?.assetGlobalSearch.assets.length)
      return <div>No results available.</div>

    if (tab === 'NFTs')
      return (
        <>
          <CollectionTable>
            <CollectionTableHead />
            <TableBody>
              {data.assetGlobalSearch.assets.map(
                (
                  {
                    id,
                    name,
                    previewImageUrl,
                    mediaUrl,
                    totalSaleCount,
                    priceChangeFromFirstSale,
                    lastSale,
                  },
                  idx
                ) => (
                  <CollectionRow
                    dark
                    title={name}
                    imageSrc={previewImageUrl ?? mediaUrl}
                    key={idx}
                    onClick={() => handleShowNFT(id)}
                  >
                    {isMobile ? (
                      <TableCell sx={{ maxWidth: 100 }}>
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                          }}
                        >
                          <Flex>
                            {lastSale?.ethSalePrice
                              ? weiToEth(lastSale.ethSalePrice)
                              : '-'}
                          </Flex>
                          <Flex
                            sx={{
                              maxWidth: 100,
                              color: getPriceChangeColor(
                                priceChangeFromFirstSale
                              ),
                            }}
                          >
                            {getPriceChangeLabel(priceChangeFromFirstSale)}
                          </Flex>
                        </Flex>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell sx={{ maxWidth: 100 }}>
                          {lastSale?.timestamp
                            ? format(lastSale.timestamp * 1000, 'M/d/yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 100 }}>
                          {totalSaleCount}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 100 }}>
                          {lastSale?.ethSalePrice
                            ? weiToEth(lastSale.ethSalePrice)
                            : '-'}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 100,
                            color: getPriceChangeColor(
                              priceChangeFromFirstSale
                            ),
                          }}
                        >
                          {getPriceChangeLabel(priceChangeFromFirstSale)}
                        </TableCell>
                      </>
                    )}
                  </CollectionRow>
                )
              )}
            </TableBody>
          </CollectionTable>
          <Flex sx={{ justifyContent: 'center', marginTop: -1 }}>
            <Pagination
              forcePage={page}
              pageCount={Math.ceil(data.assetGlobalSearch.count / PAGE_SIZE)}
              pageRangeDisplayed={0}
              marginPagesDisplayed={0}
              onPageChange={handlePageChange}
            />
          </Flex>
        </>
      )

    return collectionId ? (
      <Collectors id={collectionId} name={collectionName} />
    ) : (
      <TopCollectors />
    )
  }, [tab, loading, error, data, collectionId, collectionName, isMobile, page])

  const handleShowNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  return (
    <Panel>
      <Flex sx={{ flexDirection: 'column', gap: 4, position: 'relative' }}>
        <ExplorePanelHead
          onChangeTab={(tab) => setTab(tab)}
          onSearch={handleSearch}
          {...{ searchTerm, tab }}
        />
        <Box sx={{ paddingTop: isMobile && tab === 'NFTs' ? '110px' : '70px' }}>
          {content}
        </Box>
      </Flex>
    </Panel>
  )
}
