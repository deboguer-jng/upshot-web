/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { Container } from '@upshot-tech/upshot-ui'
import { Avatar, Flex, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { FormattedENS } from 'components/FormattedENS'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import { format, formatDistance } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import { Masonry, useInfiniteLoader } from 'masonic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchEns, shortenAddress } from 'utils/address'
import { formatCurrencyUnits, formatLargeNumber, weiToEth } from 'utils/number'

import Breadcrumbs from '../components/Breadcrumbs'
import { GET_COLLECTOR, GetCollectorData, GetCollectorVars } from './queries'
import {
  GET_COLLECTION_ASSETS,
  GetCollectionAssetsData,
  GetCollectionAssetsVars,
} from './queries'

type Collection = {
  id: number
  name: string
  imageUrl: string
}

function Layout({ children }: { children: React.ReactNode }) {
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
        <title>Upshot Analytics</title>
      </Head>
      <Nav />
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          gap: 4,
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />
        {children}
        <Footer />
      </Container>
    </>
  )
}

function Header({ address }: { address: string }) {
  const shortAddress = shortenAddress(address)
  const [displayName, setDisplayName] = useState(shortAddress)

  useEffect(() => {
    if (!address) return

    const updateEns = async () => {
      try {
        const { name } = await fetchEns(address, ethers.getDefaultProvider())
        if (!name) return

        setDisplayName(name)
      } catch (err) {
        console.error(err)
      }
    }

    const storage = globalThis?.sessionStorage
    const curPath = storage.getItem('currentPath')
    if (curPath?.indexOf('userWallet=') === -1)
      storage.setItem('currentPath', `${curPath}?userWallet=${displayName}`)

    updateEns()
  }, [address, displayName])

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

  /* Address formatting */
  const [addressFormatted, setAddressFormatted] = useState<string>()
  const [errorAddress, setErrorAddress] = useState(false)
  const address = router.query.address as string
  const shortAddress = useMemo(() => shortenAddress(address), [address])
  const loadingAddressFormatted = !addressFormatted && !errorAddress

  useEffect(() => {
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

  const {
    loading: loadingCollector,
    error,
    data,
    fetchMore: fetchMoreCollections,
  } = useQuery<GetCollectorData, GetCollectorVars>(GET_COLLECTOR, {
    errorPolicy: 'all',
    variables: {
      address: addressFormatted,
      collectionLimit: 8,
      collectionOffset: 0,
      assetLimit: 6,
      assetOffset: 0,
      txLimit: 25,
      txOffset: 0,
    },
    skip: !addressFormatted,
  })

  /* Waiting for collector data or query string address param to format. */
  const isLoading = loadingCollector || loadingAddressFormatted

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

  const handleFetchMoreAssets = useCallback(
    (startIndex: number) => {
      if (loadingAssets || assetOffset === startIndex) return
      setAssetOffset(startIndex)
    },
    [loadingAssets, assetOffset]
  )

  const handleFetchMoreCollections = useCallback(
    (startIndex: number) => {
      if (loadingCollector || collectionOffset === startIndex) return
      setCollectionOffset(startIndex)
    },
    [loadingCollector, collectionOffset]
  )

  useEffect(() => {
    if (!collectionOffset) return

    fetchMoreCollections({
      variables: { collectionOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev

        return {
          getUser: {
            ...prev.getUser,
            extraCollections: {
              count: fetchMoreResult?.getUser?.extraCollections?.count ?? 0,
              collectionAssetCounts: [
                ...(prev?.getUser?.extraCollections?.collectionAssetCounts ??
                  []),
                ...(fetchMoreResult?.getUser?.extraCollections
                  ?.collectionAssetCounts ?? []),
              ],
            },
          },
        }
      },
    })
  }, [collectionOffset])

  useEffect(() => {
    if (!assetOffset) return

    fetchMoreAssets({
      variables: { offset: assetOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev

        return {
          collectionById: {
            ownerAssetsInCollection: {
              count:
                fetchMoreResult?.collectionById?.ownerAssetsInCollection
                  ?.count ?? 0,
              assets: [
                ...(prev?.collectionById?.ownerAssetsInCollection?.assets ??
                  []),
                ...(fetchMoreResult?.collectionById?.ownerAssetsInCollection
                  ?.assets ?? []),
              ],
            },
          },
        }
      },
    })
  }, [assetOffset])

  const maybeLoadMore = useInfiniteLoader(handleFetchMoreCollections, {
    isItemLoaded: (index, items) => !!items[index],
  })

  const RenderMasonry = ({ index, data: { count, collection } }) => {
    return (
      <CollectionCard
        hasSeeAll={count > 5}
        seeAllImageSrc={
          collection.ownerAssetsInCollection.assets.slice(-1)[0].previewImageUrl
        }
        avatarImage={collection.imageUrl}
        link={`/analytics/collection/${collection.id}`}
        total={collection?.ownerAssetsInCollection?.count ?? 0}
        name={collection.name}
        key={index}
        onExpand={() =>
          setShowCollection({
            id: collection.id,
            name: collection.name,
            imageUrl: collection.imageUrl,
          })
        }
      >
        {collection.ownerAssetsInCollection.assets
          .slice(0, 5)
          .map(({ id, previewImageUrl, contractAddress }, idx) => (
            <Link passHref href={`/analytics/nft/${id}`} key={idx}>
              <Box
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  '&::after': {
                    content: "''",
                    display: 'block',
                    paddingTop: '100%',
                    backgroundImage: `url(${previewImageUrl})`,
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
      <CollectionTable>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell color="grey-500">Collection Name</TableCell>
            <TableCell color="grey-500">NFT Count</TableCell>
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
              >
                <TableCell sx={{ color: 'blue' }}>{count}</TableCell>
              </CollectionRow>
            )
          )}
        </TableBody>
      </CollectionTable>
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
                      parseFloat(ethers.utils.formatEther(ownedAppraisedValue))
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

  return (
    <>
      <Layout>
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          {!!address && <Header key={address} {...{ address }} />}
          {/* User Description */}
          <Text color="grey-400">{data?.getUser?.bio}</Text>
          <Grid gap={4} columns={[1, 1, 1, 2]}>
            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <Grid gap={2} columns={[1, 2, 3]}>
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
                          {data?.getUser?.totalAssetAppraisedValueUsd
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
                          {data?.getUser?.totalAssetAppraisedValueWei
                            ? parseFloat(
                                ethers.utils.formatEther(
                                  data.getUser.totalAssetAppraisedValueWei
                                )
                              ).toFixed(2)
                            : '-'}
                        </Text>
                      </Flex>
                      <Flex sx={{ justifyContent: 'center' }}>
                        <Text
                          color="blue"
                          sx={{
                            fontSize: 1,
                            lineHeight: 1,
                            marginRight: '2px',
                          }}
                        >
                          {data?.getUser?.totalAssetAppraisedValueUsd
                            ? '~ $'
                            : ''}
                        </Text>
                        <Text
                          color="blue"
                          sx={{
                            fontSize: 2,
                            fontWeight: 'heading',
                            lineHeight: 1,
                          }}
                        >
                          {data?.getUser?.totalAssetAppraisedValueUsd
                            ? formatLargeNumber(
                                Number(
                                  formatCurrencyUnits(
                                    data.getUser.totalAssetAppraisedValueUsd,
                                    6
                                  )
                                )
                              )
                            : '-'}
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
                        {data?.getUser?.firstAssetPurchaseTime
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
                        {data?.getUser?.numAssets ?? 0}
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
                        {data?.getUser?.extraCollections?.count ?? 0}
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
                        {data?.getUser?.mostRecentSell?.txAt
                          ? format(
                              data.getUser.mostRecentSell.txAt * 1000,
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
                        Most Recent Sale
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
                  maxHeight: 340,
                }}
              >
                <Box
                  sx={{ overflowY: 'auto', flexGrow: 1 }}
                  css={theme.scroll.thin}
                >
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                      <Text variant="h3Secondary">Transaction History</Text>

                      {!!data?.getUser?.txHistory?.count ? (
                        <Table sx={{ borderSpacing: '0 10px' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell color="grey-500">Date</TableCell>
                              {!isMobile && (
                                <>
                                  <TableCell color="grey-500">Sender</TableCell>
                                  <TableCell color="grey-500">
                                    Recipient
                                  </TableCell>
                                </>
                              )}

                              <TableCell color="grey-500">Sale Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.getUser?.txHistory?.events?.map(
                              (
                                {
                                  type,
                                  txAt,
                                  txFromAddress,
                                  txToAddress,
                                  txHash,
                                  price,
                                  currency: { symbol, decimals },
                                },
                                idx
                              ) => (
                                <TableRow key={idx}>
                                  <TableCell sx={{ minWidth: 140 }}>
                                    {format(txAt * 1000, 'M/d/yyyy')}
                                  </TableCell>
                                  {!isMobile && (
                                    <>
                                      <TableCell sx={{ minWidth: 140 }}>
                                        <Flex
                                          sx={{
                                            alignItems: 'center',
                                            gap: 2,
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
                                            href={`/analytics/user/${txFromAddress}`}
                                          >
                                            <a
                                              sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                  textDecoration: 'underline',
                                                },
                                              }}
                                            >
                                              <FormattedENS
                                                address={txFromAddress}
                                              />
                                            </a>
                                          </Link>
                                        </Flex>
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 140 }}>
                                        <Flex
                                          sx={{
                                            alignItems: 'center',
                                            gap: 2,
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
                                            href={`/analytics/user/${txToAddress}`}
                                          >
                                            <a
                                              sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                  textDecoration: 'underline',
                                                },
                                              }}
                                            >
                                              <FormattedENS
                                                address={txToAddress}
                                              />
                                            </a>
                                          </Link>
                                        </Flex>
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell
                                    sx={{ minWidth: 100, color: 'pink' }}
                                  >
                                    {'SALE' === type &&
                                      price &&
                                      `${formatCurrencyUnits(
                                        price,
                                        decimals
                                      )} ${symbol ?? 'ETH'}`}
                                    {'TRANSFER' === type && (
                                      <Text color="blue">Transfer</Text>
                                    )}
                                    {'MINT' === type && (
                                      <Text color="green">Mint</Text>
                                    )}
                                    <a
                                      href={`https://etherscan.io/tx/${txHash}`}
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
                                            'SALE' === type
                                              ? 'pink'
                                              : 'TRANSFER' === type
                                              ? 'blue'
                                              : 'green'
                                          }
                                        />
                                      </IconButton>
                                    </a>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      ) : (
                        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                          {isLoading ? (
                            [...new Array(3)].map((_, idx) => (
                              <Skeleton
                                sx={{
                                  height: 24,
                                  width: '100%',
                                  borderRadius: 'sm',
                                }}
                                key={idx}
                              />
                            ))
                          ) : (
                            <Text color="grey-600">
                              No transaction history available.
                            </Text>
                          )}
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Panel>
            </Flex>
            <>
              {isLoading ? (
                <Skeleton sx={{ borderRadius: 'lg' }} />
              ) : noCollection ||
                Number(data?.getUser?.extraCollections?.count) > 2 ? (
                distributionRadar
              ) : (
                distributionTable
              )}
            </>
          </Grid>
          {!!data?.getUser?.extraCollections?.count && (
            <Text variant="h1Primary">Collection</Text>
          )}
          <Masonry
            columnWidth={300}
            columnGutter={16}
            rowGutter={16}
            items={data?.getUser?.extraCollections?.collectionAssetCounts ?? []}
            render={RenderMasonry}
            onRender={maybeLoadMore}
          />
        </Flex>
      </Layout>
      <Modal
        ref={modalRef}
        onClose={() => setShowCollection(undefined)}
        open={showCollection?.id !== undefined}
      >
        {loadingAssets ? (
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
              avatarImage={showCollection?.imageUrl ?? '/img/defaultAvatar.png'}
              name={showCollection?.name ?? ''}
              total={
                dataAssets?.collectionById?.ownerAssetsInCollection?.count ?? 0
              }
              items={
                dataAssets?.collectionById?.ownerAssetsInCollection?.assets?.map(
                  ({
                    id,
                    name,
                    lastAppraisalWeiPrice,
                    previewImageUrl,
                    contractAddress,
                  }) => ({
                    id,
                    expanded: isMobile,
                    avatarImage:
                      showCollection?.imageUrl ?? '/img/defaultAvatar.png',
                    imageSrc: previewImageUrl ?? '/img/defaultAvatar.png',
                    name: name ?? '',
                    isPixelated: PIXELATED_CONTRACTS.includes(contractAddress),
                    description:
                      `Latest Appraised Value: ${weiToEth(
                        lastAppraisalWeiPrice
                      )}` ?? '',
                  })
                ) ?? []
              }
              onClose={() => modalRef?.current?.click()}
              onFetchMore={handleFetchMoreAssets}
            />
          </Box>
        )}
      </Modal>
      {noCollection && (
        <Flex
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
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
                This wallet currently does not hold any NFT collections Upshot
                supports.
              </p>
              <p>We&apos;re working on expanding out collection list.</p>
              <p>Please check back soon!</p>
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  )
}
