import { useQuery } from '@apollo/client'
import { ButtonDropdown, CollectorAccordion, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { CollectionGridRow, CollectionTable } from '@upshot-tech/upshot-ui'
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
  handleChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
}

export const nftColumns = {
  LAST_SALE_DATE: 'Last Sale',
  LAST_SALE_PRICE: 'Last Sale Price',
  LAST_APPRAISAL_PRICE: 'Latest Appraisal',
  LAST_APPRAISAL_SALE_RATIO: '% Difference',
}

const colSpacing =
  '46px minmax(100px,3fr) minmax(80px, 1fr) minmax(110px, 1fr) minmax(120px, 1fr) minmax(80px, 1fr) 40px'

function NFTTableHead({
  selectedColumn,
  sortAscending,
  handleChangeSelection,
}: NFTTableHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { theme } = useTheme()

  function genSortOptions() {
    const sortOptions = [
      nftColumns.LAST_SALE_DATE + ': low to high',
      nftColumns.LAST_SALE_DATE + ': high to low',
      nftColumns.LAST_SALE_PRICE + ': low to high',
      nftColumns.LAST_SALE_PRICE + ': high to low',
      nftColumns.LAST_APPRAISAL_PRICE + ': low to high',
      nftColumns.LAST_APPRAISAL_PRICE + ': high to low',
      nftColumns.LAST_APPRAISAL_SALE_RATIO + ': low to high',
      nftColumns.LAST_APPRAISAL_SALE_RATIO + ': high to low',
    ]
    return sortOptions
  }
  
  const handleChangeNFTColumnSortRadio = (
    value: string,
  ) => {
    const index = genSortOptions().indexOf(value)
    /* it maps 0, 1 -> 0
    2, 3 -> 1
    4, 5 -> 2 */
    const columnIndex = Math.floor(index / 2)
    const order = index % 2 === 0 ? 'asc' : 'desc'
    handleChangeSelection(columnIndex, order)
  }
  
  const getDropdownValue = () => {
    return 'Last Sale Date: low to high'
  }

  return (
    <>
      {!isMobile && (
        <Grid
          columns={colSpacing}
          sx={{ padding: [1, 3].map((n) => theme.space[n] + 'px').join(' ') }}
        >
          <Box />
          <Box />
          {Object.values(nftColumns).map((col, idx) => (
            <Box
              key={idx}
              color="grey-500"
              onClick={() => handleChangeSelection(idx)}
              sx={{
                cursor: 'pointer',
                color: selectedColumn === idx ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                minWidth: [
                  100,
                  100,
                  100,
                  idx === Object.keys(nftColumns).length - 1 ? 216 : 120,
                  idx === Object.keys(nftColumns).length - 1 ? 216 : 180,
                ],
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
            </Box>
          ))}
        </Grid>
      )}
      {isMobile && handleChangeNFTColumnSortRadio && (
        <ButtonDropdown
          hideRadio
          label="Sort by"
          name="sortBy"
          onChange={(val) => handleChangeNFTColumnSortRadio(val)}
          options={genSortOptions()}
          value={getDropdownValue()}
          closeOnSelect={true}
          style={{
            display: 'inline-block',
            marginLeft: '-12px',
            marginTop: isMobile ? '10px' : '',
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
            <TableCell colSpan={7}>
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
          <NFTTableHead {...props} />
          <CollectorAccordion> {children} </CollectorAccordion>
        </>
      ) : (
        <>
          <NFTTableHead {...props} />
          <Box>{children}</Box>
        </>
      )}
    </Box>
  )
}

/**
 *Default render function
 */
export default function ExploreNFTs({
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

  const orderColumn = Object.keys(nftColumns)[selectedColumn]
  const orderDirection = getOrderDirection(orderColumn, sortAscending)
  const variables = {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
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
        <NFTTableHead {...{ selectedColumn, sortAscending, handleChangeSelection }} />
      </ExplorePanelSkeleton>
    )

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <NFTItemsWrapper {...{ selectedColumn, sortAscending, handleChangeSelection }}>
        {data.assetGlobalSearch.assets.map(
          (
            {
              id,
              name,
              contractAddress,
              mediaUrl,
              lastSale,
              lastAppraisalWeiPrice,
              lastAppraisalSaleRatio,
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
                      {nftColumns.LAST_SALE_DATE}
                    </Text>
                    <Text>
                      {lastSale?.timestamp
                        ? formatDistance(lastSale.timestamp * 1000) + ' ago'
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
                      {nftColumns.LAST_SALE_PRICE}
                    </Text>
                    <Text>
                      {lastSale?.ethSalePrice
                        ? formatNumber(lastSale.ethSalePrice, {
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
                      {nftColumns.LAST_APPRAISAL_PRICE}
                    </Text>
                    <Text>
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
                      {nftColumns.LAST_APPRAISAL_SALE_RATIO}
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(lastAppraisalSaleRatio),
                      }}
                    >
                      {getUnderOverPricedLabel(lastAppraisalSaleRatio)}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <Box>
                    {lastSale?.timestamp
                      ? formatDistance(lastSale.timestamp * 1000) + ' ago'
                      : '-'}
                  </Box>
                  <Box>
                    {lastSale?.ethSalePrice
                      ? formatNumber(lastSale.ethSalePrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {lastAppraisalWeiPrice
                      ? formatNumber(lastAppraisalWeiPrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box
                    sx={{
                      color: getPriceChangeColor(lastAppraisalSaleRatio),
                    }}
                  >
                    {getUnderOverPricedLabel(lastAppraisalSaleRatio)}
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
