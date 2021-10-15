/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer, Grid, Image, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  Chart,
  Label,
  LabelAttribute,
  Panel,
} from '@upshot-tech/upshot-ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import { format } from 'date-fns'
import { ethers } from 'ethers'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { getPriceChangeColor } from 'utils/color'
import { weiToEth } from 'utils/number'

import { GET_ASSET, GetAssetData, GetAssetVars } from './queries'

function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}

export default function NFTView() {
  const [id, setId] = useState('')
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()

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
    rarity,
    previewImageUrl,
    mediaUrl,
    collection,
    tokenId,
    priceChangeFromFirstSale,
    firstSale,
    traits,
    lastSale,
    latestAppraisal,
    avgResalePrice,
    txHistory,
    appraisalHistory,
    creatorAvatar,
    creatorAddress,
    creatorUsername,
    contractAddress,
  } = data.assetById

  const salesSeries = txHistory
    .filter(({ ethSalePrice }) => ethSalePrice)
    .map(({ assetEvent, ethSalePrice }) => [
      assetEvent?.txAt,
      parseFloat(ethers.utils.formatEther(ethSalePrice)),
    ])

  // Temporarily reversed here, but should be done
  // on the backend and removed here ASAP to support
  // pagination.
  const reversedTxHistory = [...txHistory].reverse()

  const appraisalSeries = appraisalHistory.map(
    ({ timestamp, estimatedPrice }) => [
      timestamp,
      estimatedPrice
        ? parseFloat(ethers.utils.formatEther(estimatedPrice))
        : null,
    ]
  )

  const chartData = [
    { name: 'Appraisals', data: appraisalSeries },
    { name: 'Sales', data: salesSeries },
  ]

  const assetName = getAssetName(name, collection?.name, tokenId)

  return (
    <>
      <Head>
        <title>Upshot Analytics</title>
      </Head>
      <Layout>
        <Grid
          columns={[1, 1, 1, 3]}
          sx={{
            gridTemplateColumns: ['1fr', '1fr', '1fr 3fr'],
            flexGrow: 1,
          }}
        >
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <Image
              src={previewImageUrl ?? mediaUrl}
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
              {!!rarity && (
                <Label size="md">
                  {(rarity * 100).toFixed(2) + '% Rarity'}
                </Label>
              )}
            </Flex>

            <Link href={`/analytics/collection/${collection?.id}`}>
              <a
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Flex sx={{ gap: 4, alignItems: 'center' }}>
                  <Image
                    src={collection?.imageUrl ?? '/img/defaultAvatar.png'}
                    alt={`Collection cover: ${collection?.name}`}
                    width={32}
                    sx={{ borderRadius: 'circle', height: 32, width: 32 }}
                  />
                  <Flex
                    sx={{ flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <Text
                      color="grey-500"
                      sx={{ lineHeight: 1.25, fontSize: 2 }}
                    >
                      Collection
                    </Text>
                    <Text
                      color="grey-300"
                      sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: 4 }}
                    >
                      {collection?.name ?? 'Unknown'}
                    </Text>
                  </Flex>
                </Flex>
              </a>
            </Link>
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <Flex
              sx={{
                gap: 4,
                flexDirection: ['column', 'column', 'column', 'row'],
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
                          passHref
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
                            passHref
                          >
                            <Text
                              as="a"
                              color="grey-300"
                              sx={{
                                fontWeight: 'bold',
                                lineHeight: 1.25,
                                fontSize: [3, 3, 4],
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {collection?.name}
                            </Text>
                          </Link>
                        </Flex>
                      </Flex>

                      <Flex sx={{ gap: [1, 1, 4], alignItems: 'center' }}>
                        <Image
                          src={creatorAvatar ?? '/img/defaultAvatar.png'}
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
                            Created By
                          </Text>
                          <Text
                            color="grey-300"
                            sx={{
                              fontWeight: 'bold',
                              lineHeight: 1.25,
                              fontSize: [3, 3, 4],
                            }}
                          >
                            {creatorUsername ??
                              shortenAddress(creatorAddress) ??
                              '/img/defaultAvatar.png'}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Panel>
                <Panel sx={{ flexGrow: 1 }}>
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Text variant="h3Secondary">Statistics</Text>
                    <Box>
                      <Table
                        sx={{
                          borderSpacing: '32px 8px',
                          marginTop: '-8px',
                          marginLeft: '-32px',
                          width: 'auto',
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Text color="grey-500" sx={{ fontSize: 2 }}>
                                Price Change
                                <br />
                                from Primary Market
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text color="grey-500" sx={{ fontSize: 2 }}>
                                Original Primary
                                <br />
                                Market Price
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text color="grey-500" sx={{ fontSize: 3 }}>
                                Average
                                <br />
                                Resale Price
                              </Text>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderSpacing: '8px' }}>
                          <TableRow>
                            <TableCell>
                              <Text
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: 5,
                                  color: getPriceChangeColor(
                                    priceChangeFromFirstSale ?? 0
                                  ),
                                }}
                              >
                                {priceChangeFromFirstSale
                                  ? priceChangeFromFirstSale.toFixed(0) + '%'
                                  : '-'}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                                {firstSale?.estimatedPrice
                                  ? weiToEth(firstSale?.estimatedPrice)
                                  : '-'}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                                {avgResalePrice
                                  ? weiToEth(avgResalePrice)
                                  : '-'}
                              </Text>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>

                    <Text variant="h3Secondary">Attributes</Text>
                    <Grid columns={isMobile ? 1 : 2}>
                      {traits.map(({ value, rarity }, idx) => (
                        <Link
                          href={`/analytics/search?attributes=${value}&collection=${collection?.name}`}
                          key={idx}
                        >
                          <a
                            sx={{
                              textDecoration: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <LabelAttribute
                              variant="percentage"
                              percentage={(100 - rarity * 100)
                                .toFixed(2)
                                .toString()}
                            >
                              {value}
                            </LabelAttribute>
                          </a>
                        </Link>
                      ))}
                    </Grid>
                  </Flex>
                </Panel>
              </Flex>
              <Flex sx={{ flexDirection: 'column', gap: 4, flexGrow: 1 }}>
                <Panel
                  sx={{ flexGrow: 1, display: 'flex', padding: '0!important' }}
                >
                  <Flex sx={{ flexDirection: 'column', flexGrow: 1 }}>
                    <Flex sx={{ padding: '20px', paddingBottom: 0 }}>
                      <Text variant="h3Secondary">Pricing History</Text>
                    </Flex>
                    {(!!lastSale || !!latestAppraisal) && (
                      <Flex sx={{ gap: '40px', flexGrow: 1, padding: '20px' }}>
                        {!!lastSale && (
                          <Flex sx={{ flexDirection: 'column' }}>
                            <Text
                              color="pink"
                              variant="h3Primary"
                              sx={{ fontWeight: 'heading', fontSize: 4 }}
                            >
                              Last Sale
                            </Text>
                            <Label
                              color="pink"
                              currencySymbol={lastSale ? 'Ξ' : undefined}
                              variant="currency"
                              size="md"
                            >
                              {lastSale?.ethSalePrice
                                ? weiToEth(lastSale.ethSalePrice, 3, false)
                                : '-'}
                            </Label>

                            <Text
                              color="pink"
                              sx={{ fontSize: 2, textTransform: 'uppercase' }}
                            >
                              {lastSale?.timestamp
                                ? format(
                                    lastSale.timestamp * 1000,
                                    'LLL dd yyyy hh:mm'
                                  )
                                : '-'}
                            </Text>
                          </Flex>
                        )}
                        {!!latestAppraisal && (
                          <Flex sx={{ flexDirection: 'column' }}>
                            <Flex sx={{ gap: 4 }}>
                              <Text
                                color="primary"
                                variant="h3Primary"
                                sx={{ fontWeight: 'heading', fontSize: 4 }}
                              >
                                Last Appraisal
                              </Text>

                              <Label color="primary">
                                {latestAppraisal.confidence
                                  ? (latestAppraisal.confidence * 100).toFixed(
                                      2
                                    ) + '%'
                                  : '-'}
                              </Label>
                            </Flex>
                            <Label
                              color="primary"
                              currencySymbol={lastSale ? 'Ξ' : undefined}
                              variant="currency"
                              size="md"
                            >
                              {latestAppraisal?.ethSalePrice
                                ? weiToEth(
                                    latestAppraisal.ethSalePrice,
                                    3,
                                    false
                                  )
                                : '-'}
                            </Label>
                            <Text
                              color="primary"
                              sx={{ fontSize: 2, textTransform: 'uppercase' }}
                            >
                              {latestAppraisal?.timestamp
                                ? format(
                                    latestAppraisal.timestamp * 1000,
                                    'LLL dd yyyy hh:mm'
                                  )
                                : '-'}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    )}

                    {!lastSale && !latestAppraisal && (
                      <Flex sx={{ padding: '20px', flexGrow: 1 }}>
                        <Text color="grey-500" sx={{ fontSize: 2 }}>
                          No sales data available.
                        </Text>
                      </Flex>
                    )}
                    <Chart data={chartData} embedded />
                  </Flex>
                </Panel>
              </Flex>
            </Flex>
            <Panel>
              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Flex
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text variant="h3Secondary">Transaction History</Text>
                  </Flex>
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

                        <TableCell color="grey-500">Sale Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reversedTxHistory
                        .filter(({ assetEvent }) => !!assetEvent?.txAt)
                        .map(({ assetEvent, ethSalePrice }, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ width: '100%' }}>
                              {format(assetEvent.txAt * 1000, 'M/d/yyyy')}
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
                                    <Text>
                                      {assetEvent?.txFromAddress
                                        ? shortenAddress(
                                            assetEvent.txFromAddress,
                                            2,
                                            4
                                          )
                                        : '-'}
                                    </Text>
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
                                    <Text>
                                      {assetEvent?.txToAddress
                                        ? shortenAddress(
                                            assetEvent.txToAddress,
                                            2,
                                            4
                                          )
                                        : '-'}
                                    </Text>
                                  </Flex>
                                </TableCell>
                              </>
                            )}
                            <TableCell sx={{ minWidth: 100, color: 'pink' }}>
                              {ethSalePrice ? weiToEth(ethSalePrice) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Flex>
              </Flex>
            </Panel>
          </Flex>
        </Grid>
      </Layout>
    </>
  )
}
