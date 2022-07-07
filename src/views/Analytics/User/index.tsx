/** @jsxImportSource theme-ui */

import { useLazyQuery, useQuery } from '@apollo/client'
import {
  Avatar,
  Box,
  Button,
  CollectionCard,
  CollectionCardExpanded,
  CollectionRow,
  CollectionTable,
  Container,
  Flex,
  FollowerModal,
  formatNumber,
  Grid,
  Icon,
  IconButton,
  imageOptimizer,
  Link,
  Modal,
  Panel,
  parseUint256,
  RadarChart,
  Skeleton,
  Spinner,
  SwitchDropdown,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  Tooltip,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { OPENSEA_REFERRAL_LINK, PIXELATED_CONTRACTS } from 'constants/'
import { format } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import { Masonry, useInfiniteLoader } from 'masonic'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AutoSizer, Column, InfiniteLoader, Table } from 'react-virtualized'
import { useAppSelector } from 'redux/hooks'
import { setAlertState } from 'redux/reducers/layout'
import { selectAddress, selectEns } from 'redux/reducers/web3'
import { extractEns, shortenAddress } from 'utils/address'
import { gmiLabel } from 'utils/gmi'
import { formatDistance } from 'utils/time'

import Breadcrumbs from '../components/Breadcrumbs'
import FollowedCollections from '../components/User/FollowedCollections'
import FollowedCollectors from '../components/User/FollowedCollectors'
import FollowedNFTs from '../components/User/FollowedNFTs'
import FollowerUser from '../components/User/FollowerUser'
import FollowUser from '../components/User/FollowUser'
import {
  GET_ALL_OWNED_COLLECTIONS_WRAPPER,
  GET_COLLECTION_ASSETS,
  GET_COLLECTOR,
  GET_COLLECTOR_TX_HISTORY,
  GET_UNSUPPORTED_AGGREGATE_COLLECTION_STATS,
  GET_UNSUPPORTED_ASSETS,
  GET_UNSUPPORTED_FLOORS,
  GetAllOwnedCollectionsWrapperData,
  GetAllOwnedCollectionsWrapperVars,
  GetCollectionAssetsData,
  GetCollectionAssetsVars,
  GetCollectorData,
  GetCollectorTxHistoryData,
  GetCollectorTxHistoryVars,
  GetCollectorVars,
  GetUnsupportedAggregateCollectionStatsData,
  GetUnsupportedAggregateCollectionStatsVars,
  GetUnsupportedAssetsData,
  GetUnsupportedAssetsVars,
  GetUnsupportedFloorsData,
  GetUnsupportedFloorsVars,
} from './queries'

type Collection = {
  id: number | null
  osCollectionSlug?: string
  numOwnedAssets?: number
  name: string
  imageUrl?: string
}

type UnappraisedCollection = {
  name: string
  imageUrl: string
  address: string
  floorEth: number
  osCollectionSlug: string
  numOwnedAssets: number
}

type AppraisedCollection = {
  count: number
  ownedAppraisedValue: string
  collection: {
    id: number
    name: string
    imageUrl: string
    isAppraised: boolean
    ownerAssetsInCollection: {
      count: number
      assets: {
        id: string
        contractAddress: string
        mediaUrl?: string
        name?: string
        description?: string
      }[]
    }
  }
}

function Layout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const { theme } = useTheme()
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
    : prevPath?.includes('collection')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('?collectionName=')[1],
          link: prevPath,
        },
      ]
    : prevPath?.includes('user')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: `${
            decodeURI(prevPath as string).split('?userWallet=')[1]
          }'s Collection`,
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
        maxBreakpoint="lg"
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
          marginBottom: 10,
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />
        {children}
      </Container>
      <Footer />
    </>
  )
}

function Header({
  address,
  displayName,
  userId,
  userAddress,
}: {
  address: string
  userAddress: string
  displayName: string
  userId: any
}) {
  const shortAddress = shortenAddress(address)
  const { theme } = useTheme()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!displayName) return

    const storage = globalThis?.sessionStorage
    const curPath = storage.getItem('currentPath')

    if (curPath?.indexOf('userWallet=') === -1)
      storage.setItem('currentPath', `${curPath}?userWallet=${displayName}`)
  }, [displayName])

  return (
    <>
      <Flex
        sx={{ alignItems: 'center', gap: 4, justifyContent: 'space-between' }}
      >
        <Flex>
          <Avatar size="lg" src={makeBlockie(address)} />
          <Flex sx={{ flexDirection: 'column', gap: 1 }}>
            <Text variant="h1Primary" sx={{ lineHeight: 1 }}>
              {displayName}&apos;s Collection
            </Text>
            <Flex sx={{ alignItems: 'center', gap: 1 }}>
              <Text color="grey-400" sx={{ lineHeight: 1 }}>
                {shortAddress}
              </Text>
              <Tooltip
                tooltip={'Copy to clipboard'}
                placement="top"
                sx={{
                  marginLeft: '0',
                  height: '13px',
                  '&:hover': {
                    svg: {
                      color: theme.colors['grey-500'],
                    },
                  },
                }}
              >
                <Icon
                  icon="copy"
                  size="13"
                  color="grey-400"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(
                      setAlertState({
                        showAlert: true,
                        alertText: 'Address copied to clipboard!',
                      })
                    )
                    navigator.clipboard.writeText(address)
                  }}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        {userAddress == address ? (
          <FollowerUser userId={userId} displayName={displayName} />
        ) : (
          <FollowUser userId={userId} />
        )}
      </Flex>
    </>
  )
}

const MasonryItem = memo<{
  index: any
  data: any
  setShowCollection: any
  collectionFloors: any
  address: any
}>(function MasonryItem({
  index,
  data,
  setShowCollection,
  collectionFloors,
  address,
}) {
  const { data: dataUnsupportedAssets } = useQuery<
    GetUnsupportedAssetsData,
    GetUnsupportedAssetsVars
  >(GET_UNSUPPORTED_ASSETS, {
    errorPolicy: 'all',
    variables: {
      userAddress: address,
      osCollectionSlug: data?.osCollectionSlug,
      limit: 8,
      offset: 0,
    },
    skip: !address || !data?.osCollectionSlug,
  })

  if ('ownedAppraisedValue' in data) {
    const { ownedAppraisedValue, count, collection } =
      data as AppraisedCollection
    const formattedAppraisedValue = ownedAppraisedValue
      ? formatNumber(ownedAppraisedValue, { fromWei: true, decimals: 2 })
      : ownedAppraisedValue
    const price = collection.isAppraised
      ? { appraisalPrice: formattedAppraisedValue }
      : { floorPrice: formattedAppraisedValue }

    return (
      <CollectionCard
        {...price}
        linkComponent={NextLink}
        hasSeeAll={count > 5}
        seeAllImageSrc={collection.ownerAssetsInCollection.assets[0]?.mediaUrl}
        avatarImage={collection.imageUrl}
        link={`/analytics/collection/${collection.id}`}
        total={collection?.ownerAssetsInCollection?.count}
        name={collection.name}
        key={index}
        onExpand={() =>
          setShowCollection({
            id: collection.id,
            name: collection.name,
            imageUrl: collection.imageUrl,
            numOwnedAssets: collection?.ownerAssetsInCollection?.count,
          })
        }
      >
        {collection.ownerAssetsInCollection.assets
          .slice(0, 5)
          .map(({ id, mediaUrl, contractAddress }, idx) => (
            <Link
              href={`/analytics/nft/${id}`}
              component={NextLink}
              key={idx}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  '&::after': {
                    content: "''",
                    display: 'block',
                    paddingTop: '100%',
                    backgroundImage: `url(${
                      imageOptimizer(mediaUrl, {
                        width: 180,
                        height: 180,
                      }) ?? mediaUrl
                    })`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius: 'sm',
                    imageRendering: PIXELATED_CONTRACTS.includes(
                      contractAddress
                    )
                      ? 'pixelated'
                      : 'auto',
                  },
                }}
              />
            </Link>
          ))}
      </CollectionCard>
    )
  } else {
    const {
      name,
      imageUrl,
      address,
      osCollectionSlug,
      floorEth,
      numOwnedAssets,
    } = data as UnappraisedCollection

    return (
      <>
        <CollectionCard
          linkComponent={NextLink}
          link={`https://opensea.io/collection/${osCollectionSlug}?ref=${OPENSEA_REFERRAL_LINK}`}
          avatarImage={imageUrl}
          name={name}
          key={index}
          total={numOwnedAssets}
          floorPrice={
            floorEth?.toFixed(2) ??
            collectionFloors[osCollectionSlug]?.toFixed(2)
          }
          onExpand={() =>
            setShowCollection({
              id: null,
              osCollectionSlug,
              numOwnedAssets,
              name,
              imageUrl,
            })
          }
        >
          {dataUnsupportedAssets?.getUnsupportedAssetPage?.assets
            ?.slice(0, 5)
            .map((asset, idx) => (
              <Box
                key={idx}
                onClick={() =>
                  setShowCollection({
                    id: null,
                    osCollectionSlug,
                    name,
                    imageUrl,
                  })
                }
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  '&::after': {
                    content: "''",
                    display: 'block',
                    paddingTop: '100%',
                    backgroundImage: `url(${
                      imageOptimizer(asset.imageUrl, {
                        width: 180,
                        height: 180,
                      }) ?? asset.imageUrl
                    })`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius: 'sm',
                    imageRendering: PIXELATED_CONTRACTS.includes(address)
                      ? 'pixelated'
                      : 'auto',
                  },
                }}
              />
            ))}
        </CollectionCard>
      </>
    )
  }
})

export default function UserView() {
  const router = useRouter()
  const { theme } = useTheme()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const modalRef = useRef<HTMLDivElement>(null)

  /* Collection & Asset offsets */
  const [showCollection, setShowCollection] = useState<Collection>()
  const [collectionOffset, setCollectionOffset] = useState(0)
  const [assetOffset, setAssetOffset] = useState(0)
  const [unsupportedAssetOffset, setUnsupportedAssetOffset] = useState(0)

  /* Address formatting */
  const [address, setAddress] = useState('')
  const [addressFormatted, setAddressFormatted] = useState<string>()
  const [errorAddress, setErrorAddress] = useState(false)
  const userAddress = useAppSelector(selectAddress)
  const userEns = useAppSelector(selectEns)
  const shortAddress = useMemo(() => shortenAddress(address), [address])
  const loadingAddressFormatted = !addressFormatted && !errorAddress
  const [profileOption, setProfileOption] = useState('')
  const dropdownOptions = [
    'Collected',
    'Followed Collections',
    'Followed NFTs',
    'Followed Collectors',
  ]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!router.query.address) return

    const address = router.query.address as string
    setAddress(address)

    try {
      setAddressFormatted(ethers.utils.getAddress(address))
    } catch (err) {
      console.error(err)

      /**
       * Address failed to format.
       *
       * This occurs if a user manually entered an invalid address.
       * @note We should show an appropriate error message.
       */
      setErrorAddress(true)
    }
  }, [router.query])

  const collectionLimit = 8

  const {
    loading: loadingCollection,
    error,
    data,
    fetchMore: fetchMoreCollections,
  } = useQuery<GetCollectorData, GetCollectorVars>(GET_COLLECTOR, {
    errorPolicy: 'all',
    variables: {
      address: addressFormatted,
      collectionLimit,
      collectionOffset: 0,
      assetLimit: 6,
      assetOffset: 0,
    },
    skip: !addressFormatted,
  })

  const {
    loading: loadingTxHistory,
    error: errorTxHistory,
    data: txHistoryData,
    fetchMore: fetchMoreTxHistories,
  } = useQuery<GetCollectorTxHistoryData, GetCollectorTxHistoryVars>(
    GET_COLLECTOR_TX_HISTORY,
    {
      errorPolicy: 'all',
      variables: {
        address: addressFormatted,
        txLimit: 100,
        txOffset: 0,
      },
      skip: !addressFormatted,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  )

  const handleShowCollection = (id: number) => {
    router.push('/analytics/collection/' + id)
  }

  const noCollection =
    data?.getUser === null || data?.getUser?.extraCollections?.count === 0

  const {
    loading: loadingAssets,
    data: dataAssets,
    fetchMore: fetchMoreAssets,
  } = useQuery<GetCollectionAssetsData, GetCollectionAssetsVars>(
    GET_COLLECTION_ASSETS,
    {
      errorPolicy: 'all',
      variables: {
        userAddress: addressFormatted,
        id: Number(showCollection?.id),
        limit: 10,
        offset: 0,
      },
      skip: !showCollection?.id || !addressFormatted,
    }
  )

  const {
    data: dataAllOwnedCollections,
    error: errorAllOwnedCollections,
    loading: loadingAllOwnedCollections,
    fetchMore: fetchMoreAllOwnedCollections,
  } = useQuery<
    GetAllOwnedCollectionsWrapperData,
    GetAllOwnedCollectionsWrapperVars
  >(GET_ALL_OWNED_COLLECTIONS_WRAPPER, {
    errorPolicy: 'all',
    variables: {
      userAddress: addressFormatted,
      limit: collectionLimit ?? 0,
      offset: 0,
      userId: data?.getUser?.id,
      dbCount: null,
    },
    skip: !addressFormatted || !data?.getUser?.id,
  })

  /* Waiting for collector data or query string address param to format. */
  const isLoading =
    loadingCollection ||
    loadingAddressFormatted ||
    loadingTxHistory ||
    loadingAllOwnedCollections

  /* Request unsupported aggregate collection stats */
  const { data: dataUnsupportedAggregateCollectionStats } = useQuery<
    GetUnsupportedAggregateCollectionStatsData,
    GetUnsupportedAggregateCollectionStatsVars
  >(GET_UNSUPPORTED_AGGREGATE_COLLECTION_STATS, {
    errorPolicy: 'all',
    variables: {
      userAddress: addressFormatted,
    },
    skip: !addressFormatted,
  })

  const unsupportedAggregateCollectionStatFloorEth = Number(
    dataUnsupportedAggregateCollectionStats
      ?.getUnsupportedAggregateCollectionStats?.floorEth ?? 0.0
  )

  const unsupportedAggregateCollectionStatFloorUsd = Number(
    dataUnsupportedAggregateCollectionStats
      ?.getUnsupportedAggregateCollectionStats?.floorUsd ?? 0.0
  )

  const unsupportedAggregateCollectionStatNumUniqueCollections = Number(
    dataUnsupportedAggregateCollectionStats
      ?.getUnsupportedAggregateCollectionStats?.numUniqueCollections ?? 0
  )

  const unsupportedAggregateCollectionStatNumAssets = Number(
    dataUnsupportedAggregateCollectionStats
      ?.getUnsupportedAggregateCollectionStats?.numAssets ?? 0
  )

  /* Request unsupported floors */
  const { data: dataUnsupportedFloors, error: errorUnsupportedFloors } =
    useQuery<GetUnsupportedFloorsData, GetUnsupportedFloorsVars>(
      GET_UNSUPPORTED_FLOORS,
      {
        errorPolicy: 'all',
        variables: {
          stringifiedSlugs:
            dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
              .unsupportedCollections?.slugsWithNullFloors ?? '[]',
        },
        skip: !dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
          .unsupportedCollections?.slugsWithNullFloors,
      }
    )

  const collectionSlugs = dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
    .unsupportedCollections?.slugsWithNullFloors
    ? JSON.parse(
        dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
          .unsupportedCollections.slugsWithNullFloors
      )
    : []

  const collectionFloors = dataUnsupportedFloors?.getUnsupportedFloors
    ? Object.fromEntries(
        dataUnsupportedFloors.getUnsupportedFloors.map(({ floorEth }, i) => [
          collectionSlugs[i],
          floorEth,
        ])
      )
    : {}

  /* Request unsupported assets */
  const {
    data: dataUnsupportedAssets,
    error: errorUnsupportedAssets,
    loading: loadingUnsupportedAssets,
    fetchMore: fetchMoreUnsupportedAssets,
  } = useQuery<GetUnsupportedAssetsData, GetUnsupportedAssetsVars>(
    GET_UNSUPPORTED_ASSETS,
    {
      errorPolicy: 'all',
      variables: {
        userAddress: addressFormatted,
        osCollectionSlug: showCollection?.osCollectionSlug,
        limit: 8,
        offset: 0,
      },
      skip: !addressFormatted || !showCollection?.osCollectionSlug,
    }
  )

  const handleFetchMoreCollections = useCallback(
    (startIndex: number) => {
      setCollectionOffset(startIndex)
    },
    [loadingCollection, collectionOffset]
  )

  const handleFetchMoreAssets = useCallback(
    (startIndex: number) => {
      if (loadingAssets || assetOffset === startIndex) return
      setAssetOffset(startIndex)
    },
    [loadingAssets, assetOffset]
  )

  const handleFetchMoreUnsupportedAssets = useCallback(() => {
    if (
      loadingUnsupportedAssets ||
      !dataUnsupportedAssets?.getUnsupportedAssetPage?.nextOffset
    )
      return
    setUnsupportedAssetOffset(
      dataUnsupportedAssets.getUnsupportedAssetPage.nextOffset
    )
  }, [
    loadingUnsupportedAssets,
    dataUnsupportedAssets?.getUnsupportedAssetPage?.nextOffset,
  ])

  const loadMore = ({ startIndex, stopIndex }) => {
    fetchMoreTxHistories({
      variables: {
        txOffset: txHistoryData?.getTxHistory?.txHistory?.events?.length,
        txLimit:
          stopIndex -
          (txHistoryData?.getTxHistory?.txHistory?.events?.length ?? 0),
      },
    })

    return new Promise((resolve, reject) => {})
  }

  /* Infinite scroll: Collections */
  useEffect(() => {
    if (!collectionOffset) return

    fetchMoreAllOwnedCollections({
      variables: {
        offset:
          dataAllOwnedCollections?.getAllOwnedCollectionsWrapper?.nextOffset,
        dbCount:
          dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
            ?.extraCollections?.count,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult?.getAllOwnedCollectionsWrapper ||
          prev.getAllOwnedCollectionsWrapper.nextOffset === null
        ) {
          return prev
        }

        if (fetchMoreResult?.getAllOwnedCollectionsWrapper?.extraCollections) {
          return {
            getAllOwnedCollectionsWrapper: {
              ...prev.getAllOwnedCollectionsWrapper,
              nextOffset:
                fetchMoreResult?.getAllOwnedCollectionsWrapper?.nextOffset,
              extraCollections: {
                count:
                  fetchMoreResult.getAllOwnedCollectionsWrapper
                    ?.extraCollections?.count ?? 0,
                collectionAssetCounts: [
                  ...(prev.getAllOwnedCollectionsWrapper?.extraCollections
                    ?.collectionAssetCounts ?? []),
                  ...(fetchMoreResult.getAllOwnedCollectionsWrapper
                    ?.extraCollections?.collectionAssetCounts ?? []),
                ],
              },
            },
          }
        } else if (
          fetchMoreResult?.getAllOwnedCollectionsWrapper.unsupportedCollections
        ) {
          return {
            getAllOwnedCollectionsWrapper: {
              ...prev.getAllOwnedCollectionsWrapper,
              nextOffset:
                fetchMoreResult?.getAllOwnedCollectionsWrapper?.nextOffset,
              unsupportedCollections: {
                ...prev.getAllOwnedCollectionsWrapper,
                slugsWithNullFloors:
                  fetchMoreResult.getAllOwnedCollectionsWrapper
                    .unsupportedCollections?.slugsWithNullFloors,
                nextOffset:
                  fetchMoreResult.getAllOwnedCollectionsWrapper
                    .unsupportedCollections?.nextOffset,
                collections: [
                  ...(prev.getAllOwnedCollectionsWrapper.unsupportedCollections
                    ?.collections ?? []),
                  ...(fetchMoreResult.getAllOwnedCollectionsWrapper
                    .unsupportedCollections?.collections ?? []),
                ],
              },
            },
          }
        } else {
          return prev
        }
      },
    })
  }, [collectionOffset, fetchMoreAllOwnedCollections])

  /* Infinite scroll: Assets */
  useEffect(() => {
    if (!assetOffset) return

    fetchMoreAssets({
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.collectionById) return prev

        return {
          collectionById: {
            ownerAssetsInCollection: {
              count:
                fetchMoreResult.collectionById?.ownerAssetsInCollection
                  ?.count ?? 0,
              assets: [
                ...(prev.collectionById?.ownerAssetsInCollection?.assets ?? []),
                ...(fetchMoreResult.collectionById?.ownerAssetsInCollection
                  ?.assets ?? []),
              ],
            },
          },
        }
      },
    })
  }, [assetOffset, fetchMoreAssets])

  /* Infinite scroll: Unsupported Assets */
  useEffect(() => {
    if (!unsupportedAssetOffset) return

    fetchMoreUnsupportedAssets({
      variables: { offset: unsupportedAssetOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUnsupportedAssetPage) return prev

        return {
          getUnsupportedAssetPage: {
            ...prev.getUnsupportedAssetPage,
            nextOffset: fetchMoreResult.getUnsupportedAssetPage?.nextOffset,
            assets: [
              ...(prev.getUnsupportedAssetPage?.assets ?? []),
              ...(fetchMoreResult.getUnsupportedAssetPage?.assets ?? []),
            ],
          },
        }
      },
    })
  }, [unsupportedAssetOffset, fetchMoreUnsupportedAssets])

  const maybeLoadMoreCollections = useInfiniteLoader(
    handleFetchMoreCollections,
    {
      isItemLoaded: (index, items) => {
        return !!items[index]
      },
    }
  )

  const RenderMasonryItem = ({
    index,
    data,
  }: {
    index: number
    data: UnappraisedCollection | AppraisedCollection
  }) => {
    return (
      <MasonryItem
        index={index}
        data={data}
        setShowCollection={setShowCollection}
        collectionFloors={collectionFloors}
        address={addressFormatted}
      />
    )
  }

  const distributionTable = (
    <Panel sx={{ flexGrow: 1 }}>
      <Text variant="h3Secondary" sx={{ lineHeight: 1.3 }}>
        Collection Distribution
      </Text>
      <Flex sx={{ gap: 2 }}>
        <Box
          sx={{
            border: '2px solid',
            borderColor: theme.colors.blue,
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: transparentize(0.75, theme.rawColors.blue),
          }}
        ></Box>
        <Text sx={{ fontSize: 2, color: 'grey-600' }}>{shortAddress}</Text>
      </Flex>

      {isMobile ? (
        <>
          <Box>
            <Flex sx={{ justifyContent: 'space-between', padding: 2 }}>
              <Text> Collection Name </Text>
              <Text> NFT Count </Text>
            </Flex>
          </Box>
          {data?.getUser?.extraCollections?.collectionAssetCounts?.map(
            ({ collection, count }, idx) => (
              <CollectionRow
                variant="dark"
                title={collection.name}
                imageSrc={collection['imageUrl']}
                key={idx}
                nftCount={count}
                onClick={() => handleShowCollection(collection.id)}
                href={'/analytics/collection/' + collection.id}
                linkComponent={NextLink}
              />
            )
          )}
        </>
      ) : (
        <CollectionTable>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell color="grey-500">Collection Name</TableCell>
              <TableCell color="grey-500">NFT Count</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.getUser?.extraCollections?.collectionAssetCounts?.map(
              ({ collection, count }, idx) => (
                <CollectionRow
                  variant="dark"
                  title={collection.name}
                  imageSrc={collection['imageUrl']}
                  key={idx}
                  onClick={() => handleShowCollection(collection.id)}
                  href={'/analytics/collection/' + collection.id}
                  linkComponent={NextLink}
                >
                  <TableCell sx={{ color: 'blue' }}>
                    <Link
                      href={'/analytics/collection/' + collection.id}
                      component={NextLink}
                    >
                      {count}
                    </Link>
                  </TableCell>
                </CollectionRow>
              )
            )}
          </TableBody>
        </CollectionTable>
      )}
    </Panel>
  )

  const distributionRadar = (
    <Panel sx={{ display: 'flex', flexDirection: 'column' }}>
      <Text variant="h3Secondary" sx={{ lineHeight: 1.3 }}>
        Collection Distribution
      </Text>
      <Flex sx={{ gap: 2 }}>
        <Box
          sx={{
            border: '2px solid',
            borderColor: theme.colors.blue,
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: transparentize(0.75, theme.rawColors.blue),
          }}
        ></Box>
        <Text sx={{ fontSize: 2, color: 'grey-600' }}>{shortAddress}</Text>
      </Flex>
      <Flex
        sx={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <RadarChart
            data={{
              series: [
                {
                  name: 'Portfolio Distribution',
                  data: data?.getUser?.extraCollections?.collectionAssetCounts
                    ?.slice(0, 6)
                    ?.map(({ ownedAppraisedValue }) =>
                      ownedAppraisedValue
                        ? parseFloat(
                            ethers.utils.formatEther(ownedAppraisedValue)
                          )
                        : 0
                    ) ?? [0, 0, 0, 0, 0, 0],
                },
              ],
              labels: data?.getUser?.extraCollections?.collectionAssetCounts
                ?.slice(0, 6)
                ?.map(({ collection }) => collection.name) ?? [
                '',
                '',
                '',
                '',
                '',
                '',
              ],
            }}
            height={420}
          />
        </Box>
      </Flex>
    </Panel>
  )

  const headerRenderer = (label) => {
    return (
      <TableCell color="grey-500" backgroundColor="grey-800">
        <Text sx={{ textTransform: 'none' }}>{label}</Text>
      </TableCell>
    )
  }
  // pre-calculate portfolio appraisal values
  const calculatedTotalAssetAppraisedValueWei = data?.getUser
    ?.ownedAppraisalValue?.appraisalWei
    ? formatNumber(
        parseFloat(
          ethers.utils.formatEther(
            data.getUser.ownedAppraisalValue.appraisalWei
          )
        ) + unsupportedAggregateCollectionStatFloorEth,
        { decimals: 2 }
      )
    : '-'

  const calculatedTotalAssetAppraisedValueUsd = data?.getUser
    ?.ownedAppraisalValue?.appraisalUsd
    ? formatNumber(
        parseUint256(data.getUser.ownedAppraisalValue.appraisalUsd, 6, 2) +
          unsupportedAggregateCollectionStatFloorUsd,
        { kmbUnits: true, decimals: 2 }
      )
    : '-'

  const calculatedTotalNumUniqueCollections = data?.getUser?.extraCollections
    ?.count
    ? formatNumber(
        Number(data.getUser.extraCollections.count) +
          unsupportedAggregateCollectionStatNumUniqueCollections
      )
    : '-'

  const calculatedTotalNumAssets = data?.getUser?.numAssets
    ? formatNumber(
        Number(data.getUser.numAssets) +
          unsupportedAggregateCollectionStatNumAssets
      )
    : '-'

  // Generate content for tooltip
  const TooltipContent = (
    <div style={{ textAlign: 'left' }}>
      <Text
        color="blue"
        sx={{
          fontSize: 4,
          lineHeight: 1.3,
          display: 'block',
        }}
      >
        {data?.getUser?.ownedAppraisalValue?.appraisalWei ? 'Ξ' : ''}
        {calculatedTotalAssetAppraisedValueWei}
      </Text>
      {!!data?.getUser?.ownedAppraisalValue?.appraisalUsd && (
        <Text
          color="blue"
          sx={{
            fontSize: 4,
            lineHeight: 1.3,
            display: 'block',
          }}
        >
          {data?.getUser?.ownedAppraisalValue?.appraisalUsd ? '~ $' : ''}
          {calculatedTotalAssetAppraisedValueUsd}
        </Text>
      )}
      {/*       <Text
        color="grey-500"
        sx={{
          display: 'block',
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        Portfolio appraisal last updated:
      </Text>
      <Text
        color="grey-500"
        sx={{
          display: 'block',
          lineHeight: 1.3,
        }}
      >
        We should display the last update datetime here
      </Text> */}
    </div>
  )

  const getDisplayName = () => {
    if (data?.getUser?.displayName) return data?.getUser?.displayName
    if (
      address?.toLowerCase() === userAddress?.toLowerCase() &&
      userEns?.name
    ) {
      return userEns.name
    }
    return extractEns(data?.getUser?.addresses, address) ?? shortAddress
  }
  const getUserId = () => {
    return data?.getUser?.id
  }

  const getGmiNum = () => {
    const gmi = data?.getUser?.addresses[0]?.gmi

    if (gmi) return `${Math.floor(gmi)} /1000 gmi`
    else return '-'
  }

  const getGmiLabel = () => {
    const gmi = data?.getUser?.addresses[0]?.gmi

    if (gmi) return gmiLabel(gmi)
    else ''
  }

  const renderBottomSection = () => {
    switch (profileOption) {
      case 'Followed Collections':
        return (
          <Panel
            sx={{
              marginLeft: isMobile ? '-1rem' : 0,
              marginRight: isMobile ? '-1rem' : 0,
            }}
          >
            <FollowedCollections userId={data?.getUser?.id} />
          </Panel>
        )
      case 'Followed NFTs':
        return (
          <Panel
            sx={{
              marginLeft: isMobile ? '-1rem' : 0,
              marginRight: isMobile ? '-1rem' : 0,
            }}
          >
            <FollowedNFTs userId={data?.getUser?.id} />
          </Panel>
        )
      case 'Followed Collectors':
        return (
          <Panel
            sx={{
              marginLeft: isMobile ? '-1rem' : 0,
              marginRight: isMobile ? '-1rem' : 0,
            }}
          >
            <FollowedCollectors userId={data?.getUser?.id} name={''} />
          </Panel>
        )
      default:
        return (
          <Masonry
            columnWidth={300}
            columnGutter={16}
            rowGutter={16}
            items={[
              ...(dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
                ?.extraCollections?.collectionAssetCounts ?? []),
              ...(dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
                .unsupportedCollections?.collections ?? []),
            ]}
            render={RenderMasonryItem}
            onRender={maybeLoadMoreCollections}
            style={{ outline: 'none' }}
            key={
              dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
                ?.extraCollections?.collectionAssetCounts?.length ??
              0 +
                (dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
                  ?.unsupportedCollections?.collections?.length ?? 0)
            }
          />
        )
    }
  }

  return (
    <>
      <Layout title={getDisplayName()}>
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          {!!address && !!data?.getUser && (
            <Header
              key={address}
              {...{
                address,
                displayName: getDisplayName(),
                userId: getUserId(),
                userAddress,
              }}
            />
          )}
          {/* User Description */}
          <Text color="grey-400">{data?.getUser?.bio}</Text>

          <Box sx={{ position: 'relative' }}>
            <Grid gap={4} columns={[1, 1, 1, 2]}>
              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                <Text variant="h3Secondary" sx={{ lineHeight: 1 }}>
                  Appraised Assets Summary
                </Text>
                <Grid gap={2} columns={[2, 2, 3]}>
                  {isLoading ? (
                    [...new Array(6)].map((_, idx) => (
                      <Skeleton
                        sx={{ height: 80, borderRadius: '20px' }}
                        key={idx}
                      />
                    ))
                  ) : (
                    <>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Flex sx={{ justifyContent: 'center' }}>
                          <Text
                            color="blue"
                            sx={{
                              fontSize: 1,
                              lineHeight: 1,
                              marginRight: '2px',
                            }}
                          >
                            {data?.getUser?.ownedAppraisalValue?.appraisalWei
                              ? 'Ξ'
                              : ''}
                          </Text>
                          <Text
                            color="blue"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: 4,
                              lineHeight: 1,
                            }}
                          >
                            {calculatedTotalAssetAppraisedValueWei}
                          </Text>
                        </Flex>
                        <Text
                          color="blue"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            textAlign: 'center',
                          }}
                        >
                          Portfolio Appraisal
                          <Tooltip
                            tooltip={TooltipContent}
                            sx={{ marginLeft: '5px' }}
                          />
                        </Text>
                      </Panel>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 4,
                            color: 'grey-500',
                            background:
                              '-webkit-linear-gradient(0deg, #0091FF, #1BB441)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textAlign: 'center',
                          }}
                        >
                          {getGmiNum()}
                        </Text>
                        <Text
                          color="blue"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            background:
                              '-webkit-linear-gradient(0deg, #0091FF, #1BB441)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textAlign: 'center',
                          }}
                        >
                          {getGmiLabel()}
                        </Text>
                      </Panel>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          textAlign: 'center',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 4,
                            color: 'grey-500',
                            background:
                              '-webkit-linear-gradient(0deg, #FF5628, #E44BBE)',
                            '-webkit-background-clip': 'text',
                            '-webkit-text-fill-color': 'transparent',
                            textAlign: 'center',
                          }}
                        >
                          {calculatedTotalNumAssets ?? 0}
                        </Text>
                        <Text
                          color="blue"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            background:
                              '-webkit-linear-gradient(0deg, #FF5628, #E44BBE)',
                            '-webkit-background-clip': 'text',
                            '-webkit-text-fill-color': 'transparent',
                            textAlign: 'center',
                          }}
                        >
                          Number of NFTs
                        </Text>
                      </Panel>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          textAlign: 'center',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 4,
                            color: 'grey-500',
                            textAlign: 'center',
                          }}
                        >
                          {calculatedTotalNumUniqueCollections ?? 0}
                        </Text>
                        <Text
                          color="grey-500"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            textAlign: 'center',
                          }}
                        >
                          Unique Collections
                        </Text>
                      </Panel>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          textAlign: 'center',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 4,
                            color: 'grey-500',
                            textAlign: 'center',
                          }}
                        >
                          {data?.getUser?.mostRecentBuy?.txAt
                            ? format(
                                data.getUser.mostRecentBuy.txAt * 1000,
                                'M/d/yyyy'
                              )
                            : '-'}
                        </Text>
                        <Text
                          color="grey-500"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            textAlign: 'center',
                          }}
                        >
                          Most Recent Purchase
                        </Text>
                      </Panel>
                      <Panel
                        sx={{
                          display: 'flex',
                          borderRadius: '20px',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          height: 80,
                        }}
                      >
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 4,
                            color: 'grey-500',
                            textAlign: 'center',
                            textTransform: 'capitalize',
                          }}
                        >
                          {data?.getUser?.firstAssetPurchaseTime &&
                          !noCollection
                            ? formatDistance(
                                data.getUser.firstAssetPurchaseTime * 1000
                              )
                            : '-'}
                        </Text>
                        <Text
                          color="grey-500"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            textAlign: 'center',
                          }}
                        >
                          Age of Collection
                        </Text>
                      </Panel>
                    </>
                  )}
                </Grid>
                <Panel
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 380,
                  }}
                >
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                      <Text variant="h3Secondary">Transaction History</Text>
                      {isLoading ? (
                        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                          {[...new Array(3)].map((_, idx) => (
                            <Skeleton
                              sx={{
                                height: 24,
                                width: '100%',
                                borderRadius: 'sm',
                              }}
                              key={idx}
                            />
                          ))}
                        </Flex>
                      ) : !!txHistoryData?.getTxHistory?.txHistory?.count ? (
                        <Box
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              height: '300px',
                              overflow: 'auto',
                            }}
                            css={theme.scroll.thin.styles}
                          >
                            <InfiniteLoader
                              isRowLoaded={({ index }) =>
                                !!txHistoryData?.getTxHistory?.txHistory
                                  ?.events[index]
                              }
                              loadMoreRows={loadMore}
                              rowCount={
                                txHistoryData?.getTxHistory?.txHistory?.count
                              }
                            >
                              {({ onRowsRendered, registerChild }) => (
                                <AutoSizer defaultWidth={700}>
                                  {({ width }) => (
                                    <>
                                      {isMobile ? (
                                        <>
                                          <Table
                                            ref={registerChild}
                                            onRowsRendered={onRowsRendered}
                                            rowClassName="table-row"
                                            headerHeight={30}
                                            width={width}
                                            height={270}
                                            rowHeight={30}
                                            sx={{
                                              width: 680,
                                              '& .ReactVirtualized__Table__headerRow':
                                                {
                                                  width: '100%!important',
                                                },
                                              '& .ReactVirtualized__Table__Grid':
                                                {
                                                  width: '100%!important',
                                                },
                                              '& > .ReactVirtualized__Grid>.ReactVirtualized__Grid__innerScrollContainer':
                                                {
                                                  width: '100%!important',
                                                  maxWidth: 'unset!important',
                                                  overflow: 'auto!important',
                                                  maxHeight: 'unset!important',
                                                  minHeight: '100%!important',
                                                },
                                              '& > .ReactVirtualized__Grid> .ReactVirtualized__Grid__innerScrollContainer > .ReactVirtualized__Table__row':
                                                {
                                                  width: '100%!important',
                                                },
                                            }}
                                            rowCount={
                                              txHistoryData?.getTxHistory
                                                ?.txHistory?.count
                                            }
                                            rowGetter={({ index }) =>
                                              txHistoryData?.getTxHistory
                                                ?.txHistory?.events[index]
                                            }
                                          >
                                            <Column
                                              label="Date"
                                              dataKey="txAt"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Text
                                                    sx={{
                                                      fontWeight: 'bold',
                                                      fontSize: 4,
                                                      color: 'grey-500',
                                                      textAlign: 'center',
                                                    }}
                                                  >
                                                    {rowData?.txAt
                                                      ? format(
                                                          rowData.txAt * 1000,
                                                          'M/d/yyyy'
                                                        )
                                                      : '-'}
                                                  </Text>
                                                )
                                              }}
                                              cellDataGetter={() => {}}
                                              width={120}
                                              style={{ width: 120 }}
                                            />
                                            <Column
                                              label="NFT"
                                              dataKey="name"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Link
                                                    href={`/analytics/nft/${rowData?.asset?.id}`}
                                                    component={NextLink}
                                                    sx={{
                                                      display: 'block',
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                    }}
                                                  >
                                                    {rowData?.asset?.name}
                                                  </Link>
                                                )
                                              }}
                                              cellDataGetter={() => {}}
                                              width={120}
                                            />
                                            <Column
                                              label="Sender"
                                              dataKey="txFromAddress"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              width={120}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Grid
                                                    sx={{
                                                      alignItems: 'center',
                                                      gap: 1,
                                                      gridTemplateColumns:
                                                        '12px auto',
                                                      overflow: 'hidden',
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        borderRadius: 'circle',
                                                        bg: 'yellow',
                                                        width: 3,
                                                        height: 3,
                                                      }}
                                                    />
                                                    <Link
                                                      href={`/analytics/user/${rowData?.txFromAddress}`}
                                                      component={NextLink}
                                                      sx={{
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        fontSize: 2.5,
                                                      }}
                                                    >
                                                      <Text
                                                        sx={{
                                                          display: 'block',
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        {extractEns(
                                                          rowData?.txFromUser
                                                            ?.addresses,
                                                          rowData?.txFromAddress
                                                        ) ??
                                                          rowData?.txFromAddress}
                                                      </Text>
                                                    </Link>
                                                  </Grid>
                                                )
                                              }}
                                            />
                                            <Column
                                              width={120}
                                              label="Recipient"
                                              dataKey="txToAddress"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <TableCell
                                                    sx={{
                                                      display: 'grid',
                                                      alignItems: 'center',
                                                      gridTemplateColumns:
                                                        '12px auto',
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        borderRadius: 'circle',
                                                        bg: 'purple',
                                                        width: 3,
                                                        height: 3,
                                                      }}
                                                    />
                                                    <Link
                                                      href={`/analytics/user/${rowData?.txToAddress}`}
                                                      component={NextLink}
                                                      sx={{
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        fontSize: 2.5,
                                                      }}
                                                    >
                                                      <Text
                                                        sx={{
                                                          display: 'block',
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        {extractEns(
                                                          rowData?.txToUser
                                                            ?.addresses,
                                                          rowData?.txToAddress
                                                        ) ??
                                                          rowData?.txToAddress}
                                                      </Text>
                                                    </Link>
                                                  </TableCell>
                                                )
                                              }}
                                            />
                                            <Column
                                              width={120}
                                              label="Sale Price"
                                              dataKey="price"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <TableCell
                                                    sx={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                    }}
                                                  >
                                                    {'SALE' === rowData?.type &&
                                                      rowData?.price && (
                                                        <Text
                                                          color="pink"
                                                          sx={{
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                              'ellipsis',
                                                          }}
                                                        >
                                                          {`${parseUint256(
                                                            rowData.price,
                                                            rowData.currency
                                                              .decimals,
                                                            2
                                                          )}
                                                      ${
                                                        rowData?.currency
                                                          ?.symbol ?? 'ETH'
                                                      }
                                                      `}
                                                        </Text>
                                                      )}
                                                    {'TRANSFER' ===
                                                      rowData?.type && (
                                                      <Text
                                                        color="blue"
                                                        sx={{
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        Transfer
                                                      </Text>
                                                    )}
                                                    {'MINT' ===
                                                      rowData?.type && (
                                                      <Text
                                                        color="green"
                                                        sx={{
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        Mint
                                                      </Text>
                                                    )}
                                                    <Link
                                                      href={`https://etherscan.io/tx/${rowData?.txHash}`}
                                                      target="_blank"
                                                      title="Open transaction on Etherscan"
                                                      rel="noopener noreferrer nofollow"
                                                      component={NextLink}
                                                    >
                                                      <IconButton
                                                        sx={{
                                                          marginLeft: '6px;',
                                                          verticalAlign:
                                                            'middle',
                                                        }}
                                                      >
                                                        <Icon
                                                          icon="disconnect"
                                                          color={
                                                            'SALE' ===
                                                            rowData?.type
                                                              ? 'pink'
                                                              : 'TRANSFER' ===
                                                                rowData?.type
                                                              ? 'blue'
                                                              : 'green'
                                                          }
                                                        />
                                                      </IconButton>
                                                    </Link>
                                                  </TableCell>
                                                )
                                              }}
                                            />
                                          </Table>
                                        </>
                                      ) : (
                                        <>
                                          <Table
                                            ref={registerChild}
                                            onRowsRendered={onRowsRendered}
                                            rowStyle={{ width: width }}
                                            headerHeight={30}
                                            width={width}
                                            height={260}
                                            rowHeight={40}
                                            rowCount={
                                              txHistoryData?.getTxHistory
                                                ?.txHistory?.count
                                            }
                                            rowGetter={({ index }) =>
                                              txHistoryData?.getTxHistory
                                                ?.txHistory?.events[index]
                                            }
                                          >
                                            <Column
                                              label="Date"
                                              dataKey="txAt"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Text
                                                    sx={{
                                                      fontWeight: 'normal',
                                                      fontSize: '16px',
                                                      color: 'grey-500',
                                                      textAlign: 'center',
                                                    }}
                                                  >
                                                    {rowData?.txAt
                                                      ? format(
                                                          rowData.txAt * 1000,
                                                          'M/d/yyyy'
                                                        )
                                                      : '-'}
                                                  </Text>
                                                )
                                              }}
                                              cellDataGetter={() => {}}
                                              width={width * 0.2}
                                            />
                                            <Column
                                              label="NFT"
                                              dataKey="name"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Link
                                                    href={`/analytics/nft/${rowData?.asset?.id}`}
                                                    component={NextLink}
                                                  >
                                                    <Link
                                                      component={NextLink}
                                                      sx={{
                                                        display: 'block',
                                                        textOverflow:
                                                          'ellipsis',
                                                        overflow: 'hidden',
                                                      }}
                                                    >
                                                      {rowData?.asset?.name}
                                                    </Link>
                                                  </Link>
                                                )
                                              }}
                                              cellDataGetter={() => {}}
                                              width={width * 0.2}
                                            />
                                            <Column
                                              label="Sender"
                                              dataKey="txFromAddress"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              width={width * 0.2}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <Grid
                                                    sx={{
                                                      alignItems: 'center',
                                                      gap: 1,
                                                      gridTemplateColumns:
                                                        '12px auto',
                                                      overflow: 'hidden',
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        borderRadius: 'circle',
                                                        bg: 'yellow',
                                                        width: 3,
                                                        height: 3,
                                                      }}
                                                    />
                                                    <Link
                                                      href={`/analytics/user/${rowData?.txFromAddress}`}
                                                      component={NextLink}
                                                      sx={{
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        fontSize: 2.5,
                                                      }}
                                                    >
                                                      <Text
                                                        sx={{
                                                          display: 'block',
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        {extractEns(
                                                          rowData?.txFromUser
                                                            ?.addresses,
                                                          rowData?.txFromAddress
                                                        ) ??
                                                          rowData?.txFromAddress}
                                                      </Text>
                                                    </Link>
                                                  </Grid>
                                                )
                                              }}
                                            />
                                            <Column
                                              width={width * 0.2}
                                              label="Recipient"
                                              dataKey="txToAddress"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <TableCell
                                                    sx={{
                                                      display: 'grid',
                                                      alignItems: 'center',
                                                      gridTemplateColumns:
                                                        '12px auto',
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        borderRadius: 'circle',
                                                        bg: 'purple',
                                                        width: 3,
                                                        height: 3,
                                                      }}
                                                    />
                                                    <Link
                                                      href={`/analytics/user/${rowData?.txToAddress}`}
                                                      component={NextLink}
                                                      sx={{
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        fontSize: 2.5,
                                                      }}
                                                    >
                                                      <Text
                                                        sx={{
                                                          display: 'block',
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        {extractEns(
                                                          rowData?.txToUser
                                                            ?.addresses,
                                                          rowData?.txToAddress
                                                        ) ??
                                                          rowData?.txToAddress}
                                                      </Text>
                                                    </Link>
                                                  </TableCell>
                                                )
                                              }}
                                            />
                                            <Column
                                              width={width * 0.2}
                                              label="Sale Price"
                                              dataKey="price"
                                              headerRenderer={({ label }) =>
                                                headerRenderer(label)
                                              }
                                              cellDataGetter={() => {}}
                                              cellRenderer={({ rowData }) => {
                                                return (
                                                  <TableCell
                                                    sx={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                    }}
                                                  >
                                                    {'SALE' === rowData?.type &&
                                                      rowData?.price && (
                                                        <Text
                                                          color="pink"
                                                          sx={{
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                              'ellipsis',
                                                          }}
                                                        >
                                                          {`${parseUint256(
                                                            rowData.price,
                                                            rowData.currency
                                                              .decimals,
                                                            2
                                                          )} ${
                                                            rowData?.currency
                                                              ?.symbol ?? 'ETH'
                                                          }
                                                        `}
                                                        </Text>
                                                      )}
                                                    {'TRANSFER' ===
                                                      rowData?.type && (
                                                      <Text
                                                        color="blue"
                                                        sx={{
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        Transfer
                                                      </Text>
                                                    )}
                                                    {'MINT' ===
                                                      rowData?.type && (
                                                      <Text
                                                        color="green"
                                                        sx={{
                                                          overflow: 'hidden',
                                                          textOverflow:
                                                            'ellipsis',
                                                        }}
                                                      >
                                                        Mint
                                                      </Text>
                                                    )}
                                                    <Link
                                                      href={`https://etherscan.io/tx/${rowData?.txHash}`}
                                                      target="_blank"
                                                      title="Open transaction on Etherscan"
                                                      rel="noopener noreferrer nofollow"
                                                      component={NextLink}
                                                    >
                                                      <IconButton
                                                        sx={{
                                                          marginLeft: '6px;',
                                                          verticalAlign:
                                                            'middle',
                                                        }}
                                                      >
                                                        <Icon
                                                          icon="disconnect"
                                                          color={
                                                            'SALE' ===
                                                            rowData?.type
                                                              ? 'pink'
                                                              : 'TRANSFER' ===
                                                                rowData?.type
                                                              ? 'blue'
                                                              : 'green'
                                                          }
                                                        />
                                                      </IconButton>
                                                    </Link>
                                                  </TableCell>
                                                )
                                              }}
                                            />
                                          </Table>
                                        </>
                                      )}
                                    </>
                                  )}
                                </AutoSizer>
                              )}
                            </InfiniteLoader>
                          </Box>
                        </Box>
                      ) : (
                        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                          <Text color="grey-600">
                            No transaction history available.
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Panel>
              </Flex>
              <>
                {isLoading ? (
                  <Skeleton sx={{ borderRadius: 'lg' }} />
                ) : noCollection ? (
                  <></>
                ) : Number(data?.getUser?.extraCollections?.count) > 2 ? (
                  distributionRadar
                ) : (
                  distributionTable
                )}
              </>
            </Grid>

            {/* {noCollection && (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 'calc(100% + 16px)',
                    height: 'calc(100% + 16px)',
                    margin: '-8px', // Negative margin to prevent blur artifacts.
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                <Flex
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  }}
                >
                  <Flex
                    sx={{
                      maxWidth: 400,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Text
                        sx={{
                          textTransform: 'uppercase',
                          color: 'black',
                          backgroundColor: 'blue',
                          borderRadius: 'xs',
                          padding: '2px 4px',
                          fontSize: 2,
                          fontWeight: 'bold',
                          lineHeight: 1,
                        }}
                      >
                        Upshot Beta
                      </Text>
                    </Box>
                    <Text
                      color="white"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 'heading',
                        fontSize: 4,
                        lineHeight: '1.5rem',
                      }}
                    >
                      <p>
                        This wallet does not hold any NFTs that have been
                        appraised by Upshot.
                      </p>
                      <p>
                        We&apos;re working hard to expand our list of supported
                        NFT collections, and we&apos;re adding more all the
                        time.
                      </p>
                      <p>Please check back soon!</p>
                    </Text>
                  </Flex>
                </Flex>
              </>
            )} */}
          </Box>

          {!!dataAllOwnedCollections?.getAllOwnedCollectionsWrapper
            ?.extraCollections?.count && (
            <Box sx={{ position: 'relative', height: '60px' }}>
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: ['column', 'row'],
                  paddingBottom: '1rem',
                  gap: 1,
                  position: 'absolute',
                  width: '100%',
                  height: open ? '250px' : 'auto',
                  zIndex: 2,
                  background: open
                    ? `linear-gradient(180deg, #000000 18.23%, rgba(35, 31, 32, 0.5) 90%, rgba(35, 31, 32, 0) 100%)`
                    : 'transparent',
                }}
              >
                <Flex sx={{ flexDirection: 'column' }}>
                  <Flex
                    variant="text.h1Secondary"
                    sx={{ gap: 2, alignItems: 'flex-start' }}
                  >
                    View
                    <SwitchDropdown
                      onValueChange={(val) => setProfileOption(val)}
                      value={profileOption}
                      options={dropdownOptions}
                      onToggle={(status) => setOpen(status)}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          )}
          {renderBottomSection()}
        </Flex>
      </Layout>
      <Modal
        hideScroll
        ref={modalRef}
        onClose={() => setShowCollection(undefined)}
        open={showCollection?.id !== undefined}
      >
        {(loadingAssets && showCollection?.id) ||
        (loadingUnsupportedAssets && showCollection?.osCollectionSlug) ? (
          <Flex
            sx={{
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Box sx={{ width: '95vw' }}>
            <CollectionCardExpanded
              linkComponent={NextLink}
              avatarImage={showCollection?.imageUrl}
              name={showCollection?.name ?? ''}
              total={showCollection?.numOwnedAssets ?? 0}
              items={
                (showCollection?.id
                  ? dataAssets?.collectionById?.ownerAssetsInCollection?.assets?.map(
                      ({
                        id,
                        name,
                        lastAppraisalWeiPrice,
                        lastAppraisalUsdPrice,
                        mediaUrl,
                        contractAddress,
                      }) => ({
                        id,
                        expanded: isMobile,
                        avatarImage:
                          showCollection?.imageUrl ?? '/img/defaultAvatar.png',
                        imageSrc: mediaUrl,
                        collection: showCollection?.name ?? '',
                        isPixelated:
                          PIXELATED_CONTRACTS.includes(contractAddress),
                        appraisalPriceETH: lastAppraisalWeiPrice
                          ? parseUint256(lastAppraisalWeiPrice)
                          : undefined,
                        appraisalPriceUSD: lastAppraisalUsdPrice
                          ? parseUint256(lastAppraisalUsdPrice, 6)
                          : undefined,
                        name: name
                          ? showCollection
                            ? name.replace(showCollection.name, '')
                            : name
                          : '', // remove collection name from NFT name
                        url: `/analytics/nft/${id}`,
                      })
                    )
                  : dataUnsupportedAssets?.getUnsupportedAssetPage?.assets?.map(
                      ({ name, address, tokenId, imageUrl }) => ({
                        id: address + '/' + tokenId,
                        expanded: isMobile,
                        avatarImage:
                          showCollection?.imageUrl ?? '/img/defaultAvatar.png',
                        imageSrc: imageUrl ?? '/img/defaultAvatar.png',
                        collection: showCollection?.name ?? '',
                        isPixelated: PIXELATED_CONTRACTS.includes(address),
                        appraisalPriceETH: null,
                        appraisalPriceUSD: null,
                        name: name
                          ? showCollection
                            ? name.replace(showCollection.name, '')
                            : name
                          : '', // remove collection name from NFT name
                        url: `https://opensea.io/assets/${address}/${tokenId}?ref=${OPENSEA_REFERRAL_LINK}`,
                      })
                    )) ?? []
              }
              onClose={() => modalRef?.current?.click()}
              onFetchMore={
                showCollection?.id
                  ? handleFetchMoreAssets
                  : handleFetchMoreUnsupportedAssets
              }
            />
          </Box>
        )}
      </Modal>
    </>
  )
}
