import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { InputRoundedSearch, Pagination } from '@upshot-tech/upshot-ui'
import { Box, Flex, Icon, Panel, Skeleton } from '@upshot-tech/upshot-ui'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { weiToEth } from 'utils/number'

import {
  GET_EXPLORE_NFTS,
  GetExploreNFTsData,
  GetExploreNFTsVars,
} from '../queries'

const columns = ['Last Sale', 'Total Sales', '% Change']

/**
 * Get price change label.
 *
 * @returns + prefixed percent if positive, - prefixed percent if negative.
 */
const getPriceChangeLabel = (val: number | null) => {
  if (val === null) return '-'

  const percentChange = val.toFixed(2) + '%'
  switch (true) {
    case val > 0:
      return '+' + percentChange
    case val < 0:
      return '-' + percentChange
    default:
      return percentChange
  }
}

function CollectionTableHead() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <TableHead>
      <TableRow>
        <TableCell colSpan={2} color="grey-500">
          Name
        </TableCell>
        {isMobile ? (
          // Mobile only shows the first and last columns
          <TableCell sx={{ minWidth: 100 }} color="grey-500">
            Details
          </TableCell>
        ) : (
          <>
            {columns.map((col, key) => (
              <TableCell key={key} sx={{ minWidth: 100 }} color="grey-500">
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
  onSearch?: (searchTerm: string) => void
}

function ExplorePanelHead({ onSearch, searchTerm }: ExplorePanelHeadProps) {
  const searchTermRef = useRef<HTMLInputElement>(null)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    onSearch?.(searchTermRef?.current?.value ?? '')
  }

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: ['column', 'column', 'row'],
        gap: 2,
      }}
    >
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex variant="text.h1Secondary" sx={{ gap: 2 }}>
          Explore
          <Flex
            color="primary"
            sx={{ justifyContent: 'center', alignItems: 'center', gap: 2 }}
          >
            NFTs
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
        <form onSubmit={handleSearch}>
          <InputRoundedSearch
            dark
            fullWidth
            hasButton
            defaultValue={searchTerm}
            ref={searchTermRef}
            buttonProps={{
              type: 'button',
              onClick: handleSearch,
            }}
          />
        </form>
      </Flex>
    </Flex>
  )
}

function ExplorePanelSkeleton({ searchTerm }: { searchTerm: string }) {
  return (
    <Panel>
      <ExplorePanelHead {...{ searchTerm }} />
      <CollectionTable>
        <CollectionTableHead />
        <TableBody>
          {[...new Array(PAGE_SIZE)].map((_, idx) => (
            <Skeleton sx={{ height: 56 }} as="tr" key={idx}>
              <TableCell colSpan={5}>
                <Box sx={{ height: 40, width: '100%' }} />
              </TableCell>
            </Skeleton>
          ))}
        </TableBody>
      </CollectionTable>
    </Panel>
  )
}

export default function ExplorePanel({ id }: { id?: number }) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const { loading, error, data } = useQuery<
    GetExploreNFTsData,
    GetExploreNFTsVars
  >(GET_EXPLORE_NFTS, {
    errorPolicy: 'all',
    variables: { limit: PAGE_SIZE, offset: page * PAGE_SIZE, searchTerm, id },
  })

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleSearch = (searchTerm) => setSearchTerm(searchTerm)

  /* Loading state. */
  if (loading) return <ExplorePanelSkeleton {...{ searchTerm }} />

  /* Error state. */
  if (error) return <Panel>There was an error completing your request.</Panel>

  /* No results state. */
  if (!data?.assetGlobalSearch.assets.length)
    return (
      <Panel>
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <ExplorePanelHead onSearch={handleSearch} {...{ searchTerm }} />
          <div>No results available.</div>
        </Flex>
      </Panel>
    )

  const handleShowNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  return (
    <Panel>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <ExplorePanelHead onSearch={handleSearch} {...{ searchTerm }} />
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
                        {lastSale?.ethSalePrice
                          ? weiToEth(lastSale.ethSalePrice)
                          : '-'}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 100 }}>
                        {totalSaleCount}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 100,
                          color: getPriceChangeColor(priceChangeFromFirstSale),
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
            pageRangeDisplayed={isMobile ? 3 : 5}
            marginPagesDisplayed={isMobile ? 1 : 5}
            onPageChange={handlePageChange}
          />
        </Flex>
      </Flex>
    </Panel>
  )
}
