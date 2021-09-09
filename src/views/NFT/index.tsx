import { useBreakpointIndex } from '@theme-ui/match-media'
import { AppBar, Container } from '@upshot-tech/upshot-ui'
import { Flex, Text } from '@upshot-tech/upshot-ui'

export default function NFTView() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

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
        <Text>Search Results for</Text>
        <Text variant="h1Primary">Search Results for</Text>
      </Flex>
      [Footer]
    </Container>
  )
}
