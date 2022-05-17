import styled from '@emotion/styled'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Icon,
  IconButton,
  Investors,
  Link,
  Panel,
  Text,
  theme,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import Head from 'next/head'
import NextLink from 'next/link'
import { useState } from 'react'
import { Image } from 'theme-ui'

import AnalyticsSVG from './panelBackgrounds/Analytics.svg'
import AnalyticsHoverSVG from './panelBackgrounds/AnalyticsHover.svg'
import ApiSVG from './panelBackgrounds/Api.svg'
import ApiHoverSVG from './panelBackgrounds/ApiHover.svg'
import GmiSvg from './panelBackgrounds/Gmi.svg'
import GmiHoverSvg from './panelBackgrounds/GmiHover.svg'
import UpshotArtworkSVG from './panelBackgrounds/UpshotArtwork.svg'

const BlogButton = styled(Button)`
  border-radius: 8px;
  height: 32px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.pink};
  box-shadow: ${({ theme }) => `${theme.rawColors['pink']} 0px 0px 0px 1.8px`};

  &:not(:disabled):not(:focus):hover {
    box-shadow: ${({ theme }) =>
      `${theme.rawColors['pink']} 0px 0px 0px 1.8px`};

    & span {
      color: ${({ theme }) => theme.colors.pink};
    }
  }
`

export default function LandingView() {
  const images = {
    analytics: {
      original: AnalyticsSVG,
      hover: AnalyticsHoverSVG,
    },
    api: {
      original: ApiSVG,
      hover: ApiHoverSVG,
    },
    gmi: {
      original: GmiSvg,
      hover: GmiHoverSvg,
    },
  }
  const [analyticsImage, setAnalyticsImage] = useState(
    images.analytics.original.src
  )
  const [apiImage, setApiImage] = useState(images.api.original.src)
  const [gmiImage, setGmiImage] = useState(images.gmi.original.src)

  return (
    <>
      <Head>
        <title>Upshot: Where NFTs meet DeFi</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@UpshotHQ" />
        <meta name="twitter:creator" content="@UpshotHQ" />
        <meta property="og:url" content="https://upshot.io" />
        <meta property="og:title" content="Upshot: Where NFTs meet DeFi" />
        <meta
          property="og:description"
          content="NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities."
        />
        <meta
          property="og:image"
          content="https://upshot.io/img/opengraph/opengraph_analytics.jpg"
        />
      </Head>
      <Container
        maxBreakpoint="lg"
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
          paddingBottom: '100px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {' '}
          {/* Display only on Desktop */}
          <Grid
            columns={[1, null, '3fr 2fr']}
            sx={{ marginTop: '5%', marginBottom: '2%' }}
          >
            <Box>
              <Box>
                <Text
                  variant="h0Primary"
                  sx={{
                    fontSize: ['3rem', null, '5rem', '8rem'],
                    textTransform: 'uppercase',
                    fontFamily: 'degular-display',
                  }}
                >
                  Upshot
                </Text>
              </Box>
              <Box sx={{ marginTop: ['0', null, '0', '1rem'] }}>
                <Text
                  variant="h1Primary"
                  sx={{ fontSize: ['1.6rem', null, '1.8rem', '2.8rem'] }}
                >
                  Where NFTs meet DeFi
                </Text>
              </Box>
              <Box sx={{ marginTop: ['0.4rem', null, '0.6rem', '1rem'] }}>
                <Text
                  variant="h3Primary"
                  sx={{
                    fontWeight: 'normal',
                    lineHeight: ['1.25rem', null, '1.375em', '1.75rem'],
                    fontSize: ['1.1rem', null, '1.3rem', '1.438rem'],
                  }}
                >
                  Upshot provides deep insight into NFT markets and unlocks a
                  wave of exotic new DeFi possibilities.
                </Text>
              </Box>
              <Flex sx={{ gridGap: '14px', marginTop: '20px' }}>
                <Box>
                  <Link
                    href="https://discord.gg/upshot"
                    target="_blank"
                    component={NextLink}
                  >
                    <IconButton>
                      <Icon color="purple" icon="discord" size={32} />
                    </IconButton>
                  </Link>
                </Box>
                <Box>
                  <Link
                    href="https://twitter.com/upshothq"
                    target="_blank"
                    component={NextLink}
                  >
                    <IconButton>
                      <Icon color="blue" icon="twitterCircle" size={32} />
                    </IconButton>
                  </Link>
                </Box>
                <Box>
                  <Link
                    href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
                    target="_blank"
                    component={NextLink}
                    noHover
                  >
                    <BlogButton capitalize>Read our blog</BlogButton>
                  </Link>
                </Box>

                <Box>
                  <Link
                    href="https://jobs.lever.co/upshot.io"
                    target="_blank"
                    component={NextLink}
                    noHover
                  >
                    <Button
                      capitalize={true}
                      style={{
                        borderRadius: '8px',
                        height: '32px',
                        padding: '8px 12px',
                      }}
                    >
                      Join our team
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Box>

            <Box sx={{ marginTop: ['-20px', null, '-40px', '-80px'] }}>
              <Image
                src={UpshotArtworkSVG.src}
                sx={{
                  width: '100%',
                }}
                alt="Upshot"
              />
            </Box>
          </Grid>
        </Box>
        <Text variant="h2Primary">Get started</Text>
        <Text variant="xLarge" color="grey-500">
          Start using our suite of tools for exploring the metaverse.
        </Text>
        <Grid gap={5} columns={[1, 1, 1, 1, 1, 2]}>
          <Link
            href="/analytics"
            rel="noopener noreferrer"
            sx={{
              color: theme.colors.text + ' !important',
              display: 'grid',
            }}
            component={NextLink}
            noHover
          >
            <Panel
              hoverUnderglow="pink"
              hoverBorder="pink"
              sx={{
                height: ['225px', null, null, '250px'],
                position: 'relative',
                padding: '22px !important',
                paddingRight: '88px !important',
                paddingTop: '10px !important',
                backgroundColor: theme.colors['grey-900'] + ' !important',
                '&:hover img': {
                  opacity: '1',
                },
                '&:hover span:first-of-type': {
                  color: theme.colors.pink,
                },
                '&:hover': {
                  backgroundColor: theme.colors.black + ' !important',
                },
              }}
              onMouseEnter={() => setAnalyticsImage(images.analytics.hover.src)}
              onMouseLeave={() =>
                setAnalyticsImage(images.analytics.original.src)
              }
            >
              <Image
                src={analyticsImage}
                sx={{
                  opacity: '0.7',
                  position: 'absolute',
                  right: '5%',
                  bottom: '0',
                  width: '70%',
                  maxHeight: '95%',
                }}
                alt="Analytics"
              ></Image>
              <div style={{ position: 'relative' }}>
                <Text variant="h1Secondary">Analytics</Text>
                <Text
                  variant="large"
                  sx={{
                    display: 'block',
                    whiteSpace: 'normal',
                    width: ['100%', null, null, '50%'],
                  }}
                >
                  Explore the world of NFTs using powerful data.
                </Text>
              </div>
            </Panel>
          </Link>
          <Box>
            <Grid gap={5} columns={[1, 1, 2, 2]}>
              <Link
                href="/gmi"
                rel="noopener noreferrer"
                sx={{
                  color: theme.colors.text + ' !important',
                  display: 'grid',
                }}
                component={NextLink}
                noHover
              >
                <Panel
                  hoverUnderglow="red"
                  hoverBorder="red"
                  sx={{
                    height: ['225px', null, null, '250px'],
                    position: 'relative',
                    padding: '22px !important',
                    paddingRight: '88px !important',
                    paddingTop: '10px !important',
                    backgroundColor: theme.colors['grey-900'] + ' !important',
                    '&:hover img': {
                      opacity: '1',
                    },
                    '&:hover span:first-of-type': {
                      color: theme.colors.red,
                    },
                    '&:hover': {
                      backgroundColor: theme.colors.black + ' !important',
                    },
                  }}
                  onMouseEnter={() => setGmiImage(images.gmi.hover.src)}
                  onMouseLeave={() => setGmiImage(images.gmi.original.src)}
                >
                  <Image
                    src={gmiImage}
                    sx={{
                      opacity: '0.7',
                      position: 'absolute',
                      bottom: '2%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      margin: 'auto',
                      width: 'auto',
                      height: '60%',
                      objectFit: 'cover',
                    }}
                    alt="gmi"
                  ></Image>
                  <div style={{ position: 'relative' }}>
                    <Text variant="h1Secondary">gmi</Text>
                    <Text
                      variant="large"
                      sx={{ display: 'block', whiteSpace: 'normal' }}
                    >
                       A new grading index for NFT wallets.
                    </Text>
                  </div>
                </Panel>
              </Link>
              <Link
                href="https://docs.upshot.xyz/"
                rel="noopener noreferrer"
                sx={{
                  color: theme.colors.text + ' !important',
                  display: 'grid',
                }}
                component={NextLink}
                noHover
              >
                <Panel
                  hoverUnderglow="blue"
                  hoverBorder="blue"
                  sx={{
                    height: ['225px', null, null, '250px'],
                    position: 'relative',
                    padding: '22px !important',
                    paddingRight: '88px !important',
                    paddingTop: '10px !important',
                    backgroundColor: theme.colors['grey-900'] + ' !important',
                    '&:hover img': {
                      opacity: '1',
                    },
                    '&:hover span:first-of-type': {
                      color: theme.colors.blue,
                    },
                    '&:hover': {
                      backgroundColor: theme.colors.black + ' !important',
                    },
                  }}
                  onMouseEnter={() => setApiImage(images.api.hover.src)}
                  onMouseLeave={() => setApiImage(images.api.original.src)}
                >
                  <Image
                    src={apiImage}
                    sx={{
                      opacity: '0.7',
                      position: 'absolute',
                      bottom: '5%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'auto',
                      height: '60%',
                      objectFit: 'cover',
                    }}
                    alt="Upshot One"
                  ></Image>
                  <div style={{ position: 'relative' }}>
                    <Text variant="h1Secondary" sx={{ whiteSpace: 'nowrap' }}>
                      Upshot API
                    </Text>
                    <Text
                      variant="large"
                      sx={{ display: 'block', whiteSpace: 'normal' }}
                    >
                      Integrate Upshot data into your project.
                    </Text>
                  </div>
                </Panel>
              </Link>
            </Grid>
          </Box>
        </Grid>
      </Container>
      <Investors />
      <Footer />
    </>
  )
}
