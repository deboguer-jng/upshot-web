import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Container, Flex, Grid } from '@upshot-tech/upshot-ui'
import { Avatar, Chart, Footer, Text } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { weiToEth } from 'utils/number'
import ExplorePanel from 'views/Landing/components/ExplorePanel'
import TopSellingNFTs from 'views/Landing/components/TopSellingNFTs'

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
      <Text sx={{ fontWeight: 700 }}>{value}</Text>
      <Text variant="small">{label}</Text>
    </Flex>
  )
}

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

export default function CollectionView() {
  const [id, setId] = useState<number>()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()

  useEffect(() => {
    /* Parse assetId from router */
    const id = router.query.id

    setId(Number(id))
  }, [router.query])

  const { loading, error, data } = useQuery<
    GetCollectionData,
    GetCollectionVars
  >(GET_COLLECTION, {
    errorPolicy: 'all',
    variables: { id: Number(id) },
    skip: !id,
  })
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
      timestamp,
      parseFloat(ethers.utils.formatEther(average ?? 0)),
    ]) ?? []

  const chartData = [{ name: 'Average', data: priceSeries }]

  const getChart = () => {
    if (!priceSeries.length) return <Chart noData />
    return <Chart embedded data={chartData} />
  }

  return (
    <Layout>
      <Grid columns={isMobile ? '1fr' : '1fr 1fr'} sx={{ gap: '40px' }}>
        <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
          <Flex sx={{ gap: 6, height: 100 }}>
            <Avatar size="lg" src={imageUrl} />
            <Flex sx={{ flexDirection: 'column' }}>
              <Text variant="h1Secondary">{name}</Text>
              <Text
                color="pink"
                variant="h4Primary"
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
              >
                Collection
              </Text>
            </Flex>
          </Flex>
          <Text variant="large" sx={{ textTransform: 'uppercase' }}>
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
              label="Most Valuable NFT"
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
          <Text color="grey-300" sx={{ lineHeight: 1.4 }}>
            {description ?? 'No information.'}
          </Text>
        </Flex>
      </Grid>

      {getChart()}

      <Flex sx={{ flexDirection: 'column', flexGrow: 1, gap: 5 }}>
        <TopSellingNFTs collectionId={id} />
      </Flex>

      <ExplorePanel collectionId={id} />
    </Layout>
  )
}
