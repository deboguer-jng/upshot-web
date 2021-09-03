import { AppBar, Chart, Container } from '@upshot-tech/upshot-ui'
import { Box, Flex, Text } from '@upshot-tech/upshot-ui'
import { CollectionButton, Image } from '@upshot-tech/upshot-ui'

import ButtonTabs from './ButtonTabs'
import CollectionPanel from './CollectionPanel'
import { chartData, collectionItems } from './constants'

export default function LandingView() {
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
      <Flex sx={{ flex: '1 1 auto', flexDirection: 'column' }}>
        <Text variant="h1Secondary">Top Collections</Text>
        <ButtonTabs />

        <Box sx={{ height: 300, width: '100%' }}>
          <Chart data={chartData} />
        </Box>

        <CollectionPanel
          title="Collection Avg. Price"
          subtitle="(Select Collections to change graph)"
        >
          {collectionItems.map(({ text, subText, src }, idx) => (
            <Flex
              key={idx}
              sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
            >
              <Text>{idx + 1}</Text>
              <CollectionButton
                icon={
                  <Image
                    alt={`${text} Cover Artwork`}
                    height="100%"
                    width="100%"
                    sx={{ borderRadius: 'circle' }}
                    {...{ src }}
                  />
                }
                {...{ text, subText }}
              />
            </Flex>
          ))}
        </CollectionPanel>
      </Flex>
      [Footer]
    </Container>
  )
}
