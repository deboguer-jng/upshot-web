import {
  Box,
  Container,
  Flex,
  Footer,
  Grid,
  Icon,
  LandingPanel,
  Panel,
  Text,
} from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { Image,Link } from 'theme-ui'

import { projects } from './content'
import AnalyticsSVG from './panelBackgrounds/Analytics.svg'
import UpshotOneSVG from './panelBackgrounds/UpshotOne.svg'

type PanelData = {
  projectType: string,
  title: string,
  description: string,
  image: any,
  url: string,
}

function renderLandingPanel(data: PanelData) {
  return (
    <Link href={data.url} target='_blank' sx={{
      color: 'initial',
      textDecoration: 'none',
      display: 'grid',
      '&:hover': {
        textDecoration: 'none',
      }
    }}>
      <LandingPanel
        projectType={data.projectType}
        title={data.title}
        description={data.description}
        image={data.image.src}
      />
    </Link>
  )
}

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
          <Flex sx={{ gap: 15, marginTop: '5%', marginBottom: '5%' }}>
            <Icon color="primary" icon="upshot" size={175} />
            <Box>
              <Box>
                <Box>
                <Text variant="h0Primary" sx={{ fontSize: '60px' }}>
                    Upshot: Where NFTs meet DeFi
                  </Text>
                </Box>
                <Box sx={{ marginTop: '30px' }}>
                  <Text variant="h3Primary" sx={{ fontWeight: 'normal', lineHeight: '1.3em' }}>
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
          <Link href='/analytics' target="_blank" rel="noopener noreferrer" sx={{
            color: 'text',
            textDecoration: 'none',
            display: 'grid',
            '&:hover': {
              textDecoration: 'none'
            }}}>
            <Panel
              hoverUnderglow='pink'
              sx={{
                position: 'relative',
                padding: '32px !important',
                paddingRight: '88px !important',
                background: 'linear-gradient(229.88deg, rgba(236, 91, 148, 0.18) 14.66%, rgba(236, 91, 148, 0.18) 14.66%, rgba(236, 91, 148, 0) 100.35%), #231F20',
                '&:hover img': {
                  opacity: '1',
                }
              }} >
              <Image src={AnalyticsSVG.src} sx={{
                opacity: '0.3',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}></Image>
              <div style={{ position: 'relative' }}>
                <Text variant='h1Secondary'>
                  Analytics
                </Text>
                <Text variant='large' sx={{ paddingTop: '60px', display: 'block' }}>
                  Discover the world of NFTs using powerful data.
                </Text>
              </div>
            </Panel>
          </Link>
          <Link href='https://upshot.gitbook.io/upshot-api/' target="_blank" rel="noopener noreferrer" sx={{
            color: 'text',
            textDecoration: 'none',
            display: 'grid',
            '&:hover': {
              textDecoration: 'none'
            }}}>
            <Panel
              hoverUnderglow='blue'
              sx={{
                position: 'relative',
                padding: '32px !important',
                paddingRight: '88px !important',
                background: 'linear-gradient(229.88deg, rgba(0, 145, 255, 0.3) 14.66%, rgba(0, 145, 255, 0) 100.35%), #231F20',
                '&:hover img': {
                  opacity: '1',
                }
              }}>
              <Image src={UpshotOneSVG.src} sx={{
                opacity: '0.3',
                position: 'absolute',
                right: '0',
                top: '0',
                width: 'auto',
                height: '50%',
                objectFit: 'cover',
              }}></Image>
              <div style={{ position: 'relative' }}>
                <Text variant='h1Secondary'>
                  Upshot API
                </Text>
                <Text variant='large' sx={{ paddingTop: '60px', display: 'block' }}>
                  Integrate Upshot data into your project.
                </Text>
              </div>
            </Panel>
          </Link>
          <Grid
            gap={2}
            columns={[1, 1, 2]}
            sx={{
              padding: '18px',
              border: '1px solid #545454',
              borderRadius: '24px',
            }}
          >
            <Text
              color="grey-600"
              sx={{
                position: 'absolute',
                transform: 'translate(0%, -150%)',
                bg: 'black',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              Additional Resources
            </Text>
            <Link href={'https://blog.upshot.io'} target='_blank' sx={{
              color: 'initial',
              textDecoration: 'none',
              display: 'grid',
              '&:hover': {
                textDecoration: 'none',
              }
            }}>
            <LandingPanel
              title="Blog"
              description="Check out our blog"
              showLinkIcon={true}
              hoverUnderglow='grey-600'
              disabled={false}
            />
            </Link>
            <Link href={'https://jobs.lever.co/upshot.io'} target='_blank' sx={{
              color: 'initial',
              textDecoration: 'none',
              display: 'grid',
              '&:hover': {
                textDecoration: 'none',
              }
            }}>
            <LandingPanel
              title="Careers"
              description="Join our team"
              showLinkIcon={true}
              hoverUnderglow='grey-600'
              disabled={false}
            />
            </Link>
            <Link href={'https://discord.gg/upshot'} target='_blank' sx={{
              color: 'initial',
              textDecoration: 'none',
              display: 'grid',
              '&:hover': {
                textDecoration: 'none',
              }
            }}>
            <LandingPanel
              title="Discord"
              description="Become a part of the community"
              showLinkIcon={true}
              hoverUnderglow='grey-600'
              disabled={false}
            />
            </Link>
            <Link href={'https://twitter.com/UpshotHQ'} target='_blank' sx={{
              color: 'initial',
              textDecoration: 'none',
              display: 'grid',
              '&:hover': {
                textDecoration: 'none',
              }
            }}>
            <LandingPanel
              title="Twitter"
              description="Follow us on Twitter"
              showLinkIcon={true}
              hoverUnderglow='grey-600'
              disabled={false}
            />
            </Link>
          </Grid>
        </Grid>
        
        <Text variant="h2Primary">Discover</Text>
        <Text variant="xLarge" color="grey-500">
          Explore innovative products at the intersection of DeFi x NFTs.
        </Text>

        <Grid gap={2} columns={[1, 1, 1, 2]}>
          <Grid gap={2} sx={{ flexDirection: 'column' }}>
            <Grid gap={2} columns={[1, 1, '10fr 6fr']}>
              { renderLandingPanel(projects[0]) }
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                { renderLandingPanel(projects[1]) }
                { renderLandingPanel(projects[2]) }
              </Grid>
            </Grid>
            <Grid gap={2} columns={[1, 1, '6fr 10fr']}>
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                { renderLandingPanel(projects[3]) }
                { renderLandingPanel(projects[4]) }
              </Grid>
              { renderLandingPanel(projects[5]) }
            </Grid>
          </Grid>
          <Grid gap={2} sx={{ flexDirection: 'column' }}>
            <Grid gap={2} columns={[1, 1, '6fr 10fr']}>
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                { renderLandingPanel(projects[6]) }
                { renderLandingPanel(projects[7]) }
              </Grid>
              { renderLandingPanel(projects[8]) }
            </Grid>
            <Grid gap={2} columns={[1, 1, '10fr 6fr']}>
              { renderLandingPanel(projects[9]) }
              <Grid gap={2} sx={{ flexDirection: 'column' }}>
                { renderLandingPanel(projects[10]) }
                { renderLandingPanel(projects[11]) }
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Footer />
      </Container>
    </>
  )
}
