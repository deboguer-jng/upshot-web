import { useQuery } from '@apollo/client'
import {
  Box,
  CollectionRow,
  CollectionTable,
  CollectorAccordion,
  Flex,
  Grid,
  Pagination,
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE, PIXELATED_CONTRACTS } from 'constants/'
import { useEffect, useState } from 'react'

import {
  TRAIT_SEARCH,
  TraitSearchData,
  TraitSearchVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

interface TraitsTableHeadProps extends React.HTMLAttributes<HTMLElement> {
}

export const traitColumns = {
    TRAIT_TYPE: 'Trait Type',
    RARITY: 'Rarity',
    FLOOR: 'Floor',
    APPRAISAL_VALUE: 'Appraisal Value'
  }

  function TraitsTableHead({}: TraitsTableHeadProps) {
    const breakpointIndex = useBreakpointIndex()
    const isMobile = breakpointIndex <= 1
  
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
                  transition: 'default',
                  userSelect: 'none',
                }}
              >
              </TableCell>
              {Object.values(traitColumns).map((col, idx) => (
                <TableCell
                  key={idx}
                  color="grey-500"
                  colSpan={
                    idx === Object.values(traitColumns).length - 1 ? 2 : 1
                  }
                  sx={{
                    cursor: 'pointer',
                    color: null,
                    transition: 'default',
                    userSelect: 'none',
                    minWidth: 100,
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
  
  /**
   *Default render function
   */
  export default function ExploreTraits({
    collectionId,
    traitType,
    searchTerm = '',
  }: {
    collectionId: number
    traitType?: string
    searchTerm?: string
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
          <TraitsTableHead {...{ }} />
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
          {...{ }}
        >
          {data.traitSearch?.traits?.map(
            ({ traitType, displayType, maxValue, collectionId, value, rarity }, idx) => (
              <CollectionRow
                variant="black"
                title={value ?? '-'}
                imageSrc={'http://res.cloudinary.com/upshot-inc/image/upload/w_340,c_lfill/v1631374109/oociokfis65nrvu0hrm2.png'}
                key={idx}
                defaultOpen={idx === 0 ? true : false}
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
                        {traitColumns.TRAIT_TYPE}
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
                        {'-'}
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
                        {traitColumns.APPRAISAL_VALUE}
                      </Text>
                      <Text>{'-'}</Text>
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
                      {'-'}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 50 }}>
                      {'-'}
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