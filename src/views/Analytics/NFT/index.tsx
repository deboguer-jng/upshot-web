/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  BuyNowPanel,
  imageOptimizer,
  Pagination,
  Tooltip,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Image, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  Chart,
  formatNumber,
  Icon,
  IconButton,
  Label,
  LabelAttribute,
  Link,
  Panel,
  parseUint256,
  useTheme,
} from '@upshot-tech/upshot-ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { ART_BLOCKS_CONTRACTS, PIXELATED_CONTRACTS } from 'constants/'
import { format } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'
import { extractEns, shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { getPriceChangeColor } from 'utils/color'

import Breadcrumbs from '../components/Breadcrumbs'
import Collectors from '../components/ExplorePanel/Collectors'
import { GET_ASSET, GetAssetData, GetAssetVars } from './queries'

function Layout({ children }: { children: React.ReactNode }) {
  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')

  const breadcrumbs = prevPath?.includes('user')
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
    : prevPath?.includes('search') || prevPath?.includes('collection')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: prevPath?.includes('search')
            ? 'Search'
            : prevPath?.includes('collection')
            ? decodeURI(prevPath as string).split('?collectionName=')[1]
            : '',
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

export default function NFTView() {
  const [id, setId] = useState('')
  const dispatch = useAppDispatch()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()
  const { theme } = useTheme()
  const [traitPage, setTraitPage] = useState<number>(0)
  const [pageTraits, setPageTraits] = useState<any[]>([])
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))

  const TRAIT_PAGE_SIZE = 4

  useEffect(() => {
    /* Parse assetId from router */
    const tokenId = router.query.tokenId as string
    let contractAddress = router.query.contractAddress as string
    try {
      contractAddress = ethers.utils.getAddress(contractAddress)
    } catch (err) {}
    if (!tokenId || !contractAddress) return

    setId([contractAddress, tokenId].join('/'))
  }, [router.query])

  const { loading, error, data } = useQuery<GetAssetData, GetAssetVars>(
    GET_ASSET,
    {
      errorPolicy: 'all',
      variables: { id },
      skip: !id,
    }
  )

  useEffect(() => {
    if (!data?.assetById) return

    const storage = globalThis?.sessionStorage
    const curPath = storage.getItem('currentPath')
    if (curPath?.indexOf('nftName=') === -1)
      storage.setItem(
        'currentPath',
        `${curPath}?nftName=${data?.assetById.name}`
      )

    changePageTraits()
  }, [data])

  useEffect(() => {
    if (!traits) return

    changePageTraits()
  }, [traitPage])

  /* Load state. */
  if (loading)
    return (
      <Layout>
        <Container sx={{ justifyContent: 'center', flexGrow: 1 }}>
          Loading...
        </Container>
      </Layout>
    )

  /* Error state. */
  // if (error)
  //   return (
  //     <Layout>
  //       <Container sx={{ justifyContent: 'center', flexGrow: 1 }}>
  //         Error loading asset.
  //       </Container>
  //     </Layout>
  //   )

  /* No results state. */
  if (!data?.assetById)
    return (
      <Layout>
        <Container sx={{ justifyContent: 'center', flexGrow: 1 }}>
          Unable to load asset.
        </Container>
      </Layout>
    )

  const {
    name,
    mediaUrl,
    collection,
    tokenId,
    traits,
    lastAppraisalWeiPrice,
    lastAppraisalUsdPrice,
    lastAppraisalAt,
    latestAppraisal,
    txHistory,
    appraisalHistory,
    contractAddress,
    warningBanner,
    listPrice,
    listPriceUsd,
    listMarketplace,
    listUrl,
    listAppraisalRatio,
  } = data.assetById

  const changePageTraits = () => {
    if (traits) {
      let startingIndex = traitPage * TRAIT_PAGE_SIZE
      let endIndex = startingIndex + TRAIT_PAGE_SIZE
      setPageTraits(traits.slice(startingIndex, endIndex))
    }
  }

  const handlePageChange = ({ selected }: { selected: number }) => {
    setTraitPage(selected)
  }

  const appraisalSeries = appraisalHistory
    .filter(({ timestamp, estimatedPrice }) => timestamp && estimatedPrice)
    .map(({ timestamp, estimatedPrice }) => [
      timestamp * 1000,
      parseFloat(ethers.utils.formatEther(estimatedPrice)),
    ])

  const isFloor = !latestAppraisal && appraisalHistory.length

  const chartData = [
    {
      name: isFloor ? 'Collection Floor' : 'Appraisals',
      data: appraisalSeries,
      color: theme.rawColors[isFloor ? 'pink' : 'blue'],
    },
  ]

  const assetName = getAssetName(name, collection?.name, tokenId)
  const displayName =
    extractEns(
      txHistory?.[0]?.txToUser?.addresses,
      txHistory?.[0]?.txToAddress
    ) ??
    shortenAddress(txHistory?.[0]?.txToAddress) ??
    'Unknown'

  const image = mediaUrl
  const optimizedSrc = imageOptimizer(image, { width: 340 }) ?? image
  const finalImageSrc = PIXELATED_CONTRACTS.includes(contractAddress)
    ? image
    : optimizedSrc

  return (
    <>
      <Head>
        <title>{name} | Upshot Analytics</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@UpshotHQ" />
        <meta name="twitter:creator" content="@UpshotHQ" />
        <meta property="og:url" content="https://upshot.io" />
        <meta property="og:title" content="Upshot Analytics" />
        <meta
          property="og:description"
          content="NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities."
        />
        <meta
          property="og:image"
          content="https://upshot.io/img/opengraph/opengraph_nft.jpg"
        />
      </Head>
      <Layout>
        <Grid
          columns={[1, 1, 1, 2]}
          sx={{
            gridTemplateColumns: ['1fr', '1fr', '1fr 3fr', '1fr 3fr'],
            flexGrow: 1,
          }}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              gap: 4,
              position: ['static', 'static', 'sticky', 'sticky'],
              height: 'min-content',
              top: '160px',
            }}
          >
            <Image
              src={finalImageSrc}
              alt={`Featured image for ${assetName}`}
              sx={{
                borderRadius: '10px',
                width: '100%',
                backgroundColor: 'grey-600',
                imageRendering: PIXELATED_CONTRACTS.includes(contractAddress)
                  ? 'pixelated'
                  : 'auto',
              }}
            />
            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <Text variant="h2Primary">{assetName}</Text>
              <>
                <Flex sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  {!!lastAppraisalWeiPrice && (
                    <Flex
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Text color="blue" sx={{ border: 'none', fontSize: 16 }}>
                        {formatNumber(lastAppraisalWeiPrice, {
                          fromWei: true,
                          prefix: 'ETHER',
                          decimals: 2,
                        })}
                      </Text>
                      <Tooltip
                        tooltip={'How do we price NFTs?'}
                        sx={{ marginLeft: '0', height: 18 }}
                      >
                        <Icon
                          icon="upshot"
                          onClick={toggleHelpModal}
                          size={18}
                          color="primary"
                        />
                      </Tooltip>
                    </Flex>
                  )}
                  <Flex sx={{ height: 20 }}>
                    <a
                      href={`https://opensea.io/assets/${id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Tooltip
                        tooltip={'View on OpenSea'}
                        sx={{ color: theme.colors.white }}
                      >
                        <Icon
                          icon="openSeaBlock"
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                      </Tooltip>
                    </a>
                    {ART_BLOCKS_CONTRACTS.includes(contractAddress) && (
                      <a
                        href={`https://generator.artblocks.io/${id}`}
                        target="_blank"
                        sx={{ marginLeft: '13px' }}
                        rel="noreferrer"
                      >
                        <Icon
                          icon="openLink"
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                      </a>
                    )}
                    {contractAddress ===
                      '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB' && (
                      <a
                        href={`https://www.larvalabs.com/cryptopunks/details/${tokenId}`}
                        target="_blank"
                        sx={{ marginLeft: '13px' }}
                        rel="noreferrer"
                      >
                        <Icon
                          icon="openLink"
                          color="primary"
                          sx={{ width: 20, height: 20 }}
                        />
                      </a>
                    )}
                  </Flex>
                </Flex>
              </>
            </Flex>
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            {listPrice &&
              listPriceUsd &&
              listMarketplace &&
              listUrl &&
              listAppraisalRatio && (
                <BuyNowPanel
                  variant="wide"
                  listPriceETH={Number(
                    parseFloat(ethers.utils.formatEther(listPrice)).toFixed(2)
                  )}
                  sx={{ width: '100%' }}
                  listPriceUSD={parseUint256(listPriceUsd, 6, 2)}
                  listAppraisalPercentage={listAppraisalRatio}
                  marketplaceName={
                    listUrl.includes('larvalabs.com')
                      ? 'Larva Labs'
                      : listMarketplace
                  }
                  marketplaceUrl={listUrl}
                  linkComponent={NextLink}
                />
              )}
            <Flex
              sx={{
                gap: 4,
                flexDirection: ['column', 'column', 'column', 'column', 'row'],
              }}
            >
              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                <Panel sx={{ flexGrow: 1 }}>
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Text variant="h3Secondary">General Info</Text>

                    <Flex sx={{ gap: 4 }}>
                      <Flex sx={{ gap: [1, 1, 4], alignItems: 'center' }}>
                        <Link
                          href={`/analytics/collection/${collection?.id}`}
                          component={NextLink}
                        >
                          <Image
                            src={
                              collection?.imageUrl ?? '/img/defaultAvatar.png'
                            }
                            alt={`Collection cover: ${
                              collection?.name ?? 'Unknown'
                            }}`}
                            width={32}
                            sx={{
                              borderRadius: 'circle',
                              height: 32,
                              width: 32,
                              cursor: 'pointer',
                              minWidth: 'auto',
                            }}
                          />
                        </Link>
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            color="grey-500"
                            sx={{ lineHeight: 1.25, fontSize: 2 }}
                          >
                            Collection
                          </Text>
                          <Link
                            href={`/analytics/collection/${collection?.id}`}
                            sx={{
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                            title={collection?.name}
                            component={NextLink}
                          >
                            <Text
                              color="grey-300"
                              sx={{
                                fontWeight: 'bold',
                                lineHeight: 1.25,
                                fontSize: [3, 3, 4],
                              }}
                              title={collection?.name}
                            >
                              {collection?.name}
                            </Text>
                          </Link>
                        </Flex>
                      </Flex>

                      <Flex sx={{ gap: [1, 1, 4], alignItems: 'center' }}>
                        <Image
                          src={
                            txHistory?.[0]?.txToAddress
                              ? makeBlockie(txHistory[0].txToAddress)
                              : '/img/defaultAvatar.png'
                          }
                          alt="Creator avatar"
                          sx={{
                            borderRadius: 'circle',
                            height: 32,
                            width: 32,
                            minWidth: 'auto',
                          }}
                        />
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            color="grey-500"
                            sx={{ lineHeight: 1.25, fontSize: 2 }}
                          >
                            Owned By
                          </Text>
                          <Grid
                            columns={['auto 13px']}
                            sx={{ gap: 1, alignItems: 'center', width: '100%' }}
                          >
                            <Link
                              href={`/analytics/user/${txHistory?.[0]?.txToAddress}`}
                              sx={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                              title={displayName}
                              component={NextLink}
                            >
                              <Text
                                color="grey-300"
                                sx={{
                                  fontWeight: 'bold',
                                  lineHeight: 1.25,
                                  fontSize: [3, 3, 4],
                                }}
                              >
                                {displayName}
                              </Text>
                            </Link>
                            <Icon
                              icon="copy"
                              color="grey-300"
                              size="13"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  txHistory?.[0]?.txToAddress
                                )
                              }}
                            />
                          </Grid>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Panel>
                <Panel sx={{ flexGrow: 1 }}>
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Text variant="h3Secondary">Attributes</Text>
                    <Grid columns={isMobile ? 1 : 2}>
                      {pageTraits.map(
                        ({ id, traitType, value, rarity }, idx) => (
                          <Box key={idx}>
                            <Link
                              href={`/analytics/search?traits=${id}&collectionId=${
                                collection?.id
                              }&collectionName=${encodeURIComponent(
                                collection?.name ?? ''
                              )}`}
                              key={idx}
                              sx={{
                                whiteSpace: 'normal',
                                lineHeight: 'auto',
                              }}
                              component={NextLink}
                              noHover
                            >
                              <LabelAttribute
                                expanded={true}
                                expandedText={traitType ? traitType : 'Trait'}
                                variant="percentage"
                                percentage={(100 - rarity * 100)
                                  .toFixed(2)
                                  .toString()}
                                hasHover
                              >
                                {value}
                              </LabelAttribute>
                            </Link>
                          </Box>
                        )
                      )}
                    </Grid>
                    {Math.ceil(traits.length / TRAIT_PAGE_SIZE) > 1 && (
                      <Flex
                        sx={{ justifyContent: 'center', marginTop: '10px' }}
                      >
                        <Pagination
                          forcePage={traitPage}
                          pageCount={Math.ceil(traits.length / TRAIT_PAGE_SIZE)}
                          pageRangeDisplayed={0}
                          marginPagesDisplayed={0}
                          onPageChange={handlePageChange}
                        />
                      </Flex>
                    )}
                  </Flex>
                </Panel>
              </Flex>
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: 4,
                  flexGrow: 1,
                  minWidth: '50%',
                }}
              >
                <Panel
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    padding: '0!important',
                    overflow: 'hidden',
                  }}
                >
                  <Flex sx={{ flexDirection: 'column', flexGrow: 1 }}>
                    <Flex sx={{ padding: '20px', paddingBottom: 0 }}>
                      <Text variant="h3Secondary">Pricing History</Text>
                    </Flex>
                    {warningBanner &&
                      !isFloor &&
                      collection?.name !== 'CryptoPunks' && (
                        <Text
                          backgroundColor={'primary'}
                          color="black"
                          sx={{
                            marginX: '20px',
                            marginTop: '20px',
                            padding: '10px',
                            borderRadius: '10px',
                            fontWeight: 600,
                          }}
                        >
                          This is a valuable item. Our top-tier appraisals are
                          under active development.
                        </Text>
                      )}
                    <Flex sx={{ gap: '40px', flexGrow: 1, padding: '20px' }}>
                      {appraisalHistory?.length > 0 && (
                        <Flex sx={{ flexDirection: 'column' }}>
                          <Flex sx={{ gap: 4 }}>
                            <Text
                              color={isFloor ? 'pink' : 'blue'}
                              variant="h3Primary"
                              sx={{ fontWeight: 'heading', fontSize: 4 }}
                            >
                              {isFloor ? 'Floor Price' : 'Last Appraisal'}
                            </Text>
                          </Flex>
                          <Flex sx={{ gap: 2 }}>
                            <Label
                              color={isFloor ? 'pink' : 'blue'}
                              currencySymbol="Ξ"
                              variant="currency"
                              size="lg"
                              sx={{ lineHeight: 1 }}
                            >
                              {isFloor
                                ? formatNumber(
                                    appraisalHistory[
                                      appraisalHistory.length - 1
                                    ].estimatedPrice,
                                    { fromWei: true, decimals: 2 }
                                  )
                                : lastAppraisalWeiPrice
                                ? formatNumber(lastAppraisalWeiPrice, {
                                    fromWei: true,
                                    decimals: 2,
                                  })
                                : '-'}
                            </Label>

                            {!!latestAppraisal?.medianRelativeError && (
                              <Label
                                color="primary"
                                sx={{ marginTop: '.5rem' }}
                              >
                                {'±' +
                                  (
                                    latestAppraisal.medianRelativeError * 100
                                  ).toFixed(2) +
                                  '%'}
                              </Label>
                            )}
                          </Flex>
                          {!!lastAppraisalUsdPrice &&
                            !Number.isNaN(
                              parseFloat(lastAppraisalUsdPrice)
                            ) && (
                              <Label
                                color="white"
                                currencySymbol="$"
                                variant="currency"
                                size="md"
                                sx={{
                                  marginTop: '-.5rem',
                                }}
                              >
                                {formatNumber(lastAppraisalUsdPrice, {
                                  fromWei: true,
                                  fromDecimals: 6,
                                  decimals: 2,
                                })}
                              </Label>
                            )}
                          <Text
                            color={isFloor ? 'pink' : 'blue'}
                            sx={{ fontSize: 2, textTransform: 'uppercase' }}
                          >
                            {isFloor
                              ? format(
                                  appraisalHistory[appraisalHistory.length - 1]
                                    .timestamp * 1000,
                                  'LLL dd yyyy hh:mm'
                                )
                              : lastAppraisalAt
                              ? format(
                                  lastAppraisalAt * 1000,
                                  'LLL dd yyyy hh:mm'
                                )
                              : '-'}
                          </Text>
                        </Flex>
                      )}
                    </Flex>

                    {!appraisalHistory?.length && (
                      <Flex sx={{ padding: '20px', flexGrow: 1 }}>
                        <Text color="grey-500" sx={{ fontSize: 2 }}>
                          No sales data available.
                        </Text>
                      </Flex>
                    )}
                    <Chart data={chartData} linkComponent={NextLink} embedded />
                  </Flex>
                </Panel>
              </Flex>
            </Flex>
            <Panel>
              <Box
                sx={{
                  overflow: 'auto',
                  flexGrow: 1,
                  resize: 'none',
                  maxHeight: 300,
                  '&::-webkit-scrollbar-corner': {
                    backgroundColor: 'transparent',
                  },
                }}
                css={theme.scroll.thin}
              >
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Flex
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text variant="h3Secondary">Transaction History</Text>
                  </Flex>
                  {txHistory && txHistory.length > 0 && (
                    <Table sx={{ borderSpacing: '0 10px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell color="grey-500">Date</TableCell>
                          {!isMobile && (
                            <>
                              <TableCell color="grey-500">Sender</TableCell>
                              <TableCell color="grey-500">Recipient</TableCell>
                            </>
                          )}

                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              zIndex: 2,
                            }}
                            backgroundColor="grey-800"
                            color="grey-500"
                          >
                            Sale Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {txHistory.map(
                          (
                            {
                              type,
                              txAt,
                              txFromAddress,
                              txToAddress,
                              txHash,
                              txToUser,
                              txFromUser,
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
                                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
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
                                        component={NextLink}
                                      >
                                        <Text>
                                          {extractEns(
                                            txFromUser?.addresses,
                                            txFromAddress
                                          ) ??
                                            shortenAddress(txFromAddress, 2, 4)}
                                        </Text>
                                      </Link>
                                    </Flex>
                                  </TableCell>
                                  <TableCell sx={{ minWidth: 140 }}>
                                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
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
                                        component={NextLink}
                                      >
                                        <Text>
                                          {extractEns(
                                            txToUser?.addresses,
                                            txToAddress
                                          ) ??
                                            shortenAddress(txToAddress, 2, 4)}
                                        </Text>
                                      </Link>
                                    </Flex>
                                  </TableCell>
                                </>
                              )}
                              <TableCell
                                sx={{
                                  minWidth: [100, 100, 100, 180],
                                  color: 'pink',
                                }}
                              >
                                {'SALE' === type &&
                                  price &&
                                  formatNumber(price, {
                                    fromWei: true,
                                    decimals: 2,
                                    prefix: 'ETHER',
                                  })}
                                {'TRANSFER' === type && (
                                  <Text color="blue">Transfer</Text>
                                )}
                                {'MINT' === type && (
                                  <Text color="green">Mint</Text>
                                )}
                                <Link
                                  href={`https://etherscan.io/tx/${txHash}`}
                                  target="_blank"
                                  title="Open transaction on Etherscan"
                                  rel="noopener noreferrer nofollow"
                                  component={NextLink}
                                >
                                  <IconButton>
                                    <Icon icon="disconnect" color="grey-500" />
                                  </IconButton>
                                </Link>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  )}
                  {!txHistory ||
                    (txHistory.length == 0 && (
                      <Text sx={{ color: 'grey-500' }}>
                        This asset hasn’t been sold or transferred yet.
                      </Text>
                    ))}
                </Flex>
              </Box>
            </Panel>
            <Panel>
              <Flex sx={{ flexDirection: 'column', gap: 16 }}>
                <Text variant="h3Secondary">Owner History</Text>
                <Collectors
                  assetId={id}
                  name={collection?.name}
                  id={collection?.id}
                />
              </Flex>
            </Panel>
          </Flex>
        </Grid>
      </Layout>
    </>
  )
}
