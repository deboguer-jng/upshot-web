/** @jsxImportSource theme-ui */

import { useQuery } from '@apollo/client'
import { Container } from '@upshot-tech/upshot-ui'
import { Avatar, Flex, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  Checkbox,
  CollectionCard,
  CollectionCardExpanded,
  CollectionRow,
  CollectionTable,
  Icon,
  IconButton,
  Modal,
  RadarChart,
  Skeleton,
  Spinner,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { imageOptimizer, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { OPENSEA_REFERRAL_LINK, PIXELATED_CONTRACTS } from 'constants/'
import { format, formatDistance } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import { Masonry, useInfiniteLoader } from 'masonic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AutoSizer,
  Column,
  Grid as GridVirtualized,
  InfiniteLoader,
  Table,
} from 'react-virtualized'
import { Label as LabelUI } from 'theme-ui'
import { extractEns, shortenAddress } from 'utils/address'
import {
  formatCommas,
  formatCurrencyUnits,
  formatLargeNumber,
  weiToEth,
} from 'utils/number'

import Breadcrumbs from '../components/Breadcrumbs'
import {
  GET_COLLECTION_ASSETS,
  GET_COLLECTOR,
  GET_COLLECTOR_TX_HISTORY,
  GET_UNSUPPORTED_AGGREGATE_COLLECTION_STATS,
  GET_UNSUPPORTED_ASSETS,
  GET_UNSUPPORTED_COLLECTIONS,
  GET_UNSUPPORTED_FLOORS,
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
  GetUnsupportedCollectionsData,
  GetUnsupportedCollectionsVars,
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
      <Head>
        <title>{title ? title + ' | ' : ''}Upshot Analytics</title>
      </Head>
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
}: {
  address: string
  displayName?: string
}) {
  const shortAddress = shortenAddress(address)

  useEffect(() => {
    if (!displayName) return

    const storage = globalThis?.sessionStorage
    const curPath = storage.getItem('currentPath')

    if (curPath?.indexOf('userWallet=') === -1)
      storage.setItem('currentPath', `${curPath}?userWallet=${displayName}`)
  }, [displayName])

  return (
    <Flex sx={{ alignItems: 'center', gap: 4 }}>
      <Avatar size="lg" src={makeBlockie(address)} />
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Text variant="h1Primary" sx={{ lineHeight: 1 }}>
          {displayName}&apos;s Collection
        </Text>
        <Text color="grey-400" sx={{ lineHeight: 1 }}>
          {shortAddress}
        </Text>
      </Flex>
    </Flex>
  )
}

function IncludeUnsupportedCheckbox({
  value,
  onClick,
}: {
  value: boolean
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void
}) {
  const { theme } = useTheme()
  return (
    <Panel
      sx={{
        backgroundColor: 'grey-900',
        borderRadius: '20px',
        marginBottom: '20px',
        border: 'solid 1px ' + theme.colors.blue,
        transition: 'all .125s ease-in-out',
        '&:hover': {
          boxShadow: '0px 0px 0px 1px ' + theme.colors.blue,
        },
      }}
    >
      <LabelUI sx={{ alignItems: 'center', marginBottom: 2 }}>
        <Checkbox
          readOnly
          checked={value}
          sx={{ cursor: 'pointer' }}
          {...{ onClick }}
        />
        <Text color="blue">Include unappraised assets</Text>
      </LabelUI>
      <Text color="grey-500">
        We are in the process of supporting more collections and NFT appraisals.
        In the meantime, check this box to view all of the collections you own
        NFTs from along with their floor prices.
      </Text>
    </Panel>
  )
}

export default function UserView() {
  const router = useRouter()
  const { theme } = useTheme()
  const [includeUnsupportedAssets, setIncludeUnsupportedAssets] =
    useState(false)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const modalRef = useRef<HTMLDivElement>(null)

  /* Collection & Asset offsets */
  const [showCollection, setShowCollection] = useState<Collection>()
  const [collectionOffset, setCollectionOffset] = useState(0)
  const [unsupportedCollectionOffset, setUnsupportedCollectionOffset] =
    useState(0)
  const [assetOffset, setAssetOffset] = useState(0)
  let promiseResolve
  const [unsupportedAssetOffset, setUnsupportedAssetOffset] = useState(0)
  const [hasAllSupportedCollections, setHasAllSupportedCollections] =
    useState(false)

  /* Address formatting */
  const [addressFormatted, setAddressFormatted] = useState<string>()
  const [errorAddress, setErrorAddress] = useState(false)
  const address = router.query.address as string
  const shortAddress = useMemo(() => shortenAddress(address), [address])
  const loadingAddressFormatted = !addressFormatted && !errorAddress

  useEffect(() => {
    if (!address) return

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
  }, [address])

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
        txLimit: 25,
        txOffset: 0,
      },
      skip: !addressFormatted,
    }
  )

  const handleShowCollection = (id: number) => {
    router.push('/analytics/collection/' + id)
  }

  /* Waiting for collector data or query string address param to format. */
  const isLoading =
    loadingCollection || loadingAddressFormatted || loadingTxHistory

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

  /* Request unsupported assets */
  const {
    data: dataUnsupportedCollections,
    error: errorUnsupportedCollections,
    loading: loadingUnsupportedCollection,
    fetchMore: fetchMoreUnsupportedCollections,
  } = useQuery<GetUnsupportedCollectionsData, GetUnsupportedCollectionsVars>(
    GET_UNSUPPORTED_COLLECTIONS,
    {
      errorPolicy: 'all',
      variables: {
        userAddress: addressFormatted,
        limit: collectionLimit,
        offset: 0,
      },
      skip:
        !addressFormatted ||
        !includeUnsupportedAssets ||
        !hasAllSupportedCollections,
    }
  )

  /* Request unsupported aggregate collection stats */
  const { data: dataUnsupportedAggregateCollectionStats } = useQuery<
    GetUnsupportedAggregateCollectionStatsData,
    GetUnsupportedAggregateCollectionStatsVars
  >(GET_UNSUPPORTED_AGGREGATE_COLLECTION_STATS, {
    errorPolicy: 'all',
    variables: {
      userAddress: addressFormatted,
    },
    skip: !addressFormatted || !includeUnsupportedAssets,
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
            dataUnsupportedCollections?.getUnsupportedCollectionPage
              ?.slugsWithNullFloors ?? '[]',
        },
        skip: !dataUnsupportedCollections?.getUnsupportedCollectionPage
          ?.slugsWithNullFloors,
      }
    )

  const collectionSlugs = dataUnsupportedCollections
    ?.getUnsupportedCollectionPage?.slugsWithNullFloors
    ? JSON.parse(
        dataUnsupportedCollections.getUnsupportedCollectionPage
          .slugsWithNullFloors
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
      if (
        loadingCollection ||
        collectionOffset === startIndex ||
        startIndex < collectionLimit
      )
        return setHasAllSupportedCollections(true)
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

  const handleFetchMoreUnsupportedCollections = useCallback(() => {
    if (
      loadingUnsupportedCollection ||
      !dataUnsupportedCollections?.getUnsupportedCollectionPage?.nextOffset
    )
      return
    setUnsupportedCollectionOffset(
      dataUnsupportedCollections.getUnsupportedCollectionPage.nextOffset
    )
  }, [
    loadingUnsupportedCollection,
    dataUnsupportedCollections?.getUnsupportedCollectionPage?.nextOffset,
  ])

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

  /* Infinite scroll: Collections */
  useEffect(() => {
    if (!collectionOffset) return

    const hasAllCollections =
      data?.getUser?.extraCollections?.count === collectionOffset
    if (hasAllCollections) return setHasAllSupportedCollections(true)

    fetchMoreCollections({
      variables: { collectionOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUser) return prev

        return {
          getUser: {
            ...prev.getUser,
            extraCollections: {
              count: fetchMoreResult.getUser?.extraCollections?.count ?? 0,
              collectionAssetCounts: [
                ...(prev.getUser?.extraCollections?.collectionAssetCounts ??
                  []),
                ...(fetchMoreResult.getUser?.extraCollections
                  ?.collectionAssetCounts ?? []),
              ],
            },
          },
        }
      },
    })
  }, [collectionOffset, fetchMoreCollections])

  const fetchTxHistories = (offset: number) => {
    fetchMoreTxHistories({
      variables: { txOffset: offset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return {
          getTxHistory: {
            ...prev.getTxHistory,
            txHistory: {
              count: fetchMoreResult?.getTxHistory?.txHistory?.count ?? 0,
              events: [
                ...(prev?.getTxHistory?.txHistory?.events ?? []),
                ...(fetchMoreResult?.getTxHistory?.txHistory?.events ?? []),
              ],
            },
          },
        }
      },
    })
  }
  /* Infinite scroll: Unsupported Collections */
  useEffect(() => {
    if (!unsupportedCollectionOffset) return

    fetchMoreUnsupportedCollections({
      variables: { offset: unsupportedCollectionOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUnsupportedCollectionPage) return prev

        return {
          getUnsupportedCollectionPage: {
            ...prev.getUnsupportedCollectionPage,
            slugsWithNullFloors:
              fetchMoreResult.getUnsupportedCollectionPage?.slugsWithNullFloors,
            nextOffset:
              fetchMoreResult.getUnsupportedCollectionPage?.nextOffset,
            collections: [
              ...(prev.getUnsupportedCollectionPage?.collections ?? []),
              ...(fetchMoreResult.getUnsupportedCollectionPage?.collections ??
                []),
            ],
          },
        }
      },
    })
  }, [unsupportedCollectionOffset, fetchMoreUnsupportedCollections])

  /* Infinite scroll: Assets */
  useEffect(() => {
    if (!assetOffset) return

    fetchMoreAssets({
      variables: { offset: assetOffset },
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
      isItemLoaded: (index, items) => !!items[index],
    }
  )

  const maybeLoadMoreUnsupportedCollections = useInfiniteLoader(
    handleFetchMoreUnsupportedCollections,
    {
      isItemLoaded: (index, items) => !!items[index],
    }
  )

  const RenderSupportedMasonry = ({
    index,
    data: { count, collection, ownedAppraisedValue },
  }) => {
    const formattedAppraisedValue = ownedAppraisedValue
      ? formatCommas(
          parseFloat(ethers.utils.formatEther(ownedAppraisedValue)).toFixed(2)
        )
      : ownedAppraisedValue
    const price = collection.isAppraised
      ? { appraisalPrice: formattedAppraisedValue }
      : { floorPrice: formattedAppraisedValue }

    return (
      <>
        {index === 0 && ( // append Supported/Unsupported checkbox before the first card
          <IncludeUnsupportedCheckbox
            onClick={() =>
              setIncludeUnsupportedAssets(!includeUnsupportedAssets)
            }
            value={includeUnsupportedAssets}
          />
        )}
        <CollectionCard
          {...price}
          hasSeeAll={count > 5}
          seeAllImageSrc={
            collection.ownerAssetsInCollection.assets[0]?.previewImageUrl
          }
          avatarImage={collection.imageUrl}
          link={`/analytics/collection/${collection.id}`}
          total={collection?.ownerAssetsInCollection?.count}
          name={collection.name}
          key={index}
          onExpand={() =>
            setShowCollection({
              id: collection.id,
              name: collection.name,
              imageUrl: collection.imagrl,
              numOwnedAssets: collection?.ownerAssetsInCollection?.count,
            })
          }
        >
          {collection.ownerAssetsInCollection.assets
            .slice(0, 5)
            .map(({ id, previewImageUrl, mediaUrl, contractAddress }, idx) => (
              <Link passHref href={`/analytics/nft/${id}`} key={idx}>
                <Box
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    '&::after': {
                      content: "''",
                      display: 'block',
                      paddingTop: '100%',
                      backgroundImage: `url(${
                        imageOptimizer(previewImageUrl ?? mediaUrl, {
                          width: 180,
                          height: 180,
                        }) ??
                        previewImageUrl ??
                        mediaUrl
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
      </>
    )
  }

  const RenderUnsupportedMasonry = ({
    index,
    data: {
      name,
      imageUrl,
      address,
      osCollectionSlug,
      floorEth,
      numOwnedAssets,
    },
  }: {
    index: number
    data: {
      name: string
      imageUrl: string
      address: string
      floorEth: number
      osCollectionSlug: string
      numOwnedAssets: number
    }
  }) => {
    return (
      <>
        <CollectionCard
          isUnsupported
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
          <Box
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
                paddingTop: '50%',
                backgroundImage: `url(${imageOptimizer(imageUrl, {
                  width: 500,
                  height: 500,
                })})`,
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
        </CollectionCard>
      </>
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
                >
                  <TableCell sx={{ color: 'blue' }}>{count}</TableCell>
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
          />
        </Box>
      </Flex>
    </Panel>
  )

  const loadMore = () => {
    // simulate a request
    fetchTxHistories(
      txHistoryData?.getTxHistory?.txHistory?.events?.length ?? 0 + 1
    )
    return new Promise((resolve, reject) => {})
  }

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
    ? formatCommas(
        (
          parseFloat(
            ethers.utils.formatEther(
              data.getUser.ownedAppraisalValue.appraisalWei
            )
          ) + unsupportedAggregateCollectionStatFloorEth
        ).toFixed(2),
        2,
        2
      )
    : '-'

  const calculatedTotalAssetAppraisedValueUsd = data?.getUser
    ?.ownedAppraisalValue?.appraisalUsd
    ? formatLargeNumber(
        Number(
          formatCurrencyUnits(data.getUser.ownedAppraisalValue.appraisalUsd, 6)
        ) + unsupportedAggregateCollectionStatFloorUsd
      )
    : '-'

  const calculatedTotalNumUniqueCollections = data?.getUser?.extraCollections
    ?.count
    ? formatCommas(
        Number(data.getUser.extraCollections?.count) +
          unsupportedAggregateCollectionStatNumUniqueCollections,
        0,
        0
      )
    : '-'

  const calculatedTotalNumAssets = data?.getUser?.numAssets
    ? formatCommas(
        Number(data.getUser.numAssets) +
          unsupportedAggregateCollectionStatNumAssets,
        0,
        0
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

  return (
    <>
      <Layout
        title={extractEns(data?.getUser?.addresses, address) ?? shortAddress}
      >
        {data?.getUser?.warningBanner && (
          <Text
            backgroundColor={'primary'}
            color="black"
            sx={{ padding: '10px 30px', borderRadius: '10px', fontWeight: 600 }}
          >
            This portfolio contains a valuable item. Our top-tier appraisals are
            under active development.
          </Text>
        )}
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          {!!address && (
            <Header
              key={address}
              {...{
                address,
                displayName:
                  extractEns(data?.getUser?.addresses, address) ?? shortAddress,
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
                            textTransform: 'capitalize',
                          }}
                        >
                          {data?.getUser?.firstAssetPurchaseTime &&
                          !noCollection
                            ? formatDistance(
                                data.getUser.firstAssetPurchaseTime * 1000,
                                new Date()
                              )
                            : '-'}
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
                          Age of Collection
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
                          }}
                        >
                          {data?.getUser?.avgHoldTime
                            ? formatDistance(
                                data.getUser.avgHoldTime * 1000,
                                new Date(0)
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
                          Average Hold Time
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
                          sx={{ position: 'relative', height: '300px' }}
                          css={theme.scroll.thin.styles}
                        >
                          <InfiniteLoader
                            isRowLoaded={({ index }) =>
                              !!txHistoryData?.getTxHistory?.txHistory?.events[
                                index
                              ]
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
                                      <Table
                                        ref={registerChild}
                                        onRowsRendered={onRowsRendered}
                                        rowClassName="table-row"
                                        headerHeight={30}
                                        width={width}
                                        height={270}
                                        rowHeight={30}
                                        rowCount={
                                          txHistoryData?.getTxHistory?.txHistory
                                            ?.count
                                        }
                                        rowGetter={({ index }) =>
                                          txHistoryData?.getTxHistory?.txHistory
                                            ?.events[index]
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
                                          width={width * 0.4}
                                        />
                                        <Column
                                          width={width * 0.6}
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
                                                      {`${formatCurrencyUnits(
                                                        rowData?.price,
                                                        rowData?.currency
                                                          ?.decimals
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
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    Transfer
                                                  </Text>
                                                )}
                                                {'MINT' === rowData?.type && (
                                                  <Text
                                                    color="green"
                                                    sx={{
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    Mint
                                                  </Text>
                                                )}
                                                <a
                                                  href={`https://etherscan.io/tx/${rowData?.txHash}`}
                                                  target="_blank"
                                                  title="Open transaction on Etherscan"
                                                  rel="noopener noreferrer nofollow"
                                                >
                                                  <IconButton
                                                    sx={{
                                                      marginLeft: '6px;',
                                                      verticalAlign: 'middle',
                                                    }}
                                                  >
                                                    <Icon
                                                      icon="disconnect"
                                                      color={
                                                        'SALE' === rowData?.type
                                                          ? 'pink'
                                                          : 'TRANSFER' ===
                                                            rowData?.type
                                                          ? 'blue'
                                                          : 'green'
                                                      }
                                                    />
                                                  </IconButton>
                                                </a>
                                              </TableCell>
                                            )
                                          }}
                                        />
                                      </Table>
                                    ) : (
                                      <Table
                                        ref={registerChild}
                                        onRowsRendered={onRowsRendered}
                                        rowStyle={{ width: width }}
                                        headerHeight={30}
                                        width={width}
                                        height={270}
                                        rowHeight={40}
                                        rowCount={
                                          txHistoryData?.getTxHistory?.txHistory
                                            ?.count
                                        }
                                        rowGetter={({ index }) =>
                                          txHistoryData?.getTxHistory?.txHistory
                                            ?.events[index]
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
                                              >
                                                <a
                                                  sx={{
                                                    cursor: 'pointer',
                                                    display: 'block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    '&:hover': {
                                                      textDecoration:
                                                        'underline',
                                                    },
                                                  }}
                                                >
                                                  {rowData?.asset?.name}
                                                </a>
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
                                                <a
                                                  href={`/analytics/user/${rowData?.txFromAddress}`}
                                                  sx={{
                                                    cursor: 'pointer',
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    fontSize: 2.5,
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                      textDecoration:
                                                        'underline',
                                                    },
                                                  }}
                                                >
                                                  <Text
                                                    sx={{
                                                      display: 'block',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    {extractEns(
                                                      rowData?.txFromUser
                                                        ?.addresses,
                                                      rowData?.txFromAddress
                                                    ) ?? rowData?.txFromAddress}
                                                  </Text>
                                                </a>
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
                                                <a
                                                  href={`/analytics/user/${rowData?.txToAddress}`}
                                                  sx={{
                                                    cursor: 'pointer',
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    fontSize: 2.5,
                                                    textDecoration: 'none',
                                                    color: 'white',
                                                    '&:hover': {
                                                      textDecoration:
                                                        'underline',
                                                    },
                                                  }}
                                                >
                                                  <Text
                                                    sx={{
                                                      display: 'block',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    {extractEns(
                                                      rowData?.txToUser
                                                        ?.addresses,
                                                      rowData?.txToAddress
                                                    ) ?? rowData?.txToAddress}
                                                  </Text>
                                                </a>
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
                                                      {`${formatCurrencyUnits(
                                                        rowData?.price,
                                                        rowData?.currency
                                                          ?.decimals
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
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    Transfer
                                                  </Text>
                                                )}
                                                {'MINT' === rowData?.type && (
                                                  <Text
                                                    color="green"
                                                    sx={{
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                    }}
                                                  >
                                                    Mint
                                                  </Text>
                                                )}
                                                <a
                                                  href={`https://etherscan.io/tx/${rowData?.txHash}`}
                                                  target="_blank"
                                                  title="Open transaction on Etherscan"
                                                  rel="noopener noreferrer nofollow"
                                                >
                                                  <IconButton
                                                    sx={{
                                                      marginLeft: '6px;',
                                                      verticalAlign: 'middle',
                                                    }}
                                                  >
                                                    <Icon
                                                      icon="disconnect"
                                                      color={
                                                        'SALE' === rowData?.type
                                                          ? 'pink'
                                                          : 'TRANSFER' ===
                                                            rowData?.type
                                                          ? 'blue'
                                                          : 'green'
                                                      }
                                                    />
                                                  </IconButton>
                                                </a>
                                              </TableCell>
                                            )
                                          }}
                                        />
                                      </Table>
                                    )}
                                  </>
                                )}
                              </AutoSizer>
                            )}
                          </InfiniteLoader>
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

          {!!data?.getUser?.extraCollections?.count && (
            <Text variant="h1Primary">Collection</Text>
          )}
          {!data?.getUser?.extraCollections?.count && (
            <Grid gap={4} columns={[1, 1, 1, 3]}>
              <IncludeUnsupportedCheckbox
                onClick={() =>
                  setIncludeUnsupportedAssets(!includeUnsupportedAssets)
                }
                value={includeUnsupportedAssets}
              />
            </Grid>
          )}
          <Masonry
            columnWidth={300}
            columnGutter={16}
            rowGutter={16}
            items={data?.getUser?.extraCollections?.collectionAssetCounts ?? []}
            render={RenderSupportedMasonry}
            onRender={maybeLoadMoreCollections}
            style={{ outline: 'none' }}
            key={data?.getUser?.extraCollections?.collectionAssetCounts?.length}
          />
          {includeUnsupportedAssets &&
            !!dataUnsupportedCollections?.getUnsupportedCollectionPage
              ?.collections?.length && (
              <>
                <Text variant="h1Primary">Unappraised</Text>
                <Masonry
                  columnWidth={300}
                  columnGutter={16}
                  rowGutter={16}
                  items={
                    dataUnsupportedCollections?.getUnsupportedCollectionPage
                      ?.collections ?? []
                  }
                  render={RenderUnsupportedMasonry}
                  onRender={maybeLoadMoreUnsupportedCollections}
                  style={{ outline: 'none' }}
                />
              </>
            )}
        </Flex>
      </Layout>
      <Modal
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
                        previewImageUrl,
                        mediaUrl,
                        contractAddress,
                      }) => ({
                        id,
                        expanded: isMobile,
                        avatarImage:
                          showCollection?.imageUrl ?? '/img/defaultAvatar.png',
                        imageSrc: previewImageUrl ?? mediaUrl,
                        collection: showCollection?.name ?? '',
                        isPixelated:
                          PIXELATED_CONTRACTS.includes(contractAddress),
                        appraisalPriceETH: lastAppraisalWeiPrice
                          ? formatCommas(
                              weiToEth(lastAppraisalWeiPrice, 4, false)
                            )
                          : null,
                        appraisalPriceUSD: lastAppraisalUsdPrice
                          ? formatCommas(
                              Math.round(
                                parseInt(lastAppraisalUsdPrice) / 1000000
                              )
                            )
                          : null,
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
