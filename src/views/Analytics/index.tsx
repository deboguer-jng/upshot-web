import { Box, Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer, Text } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { useState } from 'react'

import ButtonTabs, { METRIC } from './components/ButtonTabs'
import CollectionAvgPricePanel from './components/CollectionAvgPricePanel'
import ExplorePanel from './components/ExplorePanel'
import TopCollectionsChart from './components/TopCollectionsChart'
import TopSellingNFTs from './components/TopSellingNFTs'
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
    if (selectedCollections.length === 3) return
    setSelectedCollections([...selectedCollections, id])
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
        <meta property="og:description" content="" />
        <meta property="og:image" content="https://upshot.io/img/opengraph/" />
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
        <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
          <Text variant="h1Secondary" sx={{ lineHeight: '2.25rem' }}>
            Top Collections
          </Text>
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
            <TopSellingNFTs />
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
