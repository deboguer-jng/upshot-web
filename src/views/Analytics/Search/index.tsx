import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Container } from '@upshot-tech/upshot-ui'
import { Flex, Grid, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import { BlurrySquareTemplate, Pagination } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { weiToEth } from 'utils/number'

import Breadcrumbs from '../components/Breadcrumbs'
import SearchFilterSidebar from '../components/SearchFilterSidebar'
import {
  GET_ASSETS_SEARCH,
  GetAssetsSearchData,
  GetAssetsSearchVars,
} from './queries'

const ROW_SIZE = 4

enum BREAKPOINT_INDEXES {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export default function SearchView() {
  const router = useRouter()
  const [page, setPage] = useState(0)

  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const collectionId = router.query.collectionId
    ? Number(router.query.collectionId)
    : undefined

  const tokenId = router.query.tokenId as string
  const minPrice = router.query.minPrice as string
  const maxPrice = router.query.maxPrice as string
  const traitANDMatch = router.query.traitANDMatch as string
  const traitIds = [router.query?.traits ?? []].flat().map((val) => Number(val))

  const chunks = {
    [BREAKPOINT_INDEXES.ZERO]: 2,
    [BREAKPOINT_INDEXES.ONE]: 2,
    [BREAKPOINT_INDEXES.TWO]: 2,
    [BREAKPOINT_INDEXES.THREE]: 3,
    [BREAKPOINT_INDEXES.FOUR]: 4,
    [BREAKPOINT_INDEXES.FIVE]: 5,
    [BREAKPOINT_INDEXES.SIX]: 6,
  }

  const chunkSize = chunks[breakpointIndex]
  const loadArr = [...new Array(ROW_SIZE * chunkSize)]
  const searchQueryParam = (router.query.query as string) ?? ''

  const { loading, error, data } = useQuery<
    GetAssetsSearchData,
    GetAssetsSearchVars
  >(GET_ASSETS_SEARCH, {
    errorPolicy: 'all',
    variables: {
      limit: ROW_SIZE * chunkSize,
      offset: page * ROW_SIZE * chunkSize,
      collectionId,
      tokenId,
      minPrice,
      maxPrice,
      traitFilterJoin: traitANDMatch === 'true' ? 'AND' : 'OR',
      traitIds: traitIds.length ? traitIds : undefined,
    },
    skip: !collectionId,
  })

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleClickNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  const assetArr = data?.assetGlobalSearch?.assets

  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')

  const breadcrumbs = prevPath?.includes('/nft/')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('nftName=')[1],
          link: prevPath,
        },
      ]
    : [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
      ]

  return (
    <>
      <Head>
        <title>
          {searchQueryParam ? searchQueryParam + ' | ' : ''}Upshot Analytics
        </title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@UpshotHQ" />
        <meta name="twitter:creator" content="@UpshotHQ" />
        <meta property="og:url" content="https://upshot.io" />
        <meta property="og:title" content="Upshot Analytics" />
        <meta
          property="og:description"
          content="NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities."
        />
        <meta
          property="og:image"
          content="https://upshot.io/img/opengraph/opengraph_search.jpg"
        />
      </Head>
      <Flex sx={{ minHeight: '100vh', flexDirection: 'column' }}>
        <Nav />
        <Container
          maxBreakpoint="xxl"
          sx={{
            flexDirection: 'column',
            gap: 4,
            padding: 4,
            flexGrow: 1,
          }}
        >
          <Breadcrumbs crumbs={breadcrumbs} />

          <Grid
            sx={{
              gridTemplateColumns: ['1fr', '1fr', '300px 3fr 1fr'],
              flexGrow: 1,
              gap: [8, 5, 8],
            }}
          >
            <SearchFilterSidebar />

            <Flex
              sx={{
                flex: '1 auto auto',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <Flex sx={{ flexDirection: 'column' }}>
                <Text>Search Results</Text>
              </Flex>

              {error ? (
                <div>There was an error completing your request</div>
              ) : data?.assetGlobalSearch?.assets.length === 0 ? (
                <div>No results available.</div>
              ) : (
                <Flex
                  sx={{
                    flexDirection: 'column',
                    gap: 5,
                    alignItems: isMobile ? 'center' : 'baseline',
                  }}
                >
                  {
                    /* Chunk results into non-wrapping rows. */
                    loading
                      ? loadArr
                          .map((_, i) =>
                            i % chunkSize === 0
                              ? loadArr.slice(i, i + chunkSize)
                              : null
                          )
                          .filter(Boolean)
                          .map((items, idx) => (
                            <Flex key={idx} sx={{ gap: 5 }}>
                              {items?.map((_, idx) => (
                                <BlurrySquareTemplate key={idx} />
                              ))}
                            </Flex>
                          ))
                      : assetArr
                          ?.map((_, i) =>
                            i % chunkSize === 0
                              ? assetArr.slice(i, i + chunkSize)
                              : null
                          )
                          .filter(Boolean)
                          .map((items, idx) => (
                            <Flex key={idx} sx={{ gap: 5 }}>
                              {items?.map(
                                (
                                  {
                                    id,
                                    contractAddress,
                                    previewImageUrl,
                                    mediaUrl,
                                    name,
                                    collection,
                                    tokenId,
                                    lastSale,
                                    rarity,
                                    creatorUsername,
                                    creatorAddress,
                                  },
                                  idx
                                ) => (
                                  <a
                                    key={idx}
                                    onClick={() => handleClickNFT(id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <MiniNftCard
                                      price={
                                        lastSale?.ethSalePrice
                                          ? weiToEth(lastSale.ethSalePrice)
                                          : undefined
                                      }
                                      rarity={
                                        rarity
                                          ? (rarity * 100).toFixed(2) + '%'
                                          : '-'
                                      }
                                      image={previewImageUrl ?? mediaUrl}
                                      creator={
                                        creatorUsername ||
                                        shortenAddress(creatorAddress, 2, 4)
                                      }
                                      pixelated={PIXELATED_CONTRACTS.includes(
                                        contractAddress
                                      )}
                                      type="search"
                                      name={getAssetName(
                                        name,
                                        collection?.name,
                                        tokenId
                                      )}
                                      link={`/analytics/collection/${collection?.id}`}
                                    />
                                  </a>
                                )
                              )}
                            </Flex>
                          ))
                  }
                </Flex>
              )}

              <Flex sx={{ justifyContent: 'center', width: '100%' }}>
                {!!data?.assetGlobalSearch?.count && (
                  <Pagination
                    forcePage={page}
                    pageRangeDisplayed={0}
                    marginPagesDisplayed={isMobile ? 1 : 3}
                    pageCount={Math.ceil(
                      data.assetGlobalSearch.count / (chunkSize * ROW_SIZE)
                    )}
                    onPageChange={handlePageChange}
                  />
                )}
              </Flex>
            </Flex>
          </Grid>
        </Container>
        <Container
          maxBreakpoint="lg"
          sx={{
            flexDirection: 'column',
            gap: 4,
            padding: 4,
          }}
        >
          <Footer />
        </Container>
      </Flex>
    </>
  )
}
