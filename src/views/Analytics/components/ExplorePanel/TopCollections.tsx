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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getPriceChangeLabel, weiToEth } from 'utils/number'

import {
  GET_EXPLORE_COLLECTIONS,
  GetExploreCollectionsData,
  GetExploreCollectionsVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

const columns = {
  VOLUME: 'Total Volume',
  AVERAGE: 'Average Price',
  FLOOR: 'Floor Price',
  WEEK_FLOOR_CHANGE: 'Floor Change (7 Days)',
}

function CollectionTableHead() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [selectedColumn, setSelectedColumn] = useState(0)
  const [sortAscending, setSortAscending] = useState(false)
  const { theme } = useTheme()

  const handleChangeSelection = (columnIdx: number) => {
    console.log({ columnIdx })
    if (columnIdx === selectedColumn) {
      // Toggle sort order for current selection.
      setSortAscending(!sortAscending)
    }

    setSelectedColumn(columnIdx)
  }

  return (
    <>
      {isMobile ? (
        <Box>
          <Flex sx={{ justifyContent: 'space-between', padding: 2 }}>
            <Text> Collection </Text>
            <Text> Total Volume </Text>
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
              <Flex sx={{ alignItems: 'center' }}>
                Collection
                {/* <Icon icon="tableSort" height={16} width={16} /> */}
              </Flex>
            </TableCell>
            {Object.values(columns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                onClick={() => handleChangeSelection(idx + 1)}
                sx={{
                  cursor: 'pointer',
                  color: selectedColumn === idx + 1 ? 'white' : null,
                  transition: 'default',
                  userSelect: 'none',
                  '& svg path': {
                    transition: 'default',
                    '&:nth-child(1)': {
                      fill:
                        selectedColumn === idx + 1 && sortAscending
                          ? 'white'
                          : theme.rawColors['grey-500'],
                    },
                    '&:nth-child(2)': {
                      fill:
                        !sortAscending && selectedColumn === idx + 1
                          ? 'white'
                          : theme.rawColors['grey-500'],
                    },
                  },
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  {col}
                  <Icon icon="tableSort" height={16} width={16} />
                </Flex>
              </TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
      )}
    </>
  )
}

const handleShowCollection = (id: number) => {
  router.push('/analytics/collection/' + id)
}

const CollectionItemsWrapper = ({ children }) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  return (
    <>
      {isMobile ? (
        <>
          <CollectionTableHead />
          <CollectorAccordion>{children}</CollectorAccordion>
        </>
      ) : (
        <CollectionTable>
          <CollectionTableHead />
          <TableBody>{children}</TableBody>
        </CollectionTable>
      )}
    </>
  )
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
      name: searchTerm,
    },
  })

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Loading state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.orderedCollectionsByMetricSearch.assetSets.length)
    return <div>No results available.</div>

  const dataCheck = (data) => {
    return data ? data : '-'
  }

  return (
    <>
      <CollectionItemsWrapper>
        {data.orderedCollectionsByMetricSearch.assetSets.map(
          ({ id, name, imageUrl, latestStats }, idx) => (
            <CollectionRow
              variant="black"
              title={name}
              imageSrc={imageUrl!}
              key={idx}
              onClick={() => handleShowCollection(id)}
              defaultOpen={idx === 0 ? true : false}
              totalVolume={
                isMobile ? weiToEth(latestStats.totalWeiVolume, 0) : null
              }
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
                    <Text sx={{ marginBottom: 1 }}>Average Price</Text>
                    {/* <Text>
                      {dataCheck(weiToEth(latestStats.pastDayWeiAverage, 2))}
                    </Text> */}
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1 }}>Floor Price</Text>
                    <Text>{dataCheck(weiToEth(latestStats.floor, 2))}</Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ textAlign: 'center', marginBottom: 1 }}>
                      Floor Change
                      <br /> (7 Days)
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(latestStats.weekFloorChange),
                      }}
                    >
                      {getPriceChangeLabel(latestStats.weekFloorChange)}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <TableCell sx={{ maxWidth: 100 }}>
                    {dataCheck(weiToEth(latestStats.totalWeiVolume, 0))}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    {dataCheck(weiToEth(latestStats.pastDayWeiAverage, 2))}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 100 }}>
                    {dataCheck(weiToEth(latestStats.floor, 2))}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 100,
                      color: getPriceChangeColor(latestStats.weekFloorChange),
                    }}
                  >
                    {getPriceChangeLabel(latestStats.weekFloorChange)}
                  </TableCell>
                </>
              )}
            </CollectionRow>
          )
        )}
      </CollectionItemsWrapper>

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
