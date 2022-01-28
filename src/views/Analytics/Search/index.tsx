import { useQuery } from '@apollo/client'
import { useBreakpointIndex, useTheme } from '@upshot-tech/upshot-ui'
import { Button, Container } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import {
  Accordion,
  BlurrySquareTemplate,
  InputRounded,
  Pagination,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { parseEthString, weiToEth } from 'utils/number'

import Breadcrumbs from '../components/Breadcrumbs'
import {
  GET_ASSETS_SEARCH,
  GetAssetsSearchData,
  GetAssetsSearchVars,
} from './queries'

enum BREAKPOINT_INDEXES {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6
}

export default function SearchView() {
  const { theme } = useTheme()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const collectionParam = (router.query.collection as string) ?? ''
  const queryParam = (router.query.query as string) ?? ''
  const attributesParam = (router.query.attributes as string) ?? ''

  // @todo Replace these states refs
  const [searchTerm, setSearchTerm] = useState(queryParam)
  const [searchTermApplied, setSearchTermApplied] = useState(queryParam)

  const [tokenId, setTokenId] = useState('')
  const [tokenIdApplied, setTokenIdApplied] = useState('')
  const [attributes, setAttributes] = useState(attributesParam)
  const [attributesApplied, setAttributesApplied] = useState('')

  const [collectionName, setCollectionName] = useState(collectionParam)
  const [collectionNameApplied, setCollectionNameApplied] =
    useState(collectionParam)

  const [minPriceEth, setMinPriceEth] = useState('')
  const [minPriceWei, setMinPriceWei] = useState<string>()

  const [maxPriceEth, setMaxPriceEth] = useState('')
  const [maxPriceWei, setMaxPriceWei] = useState<string>()

  const { loading, error, data } = useQuery<
    GetAssetsSearchData,
    GetAssetsSearchVars
  >(GET_ASSETS_SEARCH, {
    errorPolicy: 'all',
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      searchTerm: searchTermApplied,
      collectionName: collectionNameApplied,
      traits: attributesApplied,
      tokenId: tokenIdApplied,
      minPrice: minPriceWei,
      maxPrice: maxPriceWei,
    },
  })

  useEffect(() => {
    setCollectionName(collectionParam)
    setCollectionNameApplied(collectionParam)
    setSearchTermApplied(queryParam)
    setSearchTerm(queryParam)
    setAttributes(attributesParam)
    setAttributesApplied(
      attributesParam ? JSON.stringify(attributesParam.split(',')) : ''
    )
  }, [collectionParam, queryParam, attributesParam])

  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const handleBlurMinPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value)

    setMinPriceEth(eth || '')
  }

  const handleBlurMaxPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value)

    setMaxPriceEth(eth || '')
  }

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleApplyFilters = () => {
    setSearchTermApplied(searchTerm)
    setCollectionNameApplied(collectionName)
    setTokenIdApplied(tokenId)
    setAttributesApplied(
      attributes ? JSON.stringify(attributes.split(/[ ,]+/)) : ''
    )
    let minPriceWei
    try {
      if (minPriceEth)
        minPriceWei = ethers.utils.parseEther(minPriceEth).toString()
    } catch (err) {}

    let maxPriceWei
    try {
      if (maxPriceEth)
        maxPriceWei = ethers.utils.parseEther(maxPriceEth).toString()
    } catch (err) {}

    setMinPriceWei(minPriceWei)
    setMaxPriceWei(maxPriceWei)
  }

  const handleClickNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  const chunks = {
    [BREAKPOINT_INDEXES.ZERO]: 2,
    [BREAKPOINT_INDEXES.ONE]: 2,
    [BREAKPOINT_INDEXES.TWO]: 2,
    [BREAKPOINT_INDEXES.THREE]: 3,
    [BREAKPOINT_INDEXES.FOUR]: 4,
    [BREAKPOINT_INDEXES.FIVE]: 5,
    [BREAKPOINT_INDEXES.SIX]: 6
  }

  const chunkSize = chunks[breakpointIndex]
  const loadArr = [...new Array(PAGE_SIZE)]
  const assetArr = data?.assetGlobalSearch?.assets

  const searchFilters = () => {
    return (
      <>
        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 0] }} color="grey-500">
              Price Range
            </Text>
            <Flex sx={{ gap: 4 }}>
              <InputRounded
                placeholder="Ξ Min"
                value={minPriceEth}
                onBlur={handleBlurMinPrice}
                onChange={(e) => setMinPriceEth(e.currentTarget.value)}
              />
              <InputRounded
                placeholder="Ξ Max"
                value={maxPriceEth}
                onBlur={handleBlurMaxPrice}
                onChange={(e) => setMaxPriceEth(e.currentTarget.value)}
              />
            </Flex>
          </Flex>
        </Box>

        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 0] }} color="grey-500">
              Collection
            </Text>
            <InputRounded
              placeholder="Collection"
              value={collectionName}
              onChange={(e) => setCollectionName(e.currentTarget.value)}
            />
          </Flex>
        </Box>

        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 0] }} color="grey-500">
              Token ID
            </Text>
            <InputRounded
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.currentTarget.value)}
            />
          </Flex>
        </Box>

        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 0] }} color="grey-500">
              Attributes
            </Text>
            <InputRounded
              placeholder="Attributes"
              value={attributes}
              onChange={(e) => setAttributes(e.currentTarget.value)}
            />
          </Flex>
        </Box>

        <Box sx={{ paddingTop: [5, 0] }}>
          <Button capitalize onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </>
    )
  }

  const searchResults = () => (
    <>
      <Flex
        sx={{
          position: ['static', 'static', 'static', 'sticky'],
          top: 0,
          alignSelf: 'flex-start',
          flexDirection: 'column',
          gap: 5,
          width: '100%',
        }}
      >
        {isMobile ? (
          <>
            <Box>
              <Accordion isDropdown title="Search Filters">
                {searchFilters()}
              </Accordion>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  <Text variant="h2Secondary" color="grey-500">
                    Search Filters
                  </Text>
                </Flex>
              </Flex>
            </Box>
            {searchFilters()}
          </>
        )}
      </Flex>
      <Flex
        sx={{
          flex: '1 auto auto',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Text>Search Results</Text>
          <Text variant="h1Primary">{collectionNameApplied}</Text>
          <Text variant="h2Primary">{searchTermApplied}</Text>
        </Flex>

        {error ? (
          <div>There was an error completing your request</div>
        ) : data?.assetGlobalSearch?.assets.length === 0 ? (
          <div>No results available.</div>
        ) : (
          <Flex sx={{ flexDirection: 'column', gap: 5 }}>
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
                                  rarity ? (rarity * 100).toFixed(2) + '%' : '-'
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

        <Flex sx={{ justifyContent: 'center' }}>
          {!!data?.assetGlobalSearch?.count && (
            <Pagination
              forcePage={page}
              pageCount={Math.ceil(data.assetGlobalSearch.count / PAGE_SIZE)}
              pageRangeDisplayed={0}
              marginPagesDisplayed={0}
              onPageChange={handlePageChange}
            />
          )}
        </Flex>
      </Flex>
    </>
  )

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
        <title>Upshot Analytics</title>
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
          {!isMobile ? (
            <Grid
              columns={[1, 1, 3]}
              sx={{
                gridTemplateColumns: ['1fr', '1fr 3fr', '1fr 4fr 1fr'],
                flexGrow: 1,
                gap: [8, 5, 8],
              }}
            >
              {searchResults()}
            </Grid>
          ) : (
            searchResults()
          )}
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
