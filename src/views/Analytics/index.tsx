import { Box, Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer, Text } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { useState } from 'react'

import ButtonTabs, { METRIC } from './components/ButtonTabs'
import CollectionAvgPricePanel from './components/CollectionAvgPricePanel'
import ExplorePanel from './components/ExplorePanel'
import TopCollectionsChart from './components/TopCollectionsChart'
import TopSellingCollectionNFTs from './components/TopSellingCollectionNFTs'
import TreeMapMarketCap from './components/TreeMapMarketCap'

export default function AnalyticsView() {
  const [chartMetric, setChartMetric] = useState<METRIC>('VOLUME')
  const [selectedCollections, setSelectedCollections] = useState<number[]>([])

  const handleChange = (updatedChartMetric: METRIC) => {
    setChartMetric(updatedChartMetric)
  }

  const handleCollectionSelected = (id: number) => {
    if (selectedCollections.includes(id)) {
      return setSelectedCollections(
        selectedCollections.filter((_id) => _id !== id)
      )
    }
    if (selectedCollections.length === 3) {
      setSelectedCollections([...selectedCollections.slice(1, 3), id])
    } else {
      setSelectedCollections([...selectedCollections, id])
    }
  }

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
          content="https://upshot.io/img/opengraph/opengraph_analytics.jpg"
        />
      </Head>
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
        }}
      >
        <Nav />
        <Box
          sx={{
            display: 'inline-block',
            paddingBottom: ['0px', '0px', '10px'],
            marginTop: ['-20px', '-20px', '-10px'],
          }}
        >
          <Text
            variant="h0Secondary"
            sx={{
              lineHeight: '2.25rem',
              display: 'inline-block',
              color: 'blue',
              fontWeight: '700',
              fontSize: ['46px', '46px', 8],
            }}
          >
            UPSHOT
          </Text>
          <Text
            variant="h0Secondary"
            sx={{
              lineHeight: '2.25rem',
              display: 'inline-block',
              fontWeight: '500',
              fontSize: ['46px', '46px', 8],
            }}
          >
            Analytics
          </Text>
        </Box>
        <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
          <ButtonTabs onChange={handleChange} />
          <TopCollectionsChart
            metric={chartMetric}
            {...{ selectedCollections }}
          />
          <CollectionAvgPricePanel
            {...{ selectedCollections }}
            metric={chartMetric}
            onCollectionSelected={handleCollectionSelected}
            setSelectedCollections={setSelectedCollections}
          />
          <Box sx={{ position: 'relative' }}>
            <TopSellingCollectionNFTs />
          </Box>
          <Text variant="text.h1Secondary" sx={{ lineHeight: '2.25rem' }}>
            Market Cap (Change Over 7 Days)
          </Text>
          <TreeMapMarketCap />
          <ExplorePanel />
        </Flex>
        <Footer />
      </Container>
    </>
  )
}
