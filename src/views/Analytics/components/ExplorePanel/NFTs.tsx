import { useQuery } from '@apollo/client'
import { CollectorAccordion, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination, useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Icon, Skeleton, Text } from '@upshot-tech/upshot-ui'
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
import React, { useEffect, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getPriceChangeLabel, weiToEth } from 'utils/number'

import {
  GET_EXPLORE_NFTS,
  GetExploreNFTsData,
  GetExploreNFTsVars,
} from '../../queries'

const columns = {
  LAST_SALE_DATE: 'Last Sale',
  LAST_SALE_PRICE: 'Last Sale Price',
  LAST_APPRAISAL_PRICE: 'Latest Appraisal',
  LAST_SALE_LATEST_APPRAISAL: 'Last Sale/Appraisal',
}

function NFTTableHead() {
  const [selectedColumn, setSelectedColumn] = useState(1)
  const [sortAscending, setSortAscending] = useState(false)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { theme } = useTheme()

  const handleChangeSelection = (columnIdx: number) => {
    if (columnIdx === selectedColumn) {
      // Toggle sort order for current selection.
      setSortAscending(!sortAscending)
    }

    setSelectedColumn(columnIdx)
  }

  return (
    <>
      {!isMobile && (
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
                userSelect: 'none',
                transition: 'default',
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
            {Object.values(columns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                onClick={() => handleChangeSelection(idx + 1)}
                colSpan={idx === Object.values(columns).length - 1 ? 2 : 1}
                sx={{
                  cursor: 'pointer',
                  color: selectedColumn === idx + 1 ? 'white' : null,
                  transition: 'default',
                  userSelect: 'none',
                  minWidth: 100,
                  width: idx === 0 ? '100%' : 'auto',
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
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
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
          </TableRow>
        </TableHead>
      )}
    </>
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
            <TableCell colSpan={7}>
              <Box sx={{ height: 40, width: '100%' }} />
            </TableCell>
          </Skeleton>
        ))}
      </TableBody>
    </CollectionTable>
  )
}

const NFTItemsWrapper = ({ children }) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  return (
    <>
      {isMobile ? (
        <>
          <NFTTableHead />
          <CollectorAccordion> {children} </CollectorAccordion>
        </>
      ) : (
        <CollectionTable>
          <NFTTableHead />
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

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Loading state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <NFTItemsWrapper>
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
              defaultOpen={idx === 0 ? true : false}
              onClick={() => handleShowNFT(id)}
              pixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      Last Sale Date
                    </Text>
                    <Text>
                      {lastSale?.timestamp
                        ? format(lastSale.timestamp * 1000, 'M/d/yyyy')
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      Last Sale Price
                    </Text>
                    <Text>
                      {lastSale?.ethSalePrice
                        ? weiToEth(lastSale.ethSalePrice)
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      Latest Appraised Value
                    </Text>
                    <Text>
                      {lastAppraisalWeiPrice
                        ? weiToEth(lastAppraisalWeiPrice)
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      Last Sale/Latest Appraisal
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(
                          lastSaleAppraisalRelativeDiff
                        ),
                      }}
                    >
                      {getPriceChangeLabel(lastSaleAppraisalRelativeDiff)}
                    </Text>
                  </Flex>
                </Grid>
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
                      color: getPriceChangeColor(lastSaleAppraisalRelativeDiff),
                    }}
                  >
                    {getPriceChangeLabel(lastSaleAppraisalRelativeDiff)}
                  </TableCell>
                </>
              )}
            </CollectionRow>
          )
        )}
      </NFTItemsWrapper>
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
