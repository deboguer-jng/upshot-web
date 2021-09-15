import { AppBar, Container } from '@upshot-tech/upshot-ui'
import { Flex, Icon, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import { useState } from 'react'

import { METRIC } from './ButtonTabs'
import ButtonTabs from './ButtonTabs'
import CollectionAvgPricePanel from './CollectionAvgPricePanel'
import { cardItems } from './constants'
import ExplorePanel from './ExplorePanel'
import { MiniNFTContainer } from './Styled'
import TopCollectionsChart from './TopCollectionsChart'

export default function LandingView() {
  console.log('LANDING')
  const [chartMetric, setChartMetric] = useState<METRIC>('AVERAGE')

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
      <AppBar />
      <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
        <Text variant="h1Secondary">Top Collections</Text>
        <ButtonTabs onChange={handleChange} />

        <TopCollectionsChart metric={chartMetric} />

        <CollectionAvgPricePanel />
        <Flex variant="text.h3Secondary" sx={{ gap: 2 }}>
          Top Selling NFTs in
          <Flex
            color="primary"
            sx={{ justifyContent: 'center', alignItems: 'center', gap: 2 }}
          >
            1 Day
            <Icon icon="arrowDropUserBubble" color="primary" size={12} />
          </Flex>
        </Flex>
        <MiniNFTContainer>
          {cardItems.map(({ image }, key) => (
            <MiniNftCard price="$20.00" rarity="15%" key={key} {...{ image }} />
          ))}
        </MiniNFTContainer>
        <ExplorePanel />
      </Flex>
      [Footer]
    </Container>
  )
}
