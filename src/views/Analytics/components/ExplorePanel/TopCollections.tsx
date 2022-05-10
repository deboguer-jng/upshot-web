/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  Icon,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { CollectionGridRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination, useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import { formatNumber } from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import NextLink from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getPriceChangeLabel } from 'utils/number'

import {
  GET_EXPLORE_COLLECTIONS,
  GetExploreCollectionsData,
  GetExploreCollectionsVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

export enum EAssetSetStatSearchOrder {
  FLOOR,
  CEIL,
  ALL_TIME_VOLUME,
  PAST_DAY_VOLUME,
  PAST_WEEK_VOLUME,
  PAST_DAY_AVERAGE,
  PAST_WEEK_AVERAGE,
  PAST_WEEK_CAP_CHANGE,
  PAST_WEEK_FLOOR_CHANGE,
  PAST_MONTH_TRANSACTIONS,
  MEDIAN_RELATIVE_ERROR,
}

export type OrderedAssetColumns = {
  [key in keyof typeof EAssetSetStatSearchOrder]: string
}

interface CollectionTableHeadProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The current selected column index used for sorting.
   */
  selectedColumn: number
  /**
   * Request the results in ascending order.
   */
  sortAscending: boolean
  /**
   * Handler for selection change
   */
  onChangeSelection?: (colIdx: number) => void
}

export const collectionColumns: Partial<OrderedAssetColumns> = {
  PAST_WEEK_VOLUME: 'Volume',
  PAST_WEEK_AVERAGE: 'Avg Price',
  FLOOR: 'Floor',
  PAST_WEEK_FLOOR_CHANGE: 'Floor Change (1W)',
}

const colSpacing =
  '46px minmax(100px,3fr) repeat(4, minmax(80px, 1fr)) minmax(0,50px)'

function CollectionTableHead({
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: CollectionTableHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const { theme } = useTheme()

  return (
    <>
      {isMobile ? (
        <Box sx={{ width: '100%', paddingRight: '44px' }}>
          <Flex sx={{ justifyContent: 'space-between', padding: 2 }}>
            <Text></Text>
            <Text>{collectionColumns.PAST_WEEK_VOLUME}</Text>
          </Flex>
        </Box>
      ) : (
        <Grid
          columns={colSpacing}
          sx={{ padding: [1, 3].map((n) => theme.space[n] + 'px').join(' ') }}
        >
          <Box />
          <Box />
          {Object.values(collectionColumns).map((col, idx) => (
            <Box
              key={idx}
              color="grey-500"
              onClick={() => onChangeSelection?.(idx)}
              sx={{
                cursor: 'pointer',
                color: selectedColumn === idx ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                '& svg path': {
                  transition: 'default',
                  '&:nth-child(1)': {
                    fill:
                      selectedColumn === idx && sortAscending
                        ? 'white'
                        : theme.rawColors['grey-500'],
                  },
                  '&:nth-child(2)': {
                    fill:
                      !sortAscending && selectedColumn === idx
                        ? 'white'
                        : theme.rawColors['grey-500'],
                  },
                },
              }}
            >
              <Flex
                sx={{
                  alignItems: 'center',
                  'white-space': 'nowrap',
                  fontSize: '.85rem',
                }}
              >
                {col}
                <Icon icon="tableSort" height={16} width={16} />
              </Flex>
            </Box>
          ))}
          <Box />
        </Grid>
      )}
    </>
  )
}

const handleShowCollection = (id: number) => {
  router.push('/analytics/collection/' + id)
}

const CollectionItemsWrapper = ({
  children,
  ...props
}: CollectionTableHeadProps) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <Box sx={{ paddingTop: '8px' }}>
      {isMobile ? (
        <>
          <CollectionTableHead {...props} />
          <CollectorAccordion fullWidth>{children}</CollectorAccordion>
        </>
      ) : (
        <>
          <CollectionTableHead {...props} />
          <Box>{children}</Box>
        </>
      )}
    </Box>
  )
}

/**
 *Default render function
 */
export default function ExploreCollections({
  searchTerm = '',
  variant = 'black',
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: {
  variant?: 'black' | 'dark' | 'normal'
  searchTerm?: string
  selectedColumn: number
  sortAscending: boolean
  onChangeSelection: (colIdx: number) => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleChangeSelection = (colIdx: number) => {
    onChangeSelection(colIdx)
    setPage(0)
  }

  const { loading, error, data } = useQuery<
    GetExploreCollectionsData,
    GetExploreCollectionsVars
  >(GET_EXPLORE_COLLECTIONS, {
    errorPolicy: 'ignore',
    variables: {
      orderColumn: Object.keys(collectionColumns)[selectedColumn],
      orderDirection: sortAscending ? 'ASC' : 'DESC',
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      name: searchTerm,
    },
  })

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Loading state. */
  if (loading)
    return (
      <ExplorePanelSkeleton>
        <CollectionTableHead {...{ selectedColumn, sortAscending }} />
      </ExplorePanelSkeleton>
    )

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.searchCollectionByMetric.assetSets.length)
    return <div>No results available.</div>

  const dataCheck = (data) => {
    return data ? data : '-'
  }

  return (
    <>
      <CollectionItemsWrapper
        onChangeSelection={handleChangeSelection}
        {...{ selectedColumn, sortAscending }}
      >
        {data.searchCollectionByMetric.assetSets.map(
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
              {...{ variant }}
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
          pageCount={Math.ceil(data.searchCollectionByMetric.count / PAGE_SIZE)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
