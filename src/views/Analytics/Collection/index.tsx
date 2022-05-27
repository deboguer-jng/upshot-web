/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  imageOptimizer,
  Link,
  theme,
  Tooltip,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { Container, Flex, Grid } from '@upshot-tech/upshot-ui'
import {
  Avatar,
  Button,
  formatNumber,
  Icon,
  Text,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'
import { Box } from 'theme-ui'
import CollectionScatterChart from 'views/Analytics/components/CollectionScatterChart'
import ExplorePanel from 'views/Analytics/components/ExplorePanel'
import TopSellingNFTs from 'views/Analytics/components/TopSellingNFTs'

import Breadcrumbs from '../components/Breadcrumbs'
import CollectionHeader from '../components/CollectionHeader'
import { DescriptionWrapper } from '../components/Styled'
import { GET_COLLECTION, GetCollectionData, GetCollectionVars } from './queries'

interface CollectionStatProps {
  value: string
  label: string
  color?: keyof typeof theme.colors
  currencySymbol?: string
}

function CollectionStat({
  value,
  label,
  color = 'grey-300',
  currencySymbol = '',
}: CollectionStatProps) {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        bg: 'grey-800',
        borderRadius: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '80px',
        color,
        gap: 1,
      }}
    >
      <Text sx={{ fontSize: 5, fontWeight: 'heading' }}>
        {currencySymbol === '' && value}
      </Text>

      <Text sx={{ fontSize: 2, lineHeight: 1 }}>{label}</Text>
    </Flex>
  )
}

function Layout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')

  const breadcrumbs = prevPath?.includes('user')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: `${
            decodeURI(prevPath as string).split('?userWallet=')[1]
          }'s Collection`,
          link: prevPath,
        },
      ]
    : !prevPath?.includes('/nft/')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
      ]
    : [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('nftName=')[1],
          link: prevPath,
        },
      ]

  return (
    <>
      <Nav />
      <Container
        maxBreakpoint="lg"
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
          marginBottom: 10,
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />
        {children}
      </Container>
      <Footer />
    </>
  )
}

export default function CollectionView() {
  const dispatch = useAppDispatch()
  const [id, setId] = useState<number>()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const router = useRouter()

  useEffect(() => {
    /* Parse assetId from router */
    const id = router.query.id
    if (!id) return

    setId(Number(id))
  }, [router.query])

  const { loading, data } = useQuery<GetCollectionData, GetCollectionVars>(
    GET_COLLECTION,
    {
      errorPolicy: 'all',
      variables: { id },
      skip: !id,
    }
  )

  /* Memoize scatter chart to avoid unnecessary updates. */
  const scatterChart = useMemo(
    () => (
      <CollectionScatterChart {...{ id }} name={data?.collectionById?.name} />
    ),
    [id, data]
  )

  /* Load state. */
  if (loading)
    return (
      <Layout>
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <CollectionHeader />
            <img src="/img/Logo_bounce_spin.gif" width={256} alt="Loading" />
          </Flex>
      </Layout>
    )

  /* No results state. */
  if (!data?.collectionById)
    return (
      <Layout>
        <Container sx={{ justifyContent: 'center' }}>
          Unable to load collection.
        </Container>
      </Layout>
    )

  const { name, description, imageUrl, isAppraised, size, latestStats } =
    data.collectionById

  return (
    <Layout title={name}>
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <CollectionHeader />
        <Grid columns={['1fr', '1fr', '1fr 1fr']} sx={{ gap: '40px' }}>
          <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
            <Text
              variant="large"
              sx={{ textTransform: 'uppercase', fontWeight: 400 }}
            >
              General Stats
            </Text>
            <Grid
              columns="repeat(auto-fit, minmax(140px, 1fr))"
              sx={{ gap: 4 }}
            >
              <CollectionStat
                color="blue"
                value={
                  latestStats?.average
                    ? formatNumber(latestStats.average, {
                        fromWei: true,
                        decimals: 2,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Average Price"
              />
              <CollectionStat
                color="pink"
                value={
                  latestStats?.floor
                    ? formatNumber(latestStats.floor, {
                        fromWei: true,
                        decimals: 2,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Floor Price"
              />
              <CollectionStat
                color={
                  data.collectionById.latestStats?.weekFloorChange
                    ? data.collectionById.latestStats?.weekFloorChange > 0
                      ? 'green'
                      : 'red'
                    : 'white'
                }
                value={
                  data.collectionById.latestStats?.weekFloorChange
                    ? data.collectionById.latestStats?.weekFloorChange > 0
                      ? '+' +
                        data.collectionById.latestStats?.weekFloorChange.toFixed(
                          2
                        ) +
                        '%'
                      : data.collectionById.latestStats?.weekFloorChange.toFixed(
                          2
                        ) + '%'
                    : '-'
                }
                label="7 Day Floor Change"
              />
              <CollectionStat
                value={
                  latestStats?.floorCap
                    ? formatNumber(latestStats.floorCap, {
                        fromWei: true,
                        decimals: 2,
                        kmbUnits: true,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Floor Cap"
              />
              <CollectionStat
                value={
                  latestStats?.pastWeekWeiVolume
                    ? formatNumber(latestStats.pastWeekWeiVolume, {
                        fromWei: true,
                        decimals: 2,
                        kmbUnits: true,
                        prefix: 'ETHER',
                      })
                    : '-'
                }
                label="Weekly Volume"
              />
              <CollectionStat
                value={size ? formatNumber(size) : '-'}
                label="NFTs in Collection"
              />
            </Grid>
          </Flex>
          <Flex
            sx={{
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {description && (
              <Text variant="large" sx={{ textTransform: 'uppercase' }}>
                About
              </Text>
            )}
            <DescriptionWrapper color="grey-300">
              {(
                <ReactMarkdown allowedElements={['a', 'p']}>
                  {description}
                </ReactMarkdown>
              ) ?? 'No information.'}
            </DescriptionWrapper>
          </Flex>
        </Grid>
        <Text
          variant="large"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 400,
            marginTop: '20px',
          }}
        >
          {name}
        </Text>
        <Text
          variant="h2Primary"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 400,
            marginTop: '-15px',
          }}
        >
          sales this month
        </Text>
        {scatterChart}

        <Flex
          sx={{
            position: 'relative',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 5,
          }}
        >
          <TopSellingNFTs collectionId={id} />
        </Flex>

        <ExplorePanel
          collectionId={id}
          collectionName={name}
          {...{ isAppraised }}
        />
      </Flex>
    </Layout>
  )
}
