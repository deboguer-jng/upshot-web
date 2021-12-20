import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination } from '@upshot-tech/upshot-ui'
import {
  Box,
  Flex,
  Skeleton,
} from '@upshot-tech/upshot-ui'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import { format } from 'date-fns'
import router from 'next/router'
import React, { useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getPriceChangeLabel, weiToEth } from 'utils/number'

import {
  GET_EXPLORE_NFTS,
  GetExploreNFTsData,
  GetExploreNFTsVars,
} from '../../queries'

const columns = [
  'Last Sale Date',
  'Last Sale Price',
  'Latest Appraised Value',
  'Last Sale/Latest Appraisal',
]

function NFTTableHead() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell color="grey-500">NFT</TableCell>
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

export function ExplorePanelSkeleton() {
  return (
    <CollectionTable>
      <NFTTableHead />
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

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <CollectionTable>
        <NFTTableHead />
        <TableBody>
          {data.assetGlobalSearch.assets.map(
            (
              {
                id,
                name,
                contractAddress,
                previewImageUrl,
                mediaUrl,
                totalSaleCount,
                lastSale,
                lastAppraisalWeiPrice,
                lastSaleAppraisalRelativeDiff,
              },
              idx
            ) => (
              <CollectionRow
                variant="black"
                title={name}
                imageSrc={previewImageUrl ?? mediaUrl}
                key={idx}
                onClick={() => handleShowNFT(id)}
                pixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
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
                      <Flex>
                        {lastAppraisalWeiPrice
                          ? weiToEth(lastAppraisalWeiPrice)
                          : '-'}
                      </Flex>
                      <Flex
                        sx={{
                          maxWidth: 100,
                          color: getPriceChangeColor(
                            lastSaleAppraisalRelativeDiff
                          ),
                        }}
                      >
                        {getPriceChangeLabel(lastSaleAppraisalRelativeDiff)}
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
                      {lastSale?.ethSalePrice
                        ? weiToEth(lastSale.ethSalePrice)
                        : '-'}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>
                      {lastAppraisalWeiPrice
                        ? weiToEth(lastAppraisalWeiPrice)
                        : '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 100,
                        color: getPriceChangeColor(
                          lastSaleAppraisalRelativeDiff
                        ),
                      }}
                    >
                      {getPriceChangeLabel(lastSaleAppraisalRelativeDiff)}
                    </TableCell>
                  </>
                )}
              </CollectionRow>
            )
          )}
        </TableBody>
      </CollectionTable>
      <Flex sx={{ justifyContent: 'center', marginTop: '10px' }}>
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
