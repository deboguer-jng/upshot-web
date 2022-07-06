import { useQuery } from '@apollo/client'
import {
  ButtonDropdown,
  CollectorAccordion,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { CollectionGridRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { Pagination, useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Icon, Skeleton, Text } from '@upshot-tech/upshot-ui'
import { formatNumber, TableBody, TableCell } from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import NextLink from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getUnderOverPricedLabel } from 'utils/number'
import { formatDistance } from 'utils/time'

import {
  genSortOptions,
  getDropdownValue,
  handleChangeNFTColumnSortRadio,
} from '../../../../utils/tableSortDropdown'
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
  handleChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
}

export const listedNftColumns = {
  LAST_APPRAISAL_PRICE: 'Last Appraisal',
  LIST_PRICE: 'List Price',
  LIST_TIMESTAMP: 'Listed',
  LIST_APPRAISAL_RATIO: '% Difference',
}

const colSpacing = '46px minmax(100px,3fr) repeat(4, minmax(105px, 1fr)) 40px'

function ListedNFTTableHead({
  selectedColumn,
  sortAscending,
  handleChangeSelection,
}: NFTTableHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { theme } = useTheme()

  return (
    <>
      {!isMobile && (
        <Grid
          columns={colSpacing}
          sx={{ padding: [1, 3].map((n) => theme.space[n] + 'px').join(' ') }}
        >
          <Box />
          <Box />
          {Object.values(listedNftColumns).map((col, idx) => (
            <Box
              key={idx}
              color="grey-500"
              onClick={() => handleChangeSelection?.(idx)}
              sx={{
                cursor: 'pointer',
                color: selectedColumn === idx ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                minWidth: [
                  100,
                  100,
                  100,
                  idx === Object.keys(listedNftColumns).length - 1 ? 216 : 120,
                  idx === Object.keys(listedNftColumns).length - 1 ? 216 : 180,
                ],
                '& svg path': {
                  transition: 'default',
                  '&:nth-of-type(1)': {
                    fill:
                      selectedColumn === idx && sortAscending
                        ? 'white'
                        : theme.rawColors['grey-500'],
                  },
                  '&:nth-of-type(2)': {
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
            </Box>
          ))}
        </Grid>
      )}
      {isMobile && (
        <ButtonDropdown
          hideRadio
          label="Sort by"
          name="sortBy"
          onChange={(val) =>
            handleChangeNFTColumnSortRadio(
              val,
              listedNftColumns,
              handleChangeSelection
            )
          }
          options={genSortOptions(listedNftColumns)}
          value={getDropdownValue(
            selectedColumn,
            sortAscending,
            listedNftColumns
          )}
          closeOnSelect={true}
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            zIndex: 1,
            position: 'relative',
          }}
        />
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
    <Box sx={{ paddingTop: '8px' }}>
      {isMobile ? (
        <>
          <ListedNFTTableHead {...props} />
          <CollectorAccordion> {children} </CollectorAccordion>
        </>
      ) : (
        <>
          <ListedNFTTableHead {...props} />
          <Box>{children}</Box>
        </>
      )}
    </Box>
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
  onChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const isMobileOrTablet = breakpointIndex <= 2

  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleChangeSelection = (colIdx: number, order?: 'asc' | 'desc') => {
    onChangeSelection(colIdx, order)
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
        <ListedNFTTableHead
          {...{ selectedColumn, sortAscending, handleChangeSelection }}
        />
      </ExplorePanelSkeleton>
    )

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <NFTItemsWrapper
        handleChangeSelection={handleChangeSelection}
        {...{ selectedColumn, sortAscending }}
      >
        {data.assetGlobalSearch.assets.map(
          (
            {
              id,
              name,
              contractAddress,
              mediaUrl,
              lastAppraisalWeiPrice,
              listPrice,
              listTimestamp,
              listAppraisalRatio,
            },
            idx
          ) => (
            <CollectionGridRow
              variant="black"
              title={name}
              imageSrc={mediaUrl}
              key={idx}
              defaultOpen={idx === 0 ? true : false}
              onClick={() => handleShowNFT(id)}
              pixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
              href={`/analytics/nft/${id}`}
              linkComponent={NextLink}
              columns={colSpacing}
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
                  <Box sx={{ color: 'blue' }}>
                    {lastAppraisalWeiPrice
                      ? formatNumber(lastAppraisalWeiPrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {listPrice
                      ? formatNumber(listPrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {listTimestamp
                      ? formatDistance(listTimestamp * 1000) + ' ago'
                      : '-'}
                  </Box>
                  <Box
                    sx={{
                      color: getPriceChangeColor(listAppraisalRatio),
                    }}
                  >
                    {getUnderOverPricedLabel(listAppraisalRatio)}
                  </Box>
                </>
              )}
            </CollectionGridRow>
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
