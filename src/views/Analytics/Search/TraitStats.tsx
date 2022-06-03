/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  Icon,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'
import { useTheme } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import {
  formatNumber,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import React from 'react'

import { getOrderDirection } from '../components/ExplorePanel/util'
import {
  GET_TRAIT_STATS,
  GetTraitStatsData,
  GetTraitStatsVars,
} from './queries'

export enum ETraitStatsOrder {
  VALUE,
  TYPE,
  RARITY,
  FLOOR,
}

export type OrderedTraitStatColumns = {
  [key in keyof typeof ETraitStatsOrder]: string
}

interface TraitStatsHeadProps extends React.HTMLAttributes<HTMLElement> {
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

export const traitStatsColumns: OrderedTraitStatColumns = {
  VALUE: 'Trait',
  TYPE: 'Trait Type',
  RARITY: 'Rarity',
  FLOOR: 'Floor',
}

function TraitStatsHead({
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: TraitStatsHeadProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const { theme } = useTheme()

  return (
    <>
      {isMobile ? (
        <Box>
          <Flex sx={{ justifyContent: 'space-between', padding: 2 }}>
            <Text></Text>
            <Text sx={{ textTransform: 'capitalize' }}>
              {traitStatsColumns.TYPE}
            </Text>
          </Flex>
        </Box>
      ) : (
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {Object.values(traitStatsColumns).map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                sx={{
                  color: null,
                  transition: 'default',
                  userSelect: 'none',
                  minWidth: [100, 100, 100, 180],
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
                </Flex>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
    </>
  )
}

const TraitStatsWrapper = ({ children, ...props }: TraitStatsHeadProps) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { theme } = useTheme()

  return (
    <>
      {isMobile ? (
        <>
          <TraitStatsHead {...props} />
          <CollectorAccordion>{children}</CollectorAccordion>
        </>
      ) : (
        <CollectionTable sx={{ width: 'auto' }}>
          <TraitStatsHead {...props} />
          <TableBody
            sx={{
              '& tr': {
                background: !isMobile && 'transparent!important',
              },
              '& td': {
                background: theme.colors['grey-800'],
              },
            }}
          >
            {children}
          </TableBody>
        </CollectionTable>
      )}
    </>
  )
}

export default function TraitStats({
  collectionId,
  traitIds,
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: {
  collectionId: number
  traitIds: number[]
  selectedColumn: number
  sortAscending: boolean
  onChangeSelection: (colIdx: number) => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const orderColumn = Object.keys(traitStatsColumns)[selectedColumn]
  const orderDirection = getOrderDirection(orderColumn, sortAscending)

  const { data } = useQuery<GetTraitStatsData, GetTraitStatsVars>(
    GET_TRAIT_STATS,
    {
      errorPolicy: 'ignore',
      variables: {
        collectionId,
        limit: 1000,
        offset: 0,
        orderColumn,
        orderDirection,
      },
    }
  )

  if (!data?.collectionById?.traitGroups?.length) return null

  const traits = data.collectionById.traitGroups
    .map(({ traits }) => traits)
    .flat()
    .filter(({ id }) => traitIds.includes(id))

  return (
    <>
      <Text variant="h3Primary" sx={{ marginTop: '25px' }}>
        Trait Stats
      </Text>

      <TraitStatsWrapper
        {...{ selectedColumn, sortAscending, onChangeSelection }}
      >
        {traits.map(({ id, value, traitType, rarity, floor, image }, idx) => (
          <CollectionRow
            title={value}
            key={idx}
            defaultOpen={idx === 0 ? true : false}
            variant="normal"
            imageSrc={image ?? ''}
            subtitle={isMobile ? traitType : undefined}
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
                  <Text sx={{ marginBottom: 1, textTransform: 'capitalize' }}>
                    {traitStatsColumns.TYPE}
                  </Text>
                  <Text sx={{ textTransform: 'capitalize' }}>{traitType}</Text>
                </Flex>
                <Flex
                  sx={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text sx={{ marginBottom: 1 }}>
                    {traitStatsColumns.FLOOR}
                  </Text>
                  <Text>
                    {floor
                      ? formatNumber(floor, {
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
                    {traitStatsColumns.RARITY}
                  </Text>
                  <Text>
                    {rarity
                      ? (100 - rarity * 100).toFixed(2).toString() + '%'
                      : '-'}
                  </Text>
                </Flex>
              </Grid>
            ) : (
              <>
                <TableCell sx={{ maxWidth: 50, textTransform: 'capitalize' }}>
                  {traitType}
                </TableCell>
                <TableCell sx={{ maxWidth: 50 }}>
                  {rarity
                    ? (100 - rarity * 100).toFixed(2).toString() + '%'
                    : '-'}
                </TableCell>
                <TableCell sx={{ maxWidth: 50, textTransform: 'capitalize' }}>
                  {floor
                    ? formatNumber(floor, {
                        fromWei: true,
                        decimals: 2,
                        prefix: 'ETHER',
                      })
                    : '-'}
                </TableCell>
              </>
            )}
          </CollectionRow>
        ))}
      </TraitStatsWrapper>
    </>
  )
}
