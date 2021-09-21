import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer, Navbar, Text } from '@upshot-tech/upshot-ui'
import { useRouter } from 'next/router'
import { useState } from 'react'

import ButtonTabs, { METRIC } from './components/ButtonTabs'
import CollectionAvgPricePanel from './components/CollectionAvgPricePanel'
import ExplorePanel from './components/ExplorePanel'
import TopCollectionsChart from './components/TopCollectionsChart'
import TopSellingNFTs from './components/TopSellingNFTs'

export default function LandingView() {
  const router = useRouter()
  const [chartMetric, setChartMetric] = useState<METRIC>('AVERAGE')

  const [navSearchTerm, setNavSearchTerm] = useState('')
  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault()

    router.push(`/search?query=${navSearchTerm}`)
  }

  const handleChange = (updatedChartMetric: METRIC) => {
    setChartMetric(updatedChartMetric)
  }

  return (
    <Container
      p={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        gap: 4,
      }}
    >
      <Navbar
        searchValue={navSearchTerm}
        onSearchValueChange={(e) => setNavSearchTerm(e.currentTarget.value)}
        onSearch={handleNavSearch}
      />
      <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
        <Text variant="h1Secondary">Top Collections</Text>
        <ButtonTabs onChange={handleChange} />
        <TopCollectionsChart metric={chartMetric} />
        <CollectionAvgPricePanel />
        <TopSellingNFTs />
        <ExplorePanel />
      </Flex>
      <Footer />
    </Container>
  )
}
