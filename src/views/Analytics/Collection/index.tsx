/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { theme } from '@upshot-tech/upshot-ui'
import { Container, Flex, Grid } from '@upshot-tech/upshot-ui'
import { formatNumber, Text } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
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

function Layout({ children }: { children: React.ReactNode }) {
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
        maxBreakpoint="xxl"
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
  const router = useRouter()
  const id = Number(router.query.id ?? 0)

  const { loading, data } = useQuery<GetCollectionData, GetCollectionVars>(
    GET_COLLECTION,
    {
      fetchPolicy: 'network-only',
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

  const loadContent = useMemo(
    () => (
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: '60vh' }}>
        <img src="/img/Logo_bounce_spin.gif" width={256} alt="Loading" />
      </Flex>
    ),
    []
  )

  const emptyContent = useMemo(
    () => (
      <Container sx={{ justifyContent: 'center' }}>
        Unable to load collection.
      </Container>
    ),
    []
  )

  return (
    <Layout>
      <CollectionHeader {...{ id }} />

      {loading ? (
        loadContent
      ) : !data?.collectionById ? (
        emptyContent
      ) : (
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 4,
            maxWidth: '1280px',
            marginX: 'auto',
          }}
        >
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
                    data.collectionById?.latestStats?.average
                      ? formatNumber(
                          data.collectionById?.latestStats?.average,
                          {
                            fromWei: true,
                            decimals: 2,
                            prefix: 'ETHER',
                          }
                        )
                      : '-'
                  }
                  label="Average Price"
                />
                <CollectionStat
                  color="pink"
                  value={
                    data.collectionById?.latestStats?.floor
                      ? formatNumber(data.collectionById?.latestStats.floor, {
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
                    data.collectionById?.latestStats?.floorCap
                      ? formatNumber(data.collectionById.latestStats.floorCap, {
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
                    data.collectionById?.latestStats?.pastWeekWeiVolume
                      ? formatNumber(
                          data.collectionById.latestStats.pastWeekWeiVolume,
                          {
                            fromWei: true,
                            decimals: 2,
                            kmbUnits: true,
                            prefix: 'ETHER',
                          }
                        )
                      : '-'
                  }
                  label="Weekly Volume"
                />
                <CollectionStat
                  value={
                    data.collectionById?.size
                      ? formatNumber(data.collectionById.size)
                      : '-'
                  }
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
              {data.collectionById?.description && (
                <Text variant="large" sx={{ textTransform: 'uppercase' }}>
                  About
                </Text>
              )}
              <DescriptionWrapper color="grey-300">
                {(
                  <ReactMarkdown allowedElements={['a', 'p']}>
                    {data.collectionById.description}
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
            {data.collectionById?.name}
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
            collectionName={data.collectionById?.name}
            isAppraised={data.collectionById?.isAppraised}
          />
        </Flex>
      )}
    </Layout>
  )
}
