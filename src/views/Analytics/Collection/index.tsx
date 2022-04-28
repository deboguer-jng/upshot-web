/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  imageOptimizer,
  Link,
  theme,
  Tooltip,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { Container, Flex, Grid } from '@upshot-tech/upshot-ui'
import {
  Avatar,
  Button,
  formatNumber,
  Icon,
  Text,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'
import { Box } from 'theme-ui'
import CollectionScatterChart from 'views/Analytics/components/CollectionScatterChart'
import ExplorePanel from 'views/Analytics/components/ExplorePanel'
import TopSellingNFTs from 'views/Analytics/components/TopSellingNFTs'

import Breadcrumbs from '../components/Breadcrumbs'
import { DescriptionWrapper } from '../components/Styled'
import { GET_COLLECTION, GetCollectionData, GetCollectionVars } from './queries'

interface CollectionStatProps {
  value: string
  label: string
  color?: keyof typeof theme.colors
  currencySymbol?: string
}

function CollectionStat({
  value,
  label,
  color = 'grey-300',
  currencySymbol = '',
}: CollectionStatProps) {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        bg: 'grey-800',
        borderRadius: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '80px',
        color,
        gap: 1,
      }}
    >
      <Text sx={{ fontSize: 5, fontWeight: 'heading' }}>
        {currencySymbol === '' && value}
      </Text>

      <Text sx={{ fontSize: 2, lineHeight: 1 }}>{label}</Text>
    </Flex>
  )
}

function Layout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
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
    : !prevPath?.includes('/nft/')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
      ]
    : [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('nftName=')[1],
          link: prevPath,
        },
      ]

  return (
    <>
      <Head>
        <title>{title ? title + ' | ' : ''}Upshot Analytics</title>
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
          content="https://upshot.io/img/opengraph/opengraph_collection.jpg"
        />
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

export default function CollectionView() {
  const dispatch = useAppDispatch()
  const [id, setId] = useState<number>()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const router = useRouter()

  useEffect(() => {
    /* Parse assetId from router */
    const id = router.query.id
    if (!id) return

    setId(Number(id))
  }, [router.query])

  const { loading, data } = useQuery<GetCollectionData, GetCollectionVars>(
    GET_COLLECTION,
    {
      errorPolicy: 'all',
      variables: { id },
      skip: !id,
    }
  )

  useEffect(() => {
    if (data?.collectionById && data?.collectionById.name) {
      const storage = globalThis?.sessionStorage
      const curPath = storage.getItem('currentPath')
      if (curPath?.indexOf('collectionName=') === -1)
        storage.setItem(
          'currentPath',
          `${curPath}?collectionName=${data?.collectionById.name}`
        )
    }
  }, [data?.collectionById])

  /* Memoize scatter chart to avoid unnecessary updates. */
  const scatterChart = useMemo(
    () => (
      <CollectionScatterChart {...{ id }} name={data?.collectionById?.name} />
    ),
    [id, data]
  )

  /* Load state. */
  if (loading)
    return (
      <Layout>
        <Container
          sx={{
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          Loading...
        </Container>
      </Layout>
    )

  /* No results state. */
  if (!data?.collectionById)
    return (
      <Layout>
        <Container sx={{ justifyContent: 'center' }}>
          Unable to load collection.
        </Container>
      </Layout>
    )

  const { name, description, imageUrl, isAppraised, size, latestStats } =
    data.collectionById

  return (
    <Layout title={name}>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
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
                    imageOptimizer(imageUrl, {
                      width: parseInt(theme.images.avatar.xl.size),
                      height: parseInt(theme.images.avatar.xl.size),
                    }) ?? imageUrl
                  }
                />
              </Box>
              <Flex sx={{ flexDirection: 'column' }}>
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <Text variant="h1Secondary" sx={{ lineHeight: '2rem' }}>
                    {name}
                  </Text>
                  {isAppraised && (
                    <Tooltip
                      tooltip={'How do we price NFTs?'}
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

                <Text
                  color="grey"
                  variant="h4Primary"
                  sx={{
                    fontWeight: 700,
                    marginTop: '2px',
                  }}
                >
                  Collection
                </Text>
              </Flex>
            </Flex>
            <Text
              variant="large"
              sx={{ textTransform: 'uppercase', fontWeight: 400 }}
            >
              General Stats
            </Text>
            <Grid
              columns="repeat(auto-fit, minmax(140px, 1fr))"
              sx={{ gap: 4 }}
            >
              <CollectionStat
                color="blue"
                value={
                  latestStats?.average
                    ? formatNumber(latestStats.average, {
                        fromWei: true,
                        decimals: 2,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Average Price"
              />
              <CollectionStat
                color="pink"
                value={
                  latestStats?.floor
                    ? formatNumber(latestStats.floor, {
                        fromWei: true,
                        decimals: 2,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Floor Price"
              />
              <CollectionStat
                color={
                  data.collectionById.latestStats?.weekFloorChange
                    ? data.collectionById.latestStats?.weekFloorChange > 0
                      ? 'green'
                      : 'red'
                    : 'white'
                }
                value={
                  data.collectionById.latestStats?.weekFloorChange
                    ? data.collectionById.latestStats?.weekFloorChange > 0
                      ? '+' +
                        data.collectionById.latestStats?.weekFloorChange.toFixed(
                          2
                        ) +
                        '%'
                      : data.collectionById.latestStats?.weekFloorChange.toFixed(
                          2
                        ) + '%'
                    : '-'
                }
                label="7 Day Floor Change"
              />
              <CollectionStat
                value={
                  latestStats?.floorCap
                    ? formatNumber(latestStats.floorCap, {
                        fromWei: true,
                        decimals: 2,
                        kmbUnits: true,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Floor Cap"
              />
              <CollectionStat
                value={
                  latestStats?.pastWeekWeiVolume
                    ? formatNumber(latestStats.pastWeekWeiVolume, {
                        fromWei: true,
                        decimals: 2,
                        kmbUnits: true,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Weekly Volume"
              />
              <CollectionStat
                value={size ? formatNumber(size) : '-'}
                label="NFTs in Collection"
              />
            </Grid>
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
                href={`/analytics/search/?collectionId=${id}&collectionName=${encodeURIComponent(
                  data.collectionById.name
                )}`}
                sx={{
                  width: isMobile ? '100%' : 'auto',
                }}
                component={NextLink}
                noHover
              >
                <Button
                  icon={<Icon icon="search" />}
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
                  Search within collection
                </Button>
              </Link>
            </Flex>
            {description && (
              <Text variant="large" sx={{ textTransform: 'uppercase' }}>
                About
              </Text>
            )}
            <DescriptionWrapper color="grey-300">
              {(
                <ReactMarkdown allowedElements={['a', 'p']}>
                  {description}
                </ReactMarkdown>
              ) ?? 'No information.'}
            </DescriptionWrapper>
          </Flex>
        </Grid>
        <Text
          variant="large"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 400,
            marginTop: '20px',
          }}
        >
          {name}
        </Text>
        <Text
          variant="h2Primary"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 400,
            marginTop: '-15px',
          }}
        >
          sales this month
        </Text>
        {scatterChart}

        <Flex
          sx={{
            position: 'relative',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 5,
          }}
        >
          <TopSellingNFTs collectionId={id} />
        </Flex>

        <ExplorePanel
          collectionId={id}
          collectionName={name}
          {...{ isAppraised }}
        />
      </Flex>
    </Layout>
  )
}
