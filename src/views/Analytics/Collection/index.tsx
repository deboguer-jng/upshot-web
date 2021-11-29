import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Chart, Container, Flex, Grid } from '@upshot-tech/upshot-ui'
import { Avatar, Footer, Text } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { weiToEth } from 'utils/number'
import CollectionScatterChart from 'views/Analytics/components/CollectionScatterChart'
import ExplorePanel from 'views/Analytics/components/ExplorePanel'
import TopSellingNFTs from 'views/Analytics/components/TopSellingNFTs'

import Breadcrumbs from '../components/Breadcrumbs'
import { GET_COLLECTION, GetCollectionData, GetCollectionVars } from './queries'

interface CollectionStatProps {
  value: string
  label: string
  color?: string
}

function CollectionStat({
  value,
  label,
  color = 'grey-300',
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
      <Text
        sx={{
          fontWeight: 700,
          fontSize: ['0.85rem', '0.85rem', '1rem', '1rem'],
        }}
      >
        {value}
      </Text>
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
    ceil,
    size,
    average,
    totalVolume,
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
      <Grid columns={isMobile ? '1fr' : '1fr 1fr'} sx={{ gap: '40px' }}>
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
          <Grid columns="repeat(auto-fit, minmax(100px, 1fr))" sx={{ gap: 4 }}>
            <CollectionStat
              color="blue"
              value={average ? weiToEth(average) : '-'}
              label="Avg. NFT Value"
            />
            <CollectionStat
              color="pink"
              value={ceil ? weiToEth(ceil) : '-'}
              label="Highest Listing"
            />
            <CollectionStat
              value={totalVolume ? weiToEth(totalVolume) : '-'}
              label="Total Volume"
            />
            <CollectionStat value={size} label="NFTs in Collection" />
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
              WebkitLineClamp: descriptionOpen ? 'unset' : 6,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description ?? 'No information.'}
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

      <Flex sx={{ flexDirection: 'column', flexGrow: 1, gap: 5 }}>
        <TopSellingNFTs collectionId={id} />
      </Flex>

      <ExplorePanel collectionId={id} collectionName={name} />
    </Layout>
  )
}
