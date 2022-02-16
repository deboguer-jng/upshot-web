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

export const nftColumns = {
  LAST_SALE_DATE: 'Last Sale',
  LAST_SALE_PRICE: 'Last Sale Price',
  LAST_APPRAISAL_PRICE: 'Latest Appraisal',
  LAST_APPRAISAL_SALE_RATIO: 'Last Sale/Appraisal',
}

function NFTTableHead({
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
            {Object.values(nftColumns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                onClick={() => onChangeSelection?.(idx)}
                colSpan={idx === Object.values(nftColumns).length - 1 ? 2 : 1}
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
    <>
      {isMobile ? (
        <>
          <NFTTableHead {...props} />
          <CollectorAccordion> {children} </CollectorAccordion>
        </>
      ) : (
        <CollectionTable>
          <NFTTableHead {...props} />
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
      orderColumn: Object.keys(nftColumns)[selectedColumn],
      orderDirection: sortAscending ? 'ASC' : 'DESC',
    },
  })

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Loading state. */
  if (loading)
    return (
      <ExplorePanelSkeleton>
        <NFTTableHead {...{ selectedColumn, sortAscending }} />
      </ExplorePanelSkeleton>
    )

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  if (!data?.assetGlobalSearch?.assets?.length)
    return <div>No results available.</div>

  return (
    <>
      <NFTItemsWrapper
        {...{ selectedColumn, sortAscending, onChangeSelection }}
      >
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
              lastAppraisalSaleRatio,
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
                      {nftColumns.LAST_SALE_DATE}
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
                      {nftColumns.LAST_SALE_PRICE}
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
                      {nftColumns.LAST_APPRAISAL_PRICE}
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
                      {nftColumns.LAST_APPRAISAL_SALE_RATIO}
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(
                          lastAppraisalSaleRatio
                        ),
                      }}
                    >
                      {getPriceChangeLabel(lastAppraisalSaleRatio)}
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
                      color: getPriceChangeColor(lastAppraisalSaleRatio),
                    }}
                  >
                    {getPriceChangeLabel(lastAppraisalSaleRatio)}
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
