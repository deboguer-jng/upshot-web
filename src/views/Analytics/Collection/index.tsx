import { useQuery } from '@apollo/client'
import { theme, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Chart, Container, Flex, Grid, Label } from '@upshot-tech/upshot-ui'
import { Avatar, Text } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { weiToEth } from 'utils/number'
import CollectionScatterChart from 'views/Analytics/components/CollectionScatterChart'
import ExplorePanel from 'views/Analytics/components/ExplorePanel'
import TopSellingNFTs from 'views/Analytics/components/TopSellingNFTs'

import Breadcrumbs from '../components/Breadcrumbs'
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
        padding: '8px 16px',
        textAlign: 'center',
        color,
      }}
    >
      {currencySymbol !== '' && (
        <Label
          currencySymbol={currencySymbol}
          variant="currency"
          color={color}
          style={{
            fontWeight: 700,
          }}
        >
          {value}
        </Label>
      )}
      {currencySymbol === '' && value}

      <Text variant="small">{label}</Text>
    </Flex>
  )
}

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
        <title>Upshot Analytics</title>
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
        constrain={1}
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />
        {children}
        <Footer />
      </Container>
    </>
  )
}

export default function CollectionView() {
  const [id, setId] = useState<number>()
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()

  useEffect(() => {
    /* Parse assetId from router */
    const id = router.query.id

    setId(Number(id))
  }, [router.query])

  const { loading, data } = useQuery<GetCollectionData, GetCollectionVars>(
    GET_COLLECTION,
    {
      errorPolicy: 'all',
      variables: { id: Number(id) },
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

  /* Error state. */
  // if (error)
  //   return (
  //     <Layout>
  //       <Container sx={{ justifyContent: 'center', flexGrow: 1 }}>
  //         Error loading collection.
  //       </Container>
  //     </Layout>
  //   )

  /* No results state. */
  if (!data?.collectionById)
    return (
      <Layout>
        <Container sx={{ justifyContent: 'center' }}>
          Unable to load collection.
        </Container>
      </Layout>
    )

  const {
    name,
    description,
    imageUrl,
    floor,
    size,
    average,
    totalVolume,
    volume,
    marketCap,
    sevenDayFloorChange,
    numCollectors,
    timeSeries,
  } = data.collectionById

  const priceSeries =
    timeSeries?.map(({ timestamp, average }) => [
      timestamp * 1000,
      parseFloat(ethers.utils.formatEther(average ?? 0)),
    ]) ?? []

  // const chartData = [{ name: 'Average', data: priceSeries }]

  // const getChart = () => {
  //   if (!priceSeries.length) return <Chart noData />
  //   return <Chart embedded data={chartData} />
  // }

  return (
    <Layout>
      <Grid columns={['1fr', '1fr', '1fr 1fr']} sx={{ gap: '40px' }}>
        <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
          <Flex sx={{ gap: 6, height: 100, alignItems: 'center' }}>
            <Avatar size="xl" src={imageUrl} />
            <Flex sx={{ flexDirection: 'column' }}>
              <Text variant="h1Secondary" sx={{ lineHeight: '2rem' }}>
                {name}
              </Text>
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
          <Grid columns="repeat(auto-fit, minmax(120px, 1fr))" sx={{ gap: 4 }}>
            <CollectionStat
              color="blue"
              value={average ? weiToEth(average, 4, false) : '-'}
              currencySymbol="Ξ"
              label="Average Price"
            />
            <CollectionStat
              color="pink"
              value={floor ? weiToEth(floor, 4, false) : '-'}
              currencySymbol="Ξ"
              label="Floor Price"
            />
            <CollectionStat
              color={
                sevenDayFloorChange
                  ? sevenDayFloorChange > 0
                    ? 'green'
                    : 'red'
                  : 'white'
              }
              value={
                sevenDayFloorChange
                  ? sevenDayFloorChange > 0
                    ? '+' + sevenDayFloorChange.toFixed(2) + '%'
                    : sevenDayFloorChange.toFixed(2) + '%'
                  : '-'
              }
              label="7 Day Floor Change"
            />
            <CollectionStat
              value={marketCap ? weiToEth(marketCap, 4, false) : '-'}
              currencySymbol="Ξ"
              label="Market Cap"
            />
            <CollectionStat
              value={volume ? weiToEth(volume, 4, false) : '-'}
              currencySymbol="Ξ"
              label="Wkly Volume"
            />
            <CollectionStat value={size} label="NFTs in Collection" />
            {/* <CollectionStat
              value={numCollectors ? numCollectors.toString() : '-'}
              label="Collectors"
            /> */}
          </Grid>
        </Flex>
        <Flex sx={{ flexDirection: 'column', paddingTop: isMobile ? 0 : 116 }}>
          <Text variant="large" sx={{ textTransform: 'uppercase' }}>
            About
          </Text>
          <Text
            color="grey-300"
            onClick={() => {
              setDescriptionOpen(!descriptionOpen)
            }}
            sx={{
              lineHeight: 1.4,
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: descriptionOpen ? 'auto' : '150px',
              WebkitLineClamp: !descriptionOpen ? 6 : 'none',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              '& a': { color: 'white' },
            }}
          >
            {(
              <ReactMarkdown allowedElements={['a', 'p']}>
                {description}
              </ReactMarkdown>
            ) ?? 'No information.'}
          </Text>
        </Flex>
      </Grid>
      <Text
        variant="large"
        sx={{ textTransform: 'uppercase', fontWeight: 400, marginTop: '20px' }}
      >
        {name}
      </Text>
      <Text
        variant="h2Primary"
        sx={{ textTransform: 'uppercase', fontWeight: 400, marginTop: '-15px' }}
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

      <ExplorePanel collectionId={id} collectionName={name} />
    </Layout>
  )
}
