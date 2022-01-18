import { Box, Container } from '@upshot-tech/upshot-ui'
import { Flex, Text } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { useState } from 'react'

import ButtonTabs, { METRIC } from './components/ButtonTabs'
import CollectionAvgPricePanel from './components/CollectionAvgPricePanel'
import ExplorePanel from './components/ExplorePanel'
import TopCollectionsChart from './components/TopCollectionsChart'
import TopSellingCollectionNFTs from './components/TopSellingCollectionNFTs'
import TreeMapMarketCap from './components/TreeMapMarketCap'

const selectedCollectionsColors = ['blue', 'pink', 'purple', 'green', 'orange']

export default function AnalyticsView() {
  const [chartMetric, setChartMetric] = useState<METRIC>('FLOOR')
  const [selectedCollections, setSelectedCollections] = useState<number[]>([])
  const [colorCycleIndex, setColorCycleIndex] = useState(3)

  const handleChange = (updatedChartMetric: METRIC) => {
    setChartMetric(updatedChartMetric)
  }

  const handleCollectionSelected = (id: number) => {
    // Removing an existing item
    if (selectedCollections.includes(id)) {
      const updatedCollections = selectedCollections.filter((_id) => _id !== id)

      setColorCycleIndex(updatedCollections.length)

      return setSelectedCollections(updatedCollections)
    }

    // Appending a new item
    const updatedCollections =
      selectedCollections.length < selectedCollectionsColors.length
        ? [...selectedCollections, id]
        : [
            ...selectedCollections.slice(0, colorCycleIndex),
            id,
            ...selectedCollections.slice(
              colorCycleIndex + 1,
              selectedCollections.length
            ),
          ]

    setSelectedCollections(updatedCollections)
    setColorCycleIndex((curr) => (curr + 1) % selectedCollectionsColors.length)
  }

  const handleClose = (index: number) => {
    setSelectedCollections([
      ...selectedCollections.slice(0, index),
      ...selectedCollections.slice(index + 1, selectedCollections.length),
    ])
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
      <Nav />
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column', 'row', 'row'],
            paddingBottom: ['0px', '0px', '10px'],
            marginTop: ['-20px', '-20px', '-10px'],
          }}
        >
          <Text
            variant="h0Secondary"
            sx={{
              lineHeight: '2.25rem',
              color: 'blue',
              fontWeight: '700',
              fontSize: ['42px', '42px', 8],
              textTransform: 'uppercase',
            }}
          >
            Upshot
          </Text>
          <Flex>
            <Text
              variant="h0Secondary"
              sx={{
                lineHeight: '2.25rem',
                fontWeight: '500',
                fontSize: ['42px', '42px', 8],
              }}
            >
              Analytics
            </Text>
            <Box sx={{ p: [1, 1, 2] }}>
              <Text
                sx={{
                  textTransform: 'uppercase',
                  color: 'black',
                  backgroundColor: 'blue',
                  borderRadius: 'xs',
                  padding: '2px 4px',
                  fontSize: ['9px', '9px', 2],
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                Beta
              </Text>
            </Box>
          </Flex>
        </Flex>
        <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
          <ButtonTabs onChange={handleChange} />
          <TopCollectionsChart
            metric={chartMetric}
            onClose={handleClose}
            {...{ selectedCollections }}
          />
          <CollectionAvgPricePanel
            metric={chartMetric}
            onCollectionSelected={handleCollectionSelected}
            {...{
              colorCycleIndex,
              selectedCollections,
              setSelectedCollections,
              selectedCollectionsColors,
            }}
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
