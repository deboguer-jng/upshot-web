import { AppBar, Chart, Container, Flex } from '@upshot-tech/upshot-ui'

export default function LandingView() {
  const data = [
    {
      name: 'Series 1',
      data: [...new Array(10)].map((_) => Math.floor(Math.random() * 10) + 10),
    },
    {
      name: 'Series 2',
      data: [...new Array(10)].map((_) => Math.floor(Math.random() * 10) + 10),
    },
  ]
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
      <Flex sx={{ flex: '1 1 auto' }}>
        <Chart {...{ data }} />
      </Flex>
      [Footer]
    </Container>
  )
}
