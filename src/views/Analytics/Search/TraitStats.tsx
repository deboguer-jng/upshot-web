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
import React, { useState } from 'react'

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

export const columns = ['Trait Type', 'Rarity', 'Floor']

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
            <Text>MOBILE: A</Text>
          </Flex>
        </Box>
      ) : (
        <TableHead>
          <TableRow>
            <TableCell
              color="grey-500"
              sx={{
                cursor: 'pointer',
                color: selectedColumn === 0 ? 'white' : null,
                transition: 'default',
                userSelect: 'none',
                width: '100% !important',
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
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                color="grey-500"
                onClick={() => onChangeSelection?.(idx)}
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

const CollectionItemsWrapper = ({
  children,
  ...props
}: TraitStatsHeadProps) => {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

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
          <TableBody>{children}</TableBody>
        </CollectionTable>
      )}
    </>
  )
}

/**
 *Default render function
 */
export default function TraitStats({
  traitIds,
  selectedColumn,
  sortAscending,
  onChangeSelection,
}: {
  traitIds: number[]
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

  return (
    <>
      <CollectionItemsWrapper
        {...{ selectedColumn, sortAscending, onChangeSelection }}
      >
        <CollectionRow
          title="title"
          onClick={() => {}}
          defaultOpen={true}
          variant="normal"
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
                <Text sx={{ marginBottom: 1 }}>1</Text>
                <Text>2</Text>
                <Text>3</Text>
              </Flex>
              <Flex
                sx={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text sx={{ marginBottom: 1 }}>3</Text>
              </Flex>
            </Grid>
          ) : (
            <>
              <TableCell sx={{ maxWidth: 50 }}>x</TableCell>
              <TableCell sx={{ maxWidth: 50 }}>y</TableCell>
              <TableCell sx={{ maxWidth: 50 }}>z</TableCell>
            </>
          )}
        </CollectionRow>
      </CollectionItemsWrapper>

      <Flex sx={{ justifyContent: 'center', marginTop: '10px', width: '100%' }}>
        <Pagination
          forcePage={page}
          pageCount={0}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
