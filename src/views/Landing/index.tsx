import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Footer } from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import Head from 'next/head'

export default function AnalyticsView() {
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
          Landing
        </Flex>
        <Footer />
      </Container>
    </>
  )
}
