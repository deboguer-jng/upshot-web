import { useQuery } from '@apollo/client'
import {
  Box,
  CollectionRow,
  CollectionTable,
  CollectorAccordion,
  Flex,
  Grid,
  Icon,
  Pagination,
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE, PIXELATED_CONTRACTS } from 'constants/'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { formatCurrencyUnits, formatLargeNumber, weiToEth } from 'utils/number'

import {
  TRAIT_SEARCH,
  TraitSearchData,
  TraitSearchVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

interface TraitsTableHeadProps extends React.HTMLAttributes<HTMLElement> {
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

export const traitColumns = {
    TYPE: 'Trait Type',
    RARITY: 'Rarity',
    FLOOR: 'Floor',
    FLOORUSD: 'Floor (USD)'
  }

  function TraitsTableHead({  
    selectedColumn,
    sortAscending,
    onChangeSelection,
  }: TraitsTableHeadProps) {
    const breakpointIndex = useBreakpointIndex()
    const isMobile = breakpointIndex <= 1
    const { theme } = useTheme()
  
    return (
      <>
        {isMobile ? (
          <Box />
        ) : (
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell
                color="grey-500"
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
              </TableCell>
              {Object.values(traitColumns).map((col, idx) => (
                <TableCell
                  key={idx}
                  color="grey-500"
                  onClick={() => onChangeSelection?.(idx)}
                  colSpan={
                    idx === Object.values(traitColumns).length - 1 ? 2 : 1
                  }
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
            </TableRow>
          </TableHead>
        )}
      </>
    )
  }

  const TraitsWrapper = ({
    children,
    ...props
  }: TraitsTableHeadProps) => {
    const breakpointIndex = useBreakpointIndex()
    const isMobile = breakpointIndex <= 1
  
    return (
      <>
        {isMobile ? (
          <>
            <TraitsTableHead {...props} />
            <CollectorAccordion>{children}</CollectorAccordion>
          </>
        ) : (
          <CollectionTable>
            <TraitsTableHead {...props} />
            <TableBody>{children}</TableBody>
          </CollectionTable>
        )}
      </>
    )
  }

  const handleRedirectToSearch = (traitId?: number, collectionId?: number) => {
    router.push(`/analytics/search?traits=${traitId}&collectionId=${
      collectionId
    }`)
  }
  
  /**
   *Default render function
   */
  export default function ExploreTraits({
    collectionId,
    traitType,
    searchTerm = '',
    selectedColumn,
    sortAscending,
    onChangeSelection,
  }: {
    collectionId: number
    traitType?: string
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
  
    const { loading, error, data } = useQuery<TraitSearchData, TraitSearchVars>(
        TRAIT_SEARCH,
        {
          errorPolicy: 'all',
          variables: {
            collectionId,
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
            searchTerm,
            traitType,
            orderColumn: Object.keys(traitColumns)[selectedColumn],
            orderDirection: sortAscending ? 'ASC' : 'DESC',
          },
          skip: !collectionId,
        }
      )
  
    useEffect(() => {
      setPage(0)
    }, [searchTerm])
  
    /* Loading state. */
    if (loading)
      return (
        <ExplorePanelSkeleton>
          <TraitsTableHead {...{ selectedColumn, sortAscending }} />
        </ExplorePanelSkeleton>
      )
  
    /* Error state. */
    // if (error) return <div>There was an error completing your request.</div>
  
    if (!data?.traitSearch?.traits?.length)
      return <div>No results available.</div>
  
    const dataCheck = (data) => {
      return data ? data : '-'
    }
  
    return (
      <>
        <TraitsWrapper
          {...{ selectedColumn, sortAscending, onChangeSelection }}
        >
          {data.traitSearch?.traits?.map(
            ({ id, traitType, displayType, maxValue, collectionId, value, rarity, image, floor, floorUsd }, idx) => (
              <CollectionRow
                variant="black"
                title={value ?? '-'}
                imageSrc={image ?? ''}
                key={idx}
                defaultOpen={idx === 0 ? true : false}
                onClick={() => handleRedirectToSearch(id, collectionId)}
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
                        {traitColumns.TYPE}
                      </Text>
                      <Text>
                        {dataCheck(traitType)}
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
                        {traitColumns.RARITY}
                      </Text>
                      <Text>
                        {rarity ? (
                            (100 - rarity * 100)
                                  .toFixed(2)
                                  .toString() + '%'
                                  ) : ('-')}
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
                        {traitColumns.FLOOR}
                      </Text>
                      <Text>
                        {floor ? weiToEth(floor) : '-'}
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
                        {traitColumns.FLOORUSD}
                      </Text>
                      <Text>{floorUsd ? '$' + formatLargeNumber(Number(formatCurrencyUnits(floorUsd, 6))) : '-'}</Text>
                    </Flex>
                  </Grid>
                ) : (
                  <>
                    <TableCell sx={{ maxWidth: 50 }}>
                      {dataCheck(traitType)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 50 }}>
                      {rarity ? (
                            (100 - rarity * 100)
                                  .toFixed(2)
                                  .toString() + '%'
                                  ) : ('-')}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 50 }}>
                        {floor ? weiToEth(floor) : '-'}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 50 }}>
                      {floorUsd ? '$' + formatLargeNumber(Number(formatCurrencyUnits(floorUsd, 6))) : '-'}
                    </TableCell>
                  </>
                )}
              </CollectionRow>
            )
          )}
        </TraitsWrapper>
  
        <Flex sx={{ justifyContent: 'center', marginTop: '10px' }}>
          <Pagination
            forcePage={page}
            pageCount={data?.traitSearch?.count ? Math.ceil(data.traitSearch.count / PAGE_SIZE) : 1}
            pageRangeDisplayed={0}
            marginPagesDisplayed={0}
            onPageChange={handlePageChange}
          />
        </Flex>
      </>
    )
  }