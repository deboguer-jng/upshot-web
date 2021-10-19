import {
  Box,
  Container,
  Flex,
  Footer,
  Grid,
  Icon,
  LandingPanel,
  Text,
} from '@upshot-tech/upshot-ui'
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
        <Box sx={{ display: ['none', 'none', 'none', 'flex'] }}>
          {' '}
          {/* Display only on Desktop */}
          <Flex sx={{ gap: 15, marginTop: '10%', marginBottom: '10%' }}>
            <Icon color="primary" icon="upshot" size={216} />
            <Box>
              <Box>
                <Box>
                <Text variant="h0Primary" sx={{ fontSize: '70px' }}>
                    Where NFTs meet DeFi
                  </Text>
                </Box>
                <Box sx={{ marginTop: '30px' }}>
                  <Text variant="h3Primary">
                  NFTs offer us a vehicle for tokenizing anything, while the explosive
                  growth of DeFi has demonstrated the power of permissionless financial
                  primitives. However, due to the nascency and inherent illiquidity of
                  NFTs, DeFi and NFTs have yet to fully collaborate. Upshot is building
                  scalable NFT pricing infrastructure at the intersection of DeFi x NFTs.
                  Through a combination of crowdsourced appraisals and proprietary
                  machine learning algorithms, Upshot provides deep insight into NFT
                  markets and unlocks a wave of exotic new DeFi primitives.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
        <Text variant="h2Primary">Get started</Text>
        <Text variant="xLarge" color="grey-500">
          Gain insight into NFT markets with our suite of tools.
        </Text>
        <Grid gap={5} columns={[1, 1, 2, 3]}>
          <Box
            sx={{
              borderRadius: '20px',
              background:
                'linear-gradient(229.88deg, rgba(236, 91, 148, 0.18) 14.66%, rgba(236, 91, 148, 0.18) 14.66%, rgba(236, 91, 148, 0) 100.35%), #231F20',
              minHeight: '240px',
            }}
          />
          <Box
            sx={{
              borderRadius: '20px',
              background:
                'linear-gradient(229.88deg, rgba(0, 145, 255, 0.3) 14.66%, rgba(0, 145, 255, 0) 100.35%), #231F20',
              minHeight: '240px',
            }}
          />
          <Grid
            gap={2}
            columns={[1, 1, 2]}
            sx={{
              /* Temporarily */
              cursor: 'not-allowed',
              '& a': {
                pointerEvents: 'none',
              },
              /* --- End Temporarily --- */
              padding: '18px',
              border: '1px solid #545454',
              borderRadius: '24px',
            }}
          >
            <Text
              color="grey-600"
              sx={{
                position: 'absolute',
                transform: 'translate(0%, -150%);',
                bg: 'black',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              Coming soon
            </Text>
            <LandingPanel
              title="Ask"
              description="Short intro to product"
              showLinkIcon={false}
            />
            <LandingPanel
              title="Stake"
              description="Short intro to product"
              showLinkIcon={false}
            />
            <LandingPanel
              title="Answer"
              description="Short intro to product"
              showLinkIcon={false}
            />
            <LandingPanel
              title="Boards"
              description="Short intro to product"
              showLinkIcon={false}
            />
          </Grid>
        </Grid>
        
        <Text variant="h2Primary">Discover</Text>
        <Text variant="xLarge" color="grey-500">
          Explore innovative products at the intersection of DeFi x NFTs.
        </Text>

        <Grid gap={2} columns={[1, 1, 1, 2]}>
          <Grid gap={2} sx={{ flexDirection: 'column' }}>
            <Grid gap={2} columns={[1, 1, '10fr 6fr']}>
              <LandingPanel
                projectType="Protocolll"
                title="Project Name"
                description="Short intro to product"
                image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
              />
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
              </Grid>
            </Grid>
            <Grid gap={2} columns={[1, 1, '6fr 10fr']}>
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
              </Grid>
              <LandingPanel
                projectType="Protocolll"
                title="Project Name"
                description="Short intro to product"
                image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
              />
            </Grid>
          </Grid>
          <Grid gap={2} sx={{ flexDirection: 'column' }}>
            <Grid gap={2} columns={[1, 1, '6fr 10fr']}>
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
              </Grid>
              <LandingPanel
                projectType="Protocolll"
                title="Project Name"
                description="Short intro to product"
                image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
              />
            </Grid>
            <Grid gap={2} columns={[1, 1, '10fr 6fr']}>
              <LandingPanel
                projectType="Protocolll"
                title="Project Name"
                description="Short intro to product"
                image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
              />
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
                <LandingPanel
                  projectType="Protocolll"
                  title="Project Name"
                  description="Short intro to product"
                  image="https://cdn.coinranking.com/nft/0x60F80121C31A0d46B5279700f9DF786054aa5eE5/58567.png?size=autox430"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Footer />
      </Container>
    </>
  )
}
