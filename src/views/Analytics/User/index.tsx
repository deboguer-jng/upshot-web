import { useQuery } from '@apollo/client'
import { Container } from '@upshot-tech/upshot-ui'
import { Avatar, Flex, Footer, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  CollectionCard,
  CollectionRow,
  CollectionTable,
  Icon,
  IconButton,
  RadarChart,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { FormattedENS } from 'components/FormattedENS'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import { format, formatDistance } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { ethers } from 'ethers'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchEns, shortenAddress } from 'utils/address'
import { formatCurrencyUnits, formatLargeNumber } from 'utils/number'

import { GET_COLLECTOR, GetCollectorData, GetCollectorVars } from './queries'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Upshot Analytics: User Profile</title>
      </Head>
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
        <Nav />
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

    updateEns()
  }, [address])

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
  const address = router.query.address as string
  let addressFormatted

  try {
    addressFormatted = ethers.utils.getAddress(address)
  } catch (err) {
    console.error(err)
  }

  const { loading, error, data } = useQuery<GetCollectorData, GetCollectorVars>(
    GET_COLLECTOR,
    {
      errorPolicy: 'all',
      variables: {
        address: addressFormatted,
        collectionLimit: 100,
        collectionOffset: 0,
        assetLimit: 5,
        assetOffset: 0,
        txLimit: 100,
        txOffset: 0,
      },
      skip: !addressFormatted,
    }
  )

  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const distributionTable = (
    <Panel sx={{ flexGrow: 1 }}>
      <Text variant="h3Secondary">Collection Distribution</Text>
      <CollectionTable>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell color="grey-500">Collection</TableCell>
            <TableCell color="grey-500">NFT Count</TableCell>
            <TableCell color="grey-500">% of Collection</TableCell>
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
                <TableCell>{collection.name}</TableCell>
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
      <Text variant="h3Secondary">Collection Distribution</Text>
      <Flex
        sx={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', marginBottom: '-2rem' }}>
          <RadarChart
            data={{
              series: [
                {
                  name: 'Portfolio Distribution',
                  data:
                    data?.getUser?.extraCollections?.collectionAssetCounts
                      ?.slice(0, 5)
                      ?.map(({ count }) =>
                        Math.floor(
                          (count / data.getUser.extraCollections.count) * 100
                        )
                      ) ?? [],
                },
              ],
              labels:
                data?.getUser?.extraCollections?.collectionAssetCounts
                  ?.slice(0, 5)
                  ?.map(({ collection }) => collection.name) ?? [],
            }}
          />
        </Box>
      </Flex>
    </Panel>
  )

  return (
    <Layout>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        {!!address && <Header {...{ address }} />}
        {/* User Description */}
        <Text color="grey-400">{data?.getUser?.bio}</Text>
        <Grid gap={4} columns={[1, 1, 1, 2]}>
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <Grid gap={2} columns={[1, 2, 3]}>
              <Panel
                sx={{
                  display: 'flex',
                  borderRadius: '20px',
                  flexDirection: 'column',
                  justifyContent: 'center',
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
                    {data?.getUser?.totalAssetAppraisedValueUsd ? '$' : ''}
                  </Text>
                  <Text
                    color="blue"
                    sx={{ fontWeight: 'bold', fontSize: 4, lineHeight: 1 }}
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
                  {data?.getUser?.extraCollections?.count ?? 0}
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
                  Unique Collections
                </Text>
              </Panel>
              <Panel
                sx={{
                  display: 'flex',
                  borderRadius: '20px',
                  flexDirection: 'column',
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
                    ? format(data.getUser.mostRecentBuy.txAt * 1000, 'M/d/yyyy')
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
            </Grid>
            <Panel
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 340,
              }}
            >
              <Box sx={{ overflowY: 'auto' }} css={theme.scroll.thin}>
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Text variant="h3Secondary">Transaction History</Text>

                    {data?.getUser?.txHistory &&
                      data?.getUser?.txHistory.count > 0 && (
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
                                          sx={{ alignItems: 'center', gap: 2 }}
                                        >
                                          <Box
                                            sx={{
                                              borderRadius: 'circle',
                                              bg: 'yellow',
                                              width: 3,
                                              height: 3,
                                            }}
                                          />
                                          <FormattedENS
                                            address={txFromAddress}
                                          />
                                        </Flex>
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 140 }}>
                                        <Flex
                                          sx={{ alignItems: 'center', gap: 2 }}
                                        >
                                          <Box
                                            sx={{
                                              borderRadius: 'circle',
                                              bg: 'purple',
                                              width: 3,
                                              height: 3,
                                            }}
                                          />
                                          <FormattedENS address={txToAddress} />
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
                      )}
                    {data?.getUser?.txHistory.length == 0 && (
                      <Text sx={{ color: 'grey-500' }}>
                        No transaction history found.
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Panel>
          </Flex>
          {(data?.getUser?.extraCollections?.count ?? 0) < 3
            ? distributionTable
            : distributionRadar}
        </Grid>
        <Text variant="h1Primary">Collection</Text>
        <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" sx={{ gap: 4 }}>
          {data?.getUser?.extraCollections?.collectionAssetCounts?.map(
            ({ collection }, idx) => (
              <CollectionCard
                avatarImage={collection.imageUrl}
                total={collection.ownerAssetsInCollection.count}
                name={collection.name}
                key={idx}
              >
                {collection.ownerAssetsInCollection.assets.map(
                  ({ id, previewImageUrl, contractAddress }, idx) => (
                    <Link passHref href={`/analytics/nft/${id}`} key={idx}>
                      <Box
                        sx={{
                          width: '100%',
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
                  )
                )}
              </CollectionCard>
            )
          )}
        </Grid>
      </Flex>
    </Layout>
  )
}
