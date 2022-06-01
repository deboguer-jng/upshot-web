import { useQuery } from '@apollo/client'
import {
  Box,
  ButtonDropdown,
  CollectionRow,
  CollectionTable,
  CollectorAccordion,
  Flex,
  formatNumber,
  Grid,
  Icon,
  Link,
  Pagination,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE } from 'constants/'
import NextLink from 'next/link'
import router from 'next/router'
import { useEffect, useState } from 'react'

import {
  genSortOptions,
  getDropdownValue,
  handleChangeNFTColumnSortRadio
} from '../../../../utils/tableSortDropdown'
import { TRAIT_SEARCH, TraitSearchData, TraitSearchVars } from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'
import { getOrderDirection } from './util'

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
  handleChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
}

export const traitColumns = {
  TYPE: 'Trait Type',
  RARITY: 'Rarity',
  FLOOR: 'Floor',
  FLOORUSD: 'Floor (USD)',
}

function TraitsTableHead({
  selectedColumn,
  sortAscending,
  handleChangeSelection,
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
            {Object.values(traitColumns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                colSpan={idx === Object.keys(traitColumns).length - 1 ? 2 : 1}
                onClick={() => handleChangeSelection?.(idx)}
                sx={{
                  cursor: 'pointer',
                  color: selectedColumn === idx ? 'white' : null,
                  transition: 'default',
                  userSelect: 'none',
                  minWidth: [100, 100, 100, 120, 180],
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
      {isMobile && (
        <ButtonDropdown
          hideRadio
          label="Sort by"
          name="sortBy"
          onChange={(val) => handleChangeNFTColumnSortRadio(val, traitColumns, handleChangeSelection)}
          options={genSortOptions(traitColumns)}
          value={getDropdownValue(selectedColumn, sortAscending, traitColumns)}
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

const TraitsWrapper = ({ children, ...props }: TraitsTableHeadProps) => {
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
  router.push(
    `/analytics/search?traits=${traitId}&collectionId=${collectionId}`
  )
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
  onChangeSelection: (colIdx: number, order?: 'asc' | 'desc') => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleChangeSelection = (colIdx: number, order?: 'asc' | 'desc') => {
    onChangeSelection(colIdx, order)
    setPage(0)
  }

  const orderColumn = Object.keys(traitColumns)[selectedColumn]
  const orderDirection = getOrderDirection(orderColumn, sortAscending)

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
        orderColumn,
        orderDirection,
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
        <TraitsTableHead {...{ selectedColumn, sortAscending, handleChangeSelection }} />
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
      <TraitsWrapper {...{ selectedColumn, sortAscending, handleChangeSelection }}>
        {data.traitSearch?.traits?.map(
          (
            {
              id,
              traitType,
              displayType,
              maxValue,
              collectionId,
              value,
              rarity,
              image,
              floor,
              floorUsd,
            },
            idx
          ) => (
            <CollectionRow
              variant="black"
              title={value ?? '-'}
              imageSrc={image ?? ''}
              key={idx}
              defaultOpen={idx === 0 ? true : false}
              onClick={() => handleRedirectToSearch(id, collectionId)}
              href={`/analytics/search?traits=${id}&collectionId=${collectionId}`}
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
                    <Text sx={{ marginBottom: 1 }}>{traitColumns.TYPE}</Text>
                    <Text>{dataCheck(traitType)}</Text>
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
                      {rarity
                        ? (100 - rarity * 100).toFixed(2).toString() + '%'
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
                      {traitColumns.FLOOR}
                    </Text>
                    <Text>
                      {floor
                        ? formatNumber(floor, {
                            fromWei: true,
                            decimals: 4,
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
                      {traitColumns.FLOORUSD}
                    </Text>
                    <Text>
                      {floorUsd
                        ? formatNumber(floorUsd, {
                            fromWei: true,
                            fromDecimals: 6,
                            decimals: 2,
                            kmbUnits: true,
                            prefix: 'USD',
                          })
                        : '-'}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <TableCell sx={{ maxWidth: 50 }}>
                    <Link
                      href={`/analytics/search?traits=${id}&collectionId=${collectionId}`}
                      component={NextLink}
                      noHover
                    >
                      {dataCheck(traitType)}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 50 }}>
                    <Link
                      href={`/analytics/search?traits=${id}&collectionId=${collectionId}`}
                      component={NextLink}
                      noHover
                    >
                      {rarity
                        ? (100 - rarity * 100).toFixed(2).toString() + '%'
                        : '-'}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ maxWidth: [100, 100, 200] }}>
                    <Link
                      href={`/analytics/search?traits=${id}&collectionId=${collectionId}`}
                      component={NextLink}
                      noHover
                    >
                      {floor
                        ? formatNumber(floor, {
                            fromWei: true,
                            decimals: 4,
                            prefix: 'ETHER',
                          })
                        : '-'}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ maxWidth: [100, 100, 200] }}>
                    <Link
                      href={`/analytics/search?traits=${id}&collectionId=${collectionId}`}
                      component={NextLink}
                      noHover
                    >
                      {floorUsd
                        ? formatNumber(floorUsd, {
                            fromWei: true,
                            decimals: 2,
                            fromDecimals: 6,
                            prefix: 'USD',
                          })
                        : '-'}
                    </Link>
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
          pageCount={
            data?.traitSearch?.count
              ? Math.ceil(data.traitSearch.count / PAGE_SIZE)
              : 1
          }
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
