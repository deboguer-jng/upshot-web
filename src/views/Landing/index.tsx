import { AppBar, Container, Flex } from '@upshot-tech/upshot-ui'

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
      <Flex sx={{ flex: '1 1 auto' }}>[Content]</Flex>
      [Footer]
    </Container>
  )
}
