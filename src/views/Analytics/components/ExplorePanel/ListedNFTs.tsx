import { useQuery } from '@apollo/client'
import { CollectorAccordion, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination, useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Icon, Skeleton, Text } from '@upshot-tech/upshot-ui'
import {
  formatNumber,
  Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import NextLink from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getUnderOverPricedLabel } from 'utils/number'
import { formatDistance } from 'utils/time'

import {
  GET_EXPLORE_NFTS,
  GetExploreNFTsData,
  GetExploreNFTsVars,
} from '../../queries'
import { getOrderDirection, lacksGlobalAssetFilters } from './util'

interface NFTTableHeadProps extends React.HTMLAttributes<HTMLElement> {
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

export const listedNftColumns = {
  LAST_APPRAISAL_PRICE: 'Last Appraisal',
  LIST_PRICE: 'List Price',
  LIST_TIMESTAMP: 'Listed',
  LIST_APPRAISAL_RATIO: '% Difference',
}

function ListedNFTTableHead({
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: NFTTableHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { theme } = useTheme()

  return (
    <>
      {!isMobile && (
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell
              color="grey-500"
              sx={{
                cursor: 'pointer',
                color: selectedColumn === 0 ? 'white' : null,
                userSelect: 'none',
                transition: 'default',
                width: '100%!important',
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
            />
            {Object.values(listedNftColumns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                colSpan={
                  idx === Object.keys(listedNftColumns).length - 1 ? 2 : 1
                }
                onClick={() => onChangeSelection?.(idx)}
                sx={{
                  cursor: 'pointer',
                  color: selectedColumn === idx ? 'white' : null,
                  transition: 'default',
                  userSelect: 'none',
                  minWidth: [100, 100, 100, 180],
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
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Flex
                    sx={{
                      'white-space': 'nowarp',
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

export function ExplorePanelSkeleton({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <CollectionTable>
      {children}
      <TableBody>
        {[...new Array(PAGE_SIZE)].map((_, idx) => (
          <Skeleton sx={{ height: 56 }} as="tr" key={idx}>
            <TableCell colSpan={8}>
              <Box sx={{ height: 40, width: '100%' }} />
            </TableCell>
          </Skeleton>
        ))}
      </TableBody>
    </CollectionTable>
  )
}

const NFTItemsWrapper = ({ children, ...props }: NFTTableHeadProps) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <>
      {isMobile ? (
        <>
          <ListedNFTTableHead {...props} />
          <CollectorAccordion> {children} </CollectorAccordion>
        </>
      ) : (
        <CollectionTable>
          <ListedNFTTableHead {...props} />
          <TableBody>{children}</TableBody>
        </CollectionTable>
      )}
    </>
  )
}

/**
 *Default render function
 */
export default function ExploreListedNFTs({
  searchTerm = '',
  collectionId,
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: {
  searchTerm?: string
  collectionId?: number
  selectedColumn: number
  sortAscending: boolean
  onChangeSelection: (colIdx: number) => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const isMobileOrTablet = breakpointIndex <= 2

  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleChangeSelection = (colIdx: number) => {
    onChangeSelection(colIdx)
    setPage(0)
  }

  const orderColumn = Object.keys(listedNftColumns)[selectedColumn]
  const orderDirection = getOrderDirection(orderColumn, sortAscending)

  const variables = {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    listed: true,
    searchTerm,
    collectionId,
    orderColumn,
    orderDirection,
  }

  const { loading, error, data } = useQuery<
    GetExploreNFTsData,
    GetExploreNFTsVars
  >(GET_EXPLORE_NFTS, {
    errorPolicy: 'all',
    variables,
  })

  /**
   * We are using a workaround at the backend to speed up results for queries
   * which lack filters. The returned asset counts for these queries is
   * unavailable, so we assume 500.
   */
  const returnedAssetCount = data?.assetGlobalSearch?.count ?? 0
  const correctedCount = lacksGlobalAssetFilters(variables)
    ? 500
    : returnedAssetCount

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Loading state. */
  if (loading)
    return (
      <ExplorePanelSkeleton>
        <ListedNFTTableHead {...{ selectedColumn, sortAscending }} />
      </ExplorePanelSkeleton>
    )

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <NFTItemsWrapper
        onChangeSelection={handleChangeSelection}
        {...{ selectedColumn, sortAscending }}
      >
        {data.assetGlobalSearch.assets.map(
          (
            {
              id,
              name,
              contractAddress,
              previewImageUrl,
              mediaUrl,
              lastAppraisalWeiPrice,
              listPrice,
              listTimestamp,
              listAppraisalRatio,
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
              href={`/analytics/nft/${id}`}
              linkComponent={NextLink}
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
                      {listedNftColumns.LAST_APPRAISAL_PRICE}
                    </Text>
                    <Text
                      sx={{
                        color: 'blue',
                      }}
                    >
                      {lastAppraisalWeiPrice
                        ? formatNumber(lastAppraisalWeiPrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {listedNftColumns.LIST_PRICE}
                    </Text>
                    <Text>
                      {listPrice
                        ? formatNumber(listPrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
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
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {listedNftColumns.LIST_TIMESTAMP}
                    </Text>
                    <Text>
                      {listTimestamp
                        ? formatDistance(listTimestamp * 1000) + ' ago'
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
                      {listedNftColumns.LIST_APPRAISAL_RATIO}
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(listAppraisalRatio),
                      }}
                    >
                      {getUnderOverPricedLabel(listAppraisalRatio)}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <TableCell sx={{ color: 'blue' }}>
                    <Link
                      href={`/analytics/nft/${id}`}
                      component={NextLink}
                      noHover
                    >
                      {lastAppraisalWeiPrice
                        ? formatNumber(lastAppraisalWeiPrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
                          })
                        : '-'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/analytics/nft/${id}`}
                      component={NextLink}
                      noHover
                    >
                      {listPrice
                        ? formatNumber(listPrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
                          })
                        : '-'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/analytics/nft/${id}`}
                      component={NextLink}
                      noHover
                    >
                      {listTimestamp
                        ? formatDistance(listTimestamp * 1000) + ' ago'
                        : '-'}
                    </Link>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: getPriceChangeColor(listAppraisalRatio),
                      maxWidth: 100,
                    }}
                  >
                    <Link
                      href={`/analytics/nft/${id}`}
                      component={NextLink}
                      noHover
                    >
                      {getUnderOverPricedLabel(listAppraisalRatio)}
                    </Link>
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
          pageCount={Math.ceil(correctedCount / PAGE_SIZE)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
