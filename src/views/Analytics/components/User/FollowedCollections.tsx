import { useQuery } from '@apollo/client'
import {
  Box,
  CollectionGridRow,
  Flex,
  formatNumber,
  Grid,
  Pagination,
  Text,
  useBreakpointIndex
} from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getPriceChangeLabel } from 'utils/number'
import {
GET_FOLLOWED_COLLECTIONS,
  GetFollowedCollectionsData,
  GetFollowedCollectionsVars} from 'views/Analytics/User/queries'

import { PAGE_SIZE } from '../../../../constants/index'
import { ExplorePanelSkeleton } from '../ExplorePanel/NFTs'
import {
  CollectionItemsWrapper,
  CollectionTableHead,
  OrderedAssetColumns
} from '../ExplorePanel/TopCollections'

export const collectionColumns: Partial<OrderedAssetColumns> = {
  PAST_WEEK_VOLUME: 'Volume',
  PAST_WEEK_AVERAGE: 'Avg Price',
  FLOOR: 'Floor',
  PAST_WEEK_FLOOR_CHANGE: 'Floor Change (1W)',
}

const colSpacing =
  '46px minmax(100px,3fr) repeat(4, minmax(80px, 1fr)) minmax(0,50px)'

const FollowedCollections = ({ userId }: { userId?: number }) => {
  const breakpointIndex = useBreakpointIndex()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [selectedColumn, setSelectedColumn] = useState<number>(0)
  const [sortAscending, setSortAscending] = useState(false)

  const isMobile = breakpointIndex <= 1
  const { loading, error, data } = useQuery<
    GetFollowedCollectionsData,
    GetFollowedCollectionsVars
  >(GET_FOLLOWED_COLLECTIONS, {
    errorPolicy: 'all',
    variables: {
      orderColumn: Object.keys(collectionColumns)[selectedColumn],
      orderDirection: sortAscending ? 'ASC' : 'DESC',
      userId: userId,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
    skip: !userId,
  })

  const onChangeSelection = (columnIdx: number, order?: 'asc' | 'desc') => {
    setSelectedColumn(columnIdx)

    if (order === 'asc') return setSortAscending(true)
    if (order === 'desc') return setSortAscending(false)

    // if order is not specified, toggle between ascending and descending
    if (columnIdx === selectedColumn)
      // Toggle sort order for current selection.
      return setSortAscending(!sortAscending)
    // else, set to ascending for new selection.
    return setSortAscending(false)
  }

  const handleChangeSelection = (colIdx: number, order?: 'asc' | 'desc') => {
    onChangeSelection(colIdx, order)
    setPage(0)
  }

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleShowCollection = (id: number) => {
    router.push('/analytics/collection/' + id)
  }

  if (loading)
    return (
      <ExplorePanelSkeleton>
        <CollectionTableHead
          {...{ selectedColumn, sortAscending, handleChangeSelection }}
        />
      </ExplorePanelSkeleton>
    )

  return (
    <>
      <CollectionItemsWrapper
        {...{ selectedColumn, sortAscending, handleChangeSelection }}
      >
        {data?.collectionsFollowedByUser.map(
          ({ id, name, imageUrl, latestStats }, idx) => (
            <CollectionGridRow
              title={name}
              imageSrc={imageUrl!}
              key={idx}
              onClick={() => handleShowCollection(id)}
              href={`/analytics/collection/${id}`}
              defaultOpen={idx === 0 ? true : false}
              subtitle={
                isMobile && latestStats?.pastWeekWeiVolume
                  ? formatNumber(latestStats.pastWeekWeiVolume, {
                      fromWei: true,
                      decimals: 2,
                      kmbUnits: true,
                      prefix: 'ETHER',
                    })
                  : undefined
              }
              fullWidth={isMobile}
              linkComponent={NextLink}
              columns={colSpacing}
              {...{ variant: 'black' }}
            >
              {isMobile ? (
                <Grid columns={['1fr 1fr']} sx={{ padding: 4 }}>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1 }}>
                      {collectionColumns.PAST_WEEK_AVERAGE}
                    </Text>
                    <Text>
                      {latestStats?.pastDayWeiAverage
                        ? formatNumber(latestStats.pastDayWeiAverage, {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1 }}>
                      {collectionColumns.FLOOR}
                    </Text>
                    <Text>
                      {latestStats?.floor
                        ? formatNumber(latestStats.floor, {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ textAlign: 'center', marginBottom: 1 }}>
                      {collectionColumns.PAST_WEEK_FLOOR_CHANGE}
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(
                          latestStats?.weekFloorChange
                        ),
                      }}
                    >
                      {getPriceChangeLabel(latestStats?.weekFloorChange)}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <Box>
                    {latestStats?.pastWeekWeiVolume
                      ? formatNumber(latestStats.pastWeekWeiVolume, {
                          fromWei: true,
                          decimals: 2,
                          kmbUnits: true,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {latestStats?.pastDayWeiAverage
                      ? formatNumber(latestStats.pastDayWeiAverage, {
                          fromWei: true,
                          decimals: 2,
                          kmbUnits: true,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {latestStats?.floor
                      ? formatNumber(latestStats.floor, {
                          fromWei: true,
                          decimals: 2,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </Box>
                  <Box
                    sx={{
                      maxWidth: [100, 100, 200],
                      color: getPriceChangeColor(latestStats?.weekFloorChange),
                    }}
                  >
                    {getPriceChangeLabel(latestStats?.weekFloorChange)}
                  </Box>
                </>
              )}
            </CollectionGridRow>
          )
        )}
      </CollectionItemsWrapper>

      <Flex sx={{ justifyContent: 'center', marginTop: '10px', width: '100%' }}>
        <Pagination
          forcePage={page}
          pageCount={Math.ceil(
            (data?.collectionsFollowedByUser?.length ?? 0) / PAGE_SIZE
          )}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}

export default FollowedCollections
