import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer, Text } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { useState } from 'react'

import ButtonTabs, { METRIC } from './components/ButtonTabs'
import CollectionAvgPricePanel from './components/CollectionAvgPricePanel'
import ExplorePanel from './components/ExplorePanel'
import TopCollectionsChart from './components/TopCollectionsChart'
import TopSellingNFTs from './components/TopSellingNFTs'

export default function LandingView() {
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
          <Text variant="h1Secondary">Top Collections</Text>
          <ButtonTabs onChange={handleChange} />
          <TopCollectionsChart
            metric={chartMetric}
            {...{ selectedCollections }}
          />
          <CollectionAvgPricePanel
            {...{ selectedCollections }}
            metric={chartMetric}
            onCollectionSelected={handleCollectionSelected}
          />
          <TopSellingNFTs />
          <ExplorePanel />
        </Flex>
        <Footer />
      </Container>
    </>
  )
}
