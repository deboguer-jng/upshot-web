import { useQuery } from '@apollo/client'
import { Avatar, Button, Icon, IconButton, imageOptimizer, NFTCard, SpinnerBoxTemplate, theme, Tooltip, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Container } from '@upshot-tech/upshot-ui'
import {
  Accordion,
  Box,
  ButtonDropdown,
  Flex,
  formatNumber,
  Grid,
  Link,
  Text,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'

import {
  genSortOptions,
  getDropdownValue,
  handleChangeNFTColumnSortRadio
} from '../../../utils/tableSortDropdown'
import TopCollections from '../../Analytics/components/ExplorePanel/TopCollections'
import Breadcrumbs from '../components/Breadcrumbs'
import SearchFilterSidebar from '../components/SearchFilterSidebar'
import NFTSearchResults, {
  NFTSearchResultsSkeleton,
} from './NFTSearchResultsListView'
import {
  GET_ASSETS_SEARCH,
  GET_COLLECTION,
  GetAssetsSearchData,
  GetAssetsSearchVars,
  GetCollectionData,
  GetCollectionVars,
} from './queries'
import TraitStats from './TraitStats'

const ROW_SIZE = 4
const RESULTS_PER_PAGE = 25

export enum ENFTSearchResultsOrder {
  LAST_SALE_PRICE,
  LAST_APPRAISAL_PRICE,
  LIST_PRICE,
  LIST_APPRAISAL_RATIO,
}

export type OrderedNFTSearchResultsColumns = {
  [key in keyof typeof ENFTSearchResultsOrder]: string
}

export const nftSearchResultsColumns: OrderedNFTSearchResultsColumns = {
  LAST_SALE_PRICE: 'Last Sale Price',
  LAST_APPRAISAL_PRICE: 'Last Appraisal',
  LIST_PRICE: 'List Price',
  LIST_APPRAISAL_RATIO: '% Difference',
}

enum BREAKPOINT_INDEXES {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export default function SearchView() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const dispatch = useAppDispatch()
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const scrollRef = useRef<any>(null)

  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const collectionId = router.query.collectionId
    ? Number(router.query.collectionId)
    : undefined

  const tokenId = router.query.tokenId as string
  const minPrice = router.query.minPrice as string
  const maxPrice = router.query.maxPrice as string
  const traitANDMatch = router.query.traitANDMatch as string
  const listedOnly = router.query.listedOnly as string ?? 'true'
  const traitIds = [router.query?.traits ?? []].flat().map((val) => Number(val))
  const collectionSearch = router.query.collectionSearch as string
  const [selectedColumn, setSelectedColumn] = useState<number>(0)
  const [sortAscending, setSortAscending] = useState(false)
  const [listView, setListView] = useState(false)
  const [openMobileFilters, setOpenMobileFilters] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [assetOffset, setAssetOffset] = useState(0)

  // Trait stats
  const [selectedTraitsColumn, setSelectedTraitsColumn] = useState<number>(3)
  const [sortTraitsAscending, setSortTraitsAscending] = useState(false)
  const handleChangeTraitsSelection = (columnIdx: number) => {
    if (columnIdx === selectedTraitsColumn) {
      setSortTraitsAscending(!sortTraitsAscending)
    }

    setSelectedTraitsColumn(columnIdx)
  }

  // NFT Search Results
  const [selectedNFTColumn, setSelectedNFTColumn] = useState<number>(3)
  const [sortNFTsAscending, setSortNFTsAscending] = useState(false)

  const handleChangeNFTColumnSelection = (columnIdx: number, order?: 'asc' | 'desc') => {
    setSelectedNFTColumn(columnIdx)
    const ascendingColumns = [0, 1, 2]

    if (order === 'asc')
      return setSortNFTsAscending(true)
    if (order === 'desc')
      return setSortNFTsAscending(false)

    // if order is not specified, toggle between ascending and descending
    if (columnIdx === selectedNFTColumn) // Toggle sort order for current selection.
      return setSortNFTsAscending(!sortNFTsAscending)
    // else, set to ascending for new selection.
    return setSortNFTsAscending(ascendingColumns.includes(columnIdx))
  }

  // Used to wait for the router to mount before showing collectors.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const chunks = {
    [BREAKPOINT_INDEXES.ZERO]: 2,
    [BREAKPOINT_INDEXES.ONE]: 2,
    [BREAKPOINT_INDEXES.TWO]: 2,
    [BREAKPOINT_INDEXES.THREE]: 3,
    [BREAKPOINT_INDEXES.FOUR]: 4,
    [BREAKPOINT_INDEXES.FIVE]: 5,
    [BREAKPOINT_INDEXES.SIX]: 6,
  }

  const chunkSize = chunks[breakpointIndex]
  const loadArr = [...new Array(ROW_SIZE * chunkSize)]
  const searchQueryParam = (router.query.query as string) ?? ''

  const { loading, error, data, 
    fetchMore: fetchMoreAssets, } = useQuery<
    GetAssetsSearchData,
    GetAssetsSearchVars
  >(GET_ASSETS_SEARCH, {
    errorPolicy: 'all',
    variables: {
      limit: RESULTS_PER_PAGE,
      offset: 0,
      collectionId,
      tokenId,
      minPrice,
      maxPrice,
      traitFilterJoin: traitANDMatch === 'true' ? 'AND' : 'OR',
      traitIds: traitIds.length ? traitIds : undefined,
      listed: listedOnly === 'true' ? true : undefined,
      orderColumn: Object.keys(nftSearchResultsColumns)[selectedNFTColumn],
      orderDirection: sortNFTsAscending ? 'ASC' : 'DESC',
    },
    skip: !collectionId,
  })

  const { loading: collectionLoading, data: collectionData } = useQuery<GetCollectionData, GetCollectionVars>(
    GET_COLLECTION,
    {
      errorPolicy: 'all',
      variables: { id: collectionId },
      skip: !collectionId,
    }
  )

    /* Infinite scroll: Assets */
    useEffect(() => {
      if (!assetOffset) return
  
      fetchMoreAssets({
        variables: {
          limit: RESULTS_PER_PAGE,
          offset: assetOffset,
          collectionId,
          tokenId,
          minPrice,
          maxPrice,
          traitFilterJoin: traitANDMatch === 'true' ? 'AND' : 'OR',
          traitIds: traitIds.length ? traitIds : undefined,
          listed: listedOnly === 'true' ? true : undefined,
          orderColumn: Object.keys(nftSearchResultsColumns)[selectedNFTColumn],
          orderDirection: sortNFTsAscending ? 'ASC' : 'DESC',
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.assetGlobalSearch) return prev
  
          return {
            assetGlobalSearch: {
                count:
                  fetchMoreResult.assetGlobalSearch?.count ?? 0,
                assets: [
                  ...(prev.assetGlobalSearch?.assets ?? []),
                  ...(fetchMoreResult.assetGlobalSearch?.assets ?? []),
                ],
              },
          }
        },
      })
    }, [assetOffset, fetchMoreAssets])

  /* Fetch more items if available and scrolled to bottom. */
  useEffect(() => {
    const infiniteScroll = async () => {
      if (!isScrollBottom()) return
      if (!data?.assetGlobalSearch?.count || !data.assetGlobalSearch?.assets?.length) return
      if (data?.assetGlobalSearch?.count > data?.assetGlobalSearch?.assets?.length) handleFetchMoreAssets(data?.assetGlobalSearch?.assets?.length)
    }

    window.addEventListener('scroll', infiniteScroll)

    return () => window.removeEventListener('scroll', infiniteScroll)
  }, [scrollRef, data?.assetGlobalSearch?.assets?.length])

  const isScrollBottom = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) return true

    return false
  }

  const handleFetchMoreAssets = useCallback(
    (startIndex: number) => {
      if (loading || assetOffset === startIndex) return
      setAssetOffset(startIndex)
    },
    [loading, assetOffset]
  )

  const handleChangeSelection = (columnIdx: number) => {
    if (columnIdx === selectedColumn) {
      setSortAscending(!sortAscending)
    }

    setSelectedColumn(columnIdx)
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleApplySearch = ({ query }) => {
    setPage(0)
    router.push({
      pathname: '/analytics/search',
      query,
    })
  }

  const assetArr = data?.assetGlobalSearch?.assets

  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')

  const breadcrumbs = prevPath?.includes('/nft/')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('nftName=')[1],
          link: prevPath,
        },
      ]
    : [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
      ]

  return (
    <>
      <Nav />
      <Container
        maxBreakpoint="xxl"
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
          width: '100%',
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />

        <Grid
          sx={{
            gridTemplateColumns: ['1fr', '1fr', '1fr', `${sidebarOpen ? '300px 1fr' : '70px 1fr'}`],
            gap: [5, 5, 5, 8],
          }}
        >
          {isMobile ? (
            <>
              <Box>
                <Accordion
                  isDropdown
                  title="Search Filters"
                  open={openMobileFilters}
                  onClick={() => setOpenMobileFilters(!openMobileFilters)}
                  onClose={() => setOpenMobileFilters(false)}
                >
                  <Box sx={{ paddingTop: 4 }}>
                    <SearchFilterSidebar
                      onHideFilters={() => setOpenMobileFilters(false)}
                      onApply={handleApplySearch}
                    />
                  </Box>
                </Accordion>
              </Box>
            </>
          ) : (
            <Flex
              sx={{
                flexDirection: 'column',
                gap: 4,
                position: ['static', 'static', 'sticky', 'sticky'],
                height: '70vh',
                paddingRight: '10px',
                paddingBottom: '25px',
                top: '160px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
              <SearchFilterSidebar onApply={handleApplySearch} open={sidebarOpen} onOpenSidebar={handleToggleSidebar} />
            </Flex>
          )}

          <Flex
            sx={{
              flex: '1 auto auto',
              flexDirection: 'column',
              width: '100%',
              gap: 6,
            }}
          >
            <Flex sx={{ flexDirection: 'column' }}>
              {(collectionData?.collectionById?.name) &&
                collectionData?.collectionById?.imageUrl &&
                collectionId && (
                  <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
                    <Grid columns={['1fr', '1fr', '1fr 1fr']} sx={{ gap: '40px' }}>
                      <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
                        <Flex sx={{ gap: 6, height: 100, alignItems: 'center' }}>
                          <Box
                            sx={{
                              backgroundColor: '#231F20',
                              minWidth: '63px',
                              padding: isMobile ? '4px' : '8px',
                              borderRadius: '50%',

                              flexShrink: 0,
                            }}
                          >
                            <Avatar
                              size="xl"
                              sx={{
                                width: isMobile ? '55px' : '100px',
                                height: isMobile ? '55px' : '100px',
                                minWidth: 'unset',
                              }}
                              src={
                                imageOptimizer(collectionData?.collectionById?.imageUrl, {
                                  width: parseInt(theme.images.avatar.xl.size),
                                  height: parseInt(theme.images.avatar.xl.size),
                                }) ?? collectionData?.collectionById?.imageUrl
                              }
                            />
                          </Box>
                          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                            <Flex sx={{ alignItems: 'center', gap: 2 }}>
                              <Text variant="h1Secondary" sx={{ lineHeight: '2rem' }}>
                                {collectionData?.collectionById?.name}
                              </Text>
                              {collectionData?.collectionById?.isAppraised && (
                                <Tooltip
                                  tooltip={'Appraised by Upshot'}
                                  sx={{ marginLeft: '0', marginTop: '5px', height: 25 }}
                                >
                                  <Icon
                                    icon="upshot"
                                    onClick={toggleHelpModal}
                                    size={25}
                                    color="primary"
                                  />
                                </Tooltip>
                              )}
                            </Flex>

                            <Flex sx={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap', height: 'min-content' }}>
                              {collectionData?.collectionById?.size && (
                                <Flex sx={{ flexDirection: 'row', gap: 1, width: 'min-content' }}>
                                  <Text
                                    color="grey"
                                    variant="large"
                                  >
                                    NFTs:
                                  </Text>
                                  <Text
                                    color="white"
                                    variant="large"
                                    sx={{
                                      fontWeight: 600,
                                    }}
                                  >
                                    {formatNumber(collectionData.collectionById.size)}
                                  </Text>
                                </Flex>
                              )}
                              {collectionData?.collectionById?.latestStats?.floor && (
                                <Flex sx={{ flexDirection: 'row', gap: 1, width: 'min-content' }}>
                                  <Text
                                    color="grey"
                                    variant="large"
                                  >
                                    Floor:
                                  </Text>
                                  <Text
                                    color="white"
                                    variant="large"
                                    sx={{
                                      fontWeight: 600,
                                    }}
                                  >
                                    Ξ{formatNumber(collectionData.collectionById.latestStats.floor, { fromWei: true, decimals: 2 })}
                                  </Text>
                                  {collectionData?.collectionById?.latestStats?.weekFloorChange && collectionData?.collectionById?.latestStats?.weekFloorChange != 0 && (
                                    <Text
                                      color={collectionData.collectionById.latestStats.weekFloorChange > 0 ? 'green' : 'red'}
                                      variant="large"
                                      >
                                      ({collectionData.collectionById.latestStats.weekFloorChange}%)
                                    </Text>
                                  )}
                                </Flex>
                              )}
                              {collectionData?.collectionById?.latestStats?.pastWeekWeiVolume && (
                                <Flex sx={{ flexDirection: 'row', gap: 1, width: 'min-content' }}>
                                  <Text
                                    color="grey"
                                    variant="large"
                                    sx={{
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Volume (1W):
                                  </Text>
                                  <Text
                                    color="white"
                                    variant="large"
                                    sx={{
                                      fontWeight: 600,
                                    }}
                                  >
                                    Ξ{formatNumber(collectionData.collectionById.latestStats.pastWeekWeiVolume, { fromWei: true, decimals: 2, kmbUnits: true })}
                                  </Text>
                                </Flex>
                              )}
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          gap: '16px',
                        }}
                      >
                        <Flex
                          sx={{
                            justifyContent: 'flex-end',
                            minHeight: isMobile ? 0 : 100,
                            marginBottom: isMobile ? 5 : 0,
                            width: isMobile ? '100%' : 'auto',
                          }}
                        >
                          <Link
                            href={`/analytics/collection/${collectionId}`}
                            sx={{
                              width: isMobile ? '100%' : 'auto',
                            }}
                            component={NextLink}
                            noHover
                          >
                            <Button
                              icon={<Icon icon="analytics" />}
                              sx={{
                                width: isMobile ? '100%' : 'auto',
                                '& span': {
                                  textTransform: 'none',
                                },
                                '&:not(:hover) svg': {
                                  path: { fill: '#000 !important' },
                                },
                              }}
                            >
                              Collection Analytics
                            </Button>
                          </Link>
                        </Flex>
                      </Flex>
                    </Grid>
                  </Flex>
                )}

              {!!collectionId && traitIds.length > 0 && (
                <TraitStats
                  selectedColumn={selectedTraitsColumn}
                  sortAscending={sortTraitsAscending}
                  onChangeSelection={handleChangeTraitsSelection}
                  {...{ collectionId, traitIds }}
                />
              )}
            </Flex>

            {error ? (
              <div>There was an error completing your request</div>
            ) : data?.assetGlobalSearch?.assets.length === 0 ? (
              <div>No results available.</div>
            ) : (
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                {!!collectionId && (
                  <Flex
                    sx={{
                      width: '100%',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      gap: 6,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      variant="h3Primary"
                      color="grey-600"
                      sx={{ display: 'inline-block', mr: 10 }}
                    >
                      NFTs
                    </Text>
                    {(!listView || isMobile) && (
                      <ButtonDropdown
                        hideRadio
                        label="Sort by"
                        name="sortBy"
                        onChange={(val) => handleChangeNFTColumnSortRadio(val, nftSearchResultsColumns, handleChangeNFTColumnSelection)}
                        options={genSortOptions(nftSearchResultsColumns)}
                        value={getDropdownValue(selectedNFTColumn, sortNFTsAscending, nftSearchResultsColumns)}
                        closeOnSelect={true}
                        style={{
                          marginTop: isMobile ? '10px' : '',
                        }}
                      />
                    )}
                  </Flex>
                )}
                {!error && !loading && (
                  <Box sx={{ height: '18px' }}>
                    {!!data?.assetGlobalSearch?.count && (
                      <Text>
                        {formatNumber(data.assetGlobalSearch.count)}{' '}
                        {data.assetGlobalSearch.count === 1 ? 'result' : 'results'}{' '}
                        found
                      </Text>
                    )}
                  </Box>
                )}
                {!collectionId && ready && (
                  <TopCollections
                    variant="normal"
                    searchTerm={collectionSearch}
                    onChangeSelection={handleChangeSelection}
                    {...{ selectedColumn, sortAscending }}
                  />
                )}
                {
                  loading && collectionId ? (
                    listView ? (
                      <NFTSearchResultsSkeleton
                        columns={nftSearchResultsColumns}
                        selectedColumn={selectedNFTColumn}
                        sortAscending={sortNFTsAscending}
                      />
                    ) : (
                    <Grid
                      sx={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(225px, 1fr))',
                        columnGap: '16px',
                        rowGap: '16px', 
                      }}
                      >
                        {loadArr?.map((_, idx) => (
                              <SpinnerBoxTemplate key={idx} sx={{ height: '300px' }}/>
                            ))}
                    </Grid>
                        
                    )
                  ) : assetArr && (
                    <Grid
                    ref={scrollRef}
                    sx={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(225px, 1fr))',
                      columnGap: '16px',
                      rowGap: '16px', 
                    }}
                    >
                      {assetArr?.map(
                        (
                          {
                            id,
                            contractAddress,
                            mediaUrl,
                            name,
                            collection,
                            latestAppraisal,
                            listPrice,
                            listAppraisalRatio,
                          },
                          idx
                        ) => (
                          <Flex key={idx} sx={{ gap: 5 }}>
                            <NFTCard
                              avatarImage={collectionData?.collectionById?.imageUrl}
                              imageSrc={mediaUrl}
                              isPixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
                              collection={collection?.name ?? ''}
                              name={name}
                              listPriceEth={listPrice}
                              appraisalPriceETH={latestAppraisal?.estimatedPrice}
                              listAppraisalPercentage={listAppraisalRatio} 
                              nftUrl={`/analytics/nft/${id}`}
                              collectionUrl={`/analytics/collection/${collection?.id}`}
                              />
                            </Flex>
                        )
                      )}
                    </Grid>
                  )
                }
              </Flex>
            )}
          </Flex>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}
