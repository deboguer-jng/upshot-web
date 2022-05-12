/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  formatNumber,
  Icon,
  Skeleton,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { CollectionGridRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import NextLink from 'next/link'
import router from 'next/router'
import React from 'react'
import { getPriceChangeColor } from 'utils/color'

import { getUnderOverPricedLabel } from '../../../utils/number'
import { OrderedNFTSearchResultsColumns } from '.'

export enum ETraitStatsOrder {
  VALUE,
  TYPE,
  RARITY,
  FLOOR,
}

export type OrderedTraitStatColumns = {
  [key in keyof typeof ETraitStatsOrder]: string
}

interface NFTSearchResultsHeadProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The columns for the nft search results table
   */
  columns: OrderedNFTSearchResultsColumns
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

const colSpacing =
  '46px minmax(100px,3fr) repeat(4, minmax(105px, 2fr)) 40px'

function NFTSearchResultsHead({
  columns,
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: NFTSearchResultsHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const { theme } = useTheme()

  return (
    <>
      {isMobile ? (
        <Box>
          <Flex sx={{ justifyContent: 'space-between', padding: 2 }}>
            <Text></Text>
          </Flex>
        </Box>
      ) : (
        <Grid 
          columns={colSpacing}
          sx={{ padding: [1, 3].map((n) => theme.space[n] + 'px').join(' ') }}
        >
          <Box />
          <Box />
          {Object.values(columns).map((col, idx) => (
            <Box
              key={idx}
              color="grey-500"
              onClick={() => onChangeSelection?.(idx)}
              sx={{
                cursor: 'pointer',
                color: selectedColumn === idx ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                minWidth: [
                  100,
                  100,
                  100,
                  idx === Object.keys(columns).length - 1 ? 216 : 120,
                  idx === Object.keys(columns).length - 1 ? 216 : 180,
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
              <Flex 
                sx={{ 
                  alignItems: 'center' ,
                  'white-space': 'nowarp',
                  fontSize: '.85rem',
                }}>
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

export function NFTSearchResultsSkeleton({
  ...props
}: NFTSearchResultsHeadProps) {
  return (
    <CollectionTable>
      <NFTSearchResultsHead {...props} />
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

const NFTSearchResultsWrapper = ({
  children,
  ...props
}: NFTSearchResultsHeadProps) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <>
      {isMobile ? (
        <>
          <NFTSearchResultsHead {...props} />
          <CollectorAccordion>{children}</CollectorAccordion>
        </>
      ) : (
        <Box>
          <NFTSearchResultsHead {...props} />
          <Box>{children}</Box>
        </Box>
      )}
    </>
  )
}

const handleShowNFT = (id: string) => {
  router.push('/analytics/nft/' + id)
}

export default function NFTSearchResults({
  columns,
  selectedColumn,
  sortAscending,
  onChangeSelection,
  assetArr,
}: {
  columns: OrderedNFTSearchResultsColumns
  selectedColumn: number
  sortAscending: boolean
  assetArr: any
  onChangeSelection: (colIdx: number) => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const isMobileOrTablet = breakpointIndex <= 2

  return (
    <>
      <NFTSearchResultsWrapper
        {...{ selectedColumn, sortAscending, onChangeSelection, columns }}
      >
        {assetArr.map(
          (
            {
              id,
              tokenId,
              mediaUrl,
              name,
              lastSale,
              latestAppraisal,
              listPrice,
              listAppraisalRatio,
            },
            idx
          ) => (
            <CollectionGridRow
              title={tokenId ? '#' + tokenId : name}
              key={idx}
              defaultOpen={idx === 0 ? true : false}
              variant="normal"
              imageSrc={mediaUrl ?? ''}
              subtitle={isMobile ? name : undefined}
              onClick={() => handleShowNFT(id)}
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
                    <Text sx={{ marginBottom: 1 }}>
                      {columns.LAST_SALE_PRICE}
                    </Text>
                    <Text>
                      {lastSale && lastSale?.ethSalePrice
                        ? formatNumber(lastSale.ethSalePrice, {
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
                      {columns.LAST_APPRAISAL_PRICE}
                    </Text>
                    <Text>
                      {latestAppraisal && latestAppraisal?.estimatedPrice
                        ? formatNumber(latestAppraisal.estimatedPrice, {
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
                      {columns.LIST_PRICE}
                    </Text>
                    <Text>
                      {listPrice
                        ? formatNumber(listPrice, {
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
                      {columns.LIST_APPRAISAL_RATIO}
                    </Text>
                    <Text
                      sx={{ color: getPriceChangeColor(listAppraisalRatio) }}
                    >
                      {listAppraisalRatio
                        ? getUnderOverPricedLabel(listAppraisalRatio)
                        : '-'}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <Box sx={{ maxWidth: 50 }}>
                    <Text variant="medium">
                      {lastSale && lastSale?.ethSalePrice
                        ? formatNumber(lastSale.ethSalePrice, {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Text>
                  </Box>
                  <Box sx={{ maxWidth: 50, textTransform: 'capitalize' }}>
                    <Text variant="medium" color="primary">
                      {latestAppraisal && latestAppraisal?.estimatedPrice
                        ? formatNumber(latestAppraisal.estimatedPrice, {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Text>
                  </Box>
                  <Box sx={{ maxWidth: 50, textTransform: 'capitalize' }}>
                    <Text variant="medium">
                      {listPrice
                        ? formatNumber(listPrice, {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      variant="medium"
                      sx={{ color: getPriceChangeColor(listAppraisalRatio) }}
                    >
                      {listAppraisalRatio
                        ? getUnderOverPricedLabel(listAppraisalRatio)
                        : '-'}
                    </Text>
                  </Box>
                </>
              )}
            </CollectionGridRow>
          )
        )}
      </NFTSearchResultsWrapper>
    </>
  )
}
