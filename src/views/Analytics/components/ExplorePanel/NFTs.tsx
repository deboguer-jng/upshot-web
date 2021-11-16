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
} from '../../queries'

const columns = ['Last Sale', 'Total Sales', 'Sale Price', '% Change']


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

const handleShowNFT = (id: string) => {
  router.push('/analytics/nft/' + id)
}

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

export function ExplorePanelSkeleton() {
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


/**
 *Default render function
 */
export default function ExploreNFTs({
  searchTerm = '',
  collectionId,
}: {
  searchTerm?: string
  collectionId?: number
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

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

  /* Loading state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch.assets.length)
    return <div>No results available.</div>

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
}