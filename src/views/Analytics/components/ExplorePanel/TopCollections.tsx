import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
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
import { weiToEth, getPriceChangeLabel } from 'utils/number'

import {
  GET_EXPLORE_COLLECTIONS,
  GetExploreCollectionsData,
  GetExploreCollectionsVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

const columns = ['Average Price', 'Total Volume', 'Floor Price', 'Floor Change (7 Days)']

function CollectionTableHead() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell color="grey-500">Collection</TableCell>
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

const handleShowCollection = (id: number) => {
  router.push('/analytics/collection/' + id)
}

/**
 *Default render function
 */
export default function ExploreNFTs({
  searchTerm = '',
}: {
  searchTerm?: string
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const { loading, error, data } = useQuery<
    GetExploreCollectionsData,
    GetExploreCollectionsVars
  >(GET_EXPLORE_COLLECTIONS, {
    errorPolicy: 'ignore',
    variables: {
      metric: 'VOLUME',
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
  })

  /* Loading state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return <div>There was an error completing your request.</div>

  if (!data?.orderedCollectionsByMetricSearch.assetSets.length)
    return <div>No results available.</div>

  return (
    <>
      <CollectionTable>
        <CollectionTableHead />
        <TableBody>
          {data.orderedCollectionsByMetricSearch.assetSets.map(
            ({ id, name, imageUrl, average, floor, totalVolume, sevenDayFloorChange }, idx) => (
              <CollectionRow
                variant="black"
                title={name}
                imageSrc={imageUrl!}
                key={idx}
                onClick={() => handleShowCollection(id)}
              >
                {isMobile ? (
                  <TableCell sx={{ maxWidth: 100 }}>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Flex>Avg: {weiToEth(average)}</Flex>
                      <Flex>Vol: {weiToEth(totalVolume, 0)}</Flex>
                    </Flex>
                  </TableCell>
                ) : (
                  <>
                    <TableCell sx={{ maxWidth: 100 }}>
                      {weiToEth(average, 2)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>
                      {weiToEth(floor, 2)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100 }}>
                      {weiToEth(totalVolume, 0)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100, color: getPriceChangeColor(sevenDayFloorChange) }}>
                      {getPriceChangeLabel(sevenDayFloorChange)}
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
          pageCount={Math.ceil(
            data.orderedCollectionsByMetricSearch.count / PAGE_SIZE
          )}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
