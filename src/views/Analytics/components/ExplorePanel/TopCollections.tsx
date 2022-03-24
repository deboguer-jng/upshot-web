/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  Icon,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination, useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import {
  formatNumber,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
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
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell
              color="grey-500"
              /**
               * Collection sorting currently not available from API.
               */
              // onClick={() => handleChangeSelection(0)}
              sx={{
                cursor: 'pointer',
                color: selectedColumn === 0 ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                '& svg path': {
                  transition: 'default',
                  '&:nth-of-type(1)': {
                    fill:
                      selectedColumn === 0 && sortAscending
                        ? 'white'
                        : theme.rawColors['grey-500'],
                  },
                  '&:nth-of-type(2)': {
                    fill:
                      !sortAscending && selectedColumn === 0
                        ? 'white'
                        : theme.rawColors['grey-500'],
                  },
                },
              }}
            >
              {/* Unsortable name column */}
            </TableCell>
            {Object.values(collectionColumns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                onClick={() => onChangeSelection?.(idx)}
                sx={{
                  cursor: 'pointer',
                  color: selectedColumn === idx ? 'white' : null,
                  transition: 'default',
                  userSelect: 'none',
                  minWidth: 100,
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
                <Flex sx={{ alignItems: 'center' }}>
                  <Flex
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '.85rem',
                    }}
                  >
                    {col}
                  </Flex>
                  <Icon icon="tableSort" height={16} width={16} />
                </Flex>
              </TableCell>
            ))}
            <TableCell sx={{ width: '40px !important' }} />
          </TableRow>
        </TableHead>
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
    <>
      {isMobile ? (
        <>
          <CollectionTableHead {...props} />
          <CollectorAccordion fullWidth>{children}</CollectorAccordion>
        </>
      ) : (
        <CollectionTable>
          <CollectionTableHead {...props} />
          <TableBody>{children}</TableBody>
        </CollectionTable>
      )}
    </>
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
            <CollectionRow
              title={name}
              imageSrc={imageUrl!}
              key={idx}
              onClick={() => handleShowCollection(id)}
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
                  <TableCell sx={{ maxWidth: 50 }}>
                    {latestStats?.pastWeekWeiVolume
                      ? formatNumber(latestStats.pastWeekWeiVolume, {
                          fromWei: true,
                          decimals: 2,
                          kmbUnits: true,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 50 }}>
                    {latestStats?.pastDayWeiAverage
                      ? formatNumber(latestStats.pastDayWeiAverage, {
                          fromWei: true,
                          decimals: 2,
                          kmbUnits: true,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 50 }}>
                    {latestStats?.floor
                      ? formatNumber(latestStats.floor, {
                          fromWei: true,
                          decimals: 2,
                          prefix: 'ETHER',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 50,
                      color: getPriceChangeColor(latestStats?.weekFloorChange),
                    }}
                  >
                    {getPriceChangeLabel(latestStats?.weekFloorChange)}
                  </TableCell>
                </>
              )}
            </CollectionRow>
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
