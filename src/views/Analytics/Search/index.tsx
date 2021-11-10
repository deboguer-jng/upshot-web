import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Button, Container, Footer } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import {
  Accordion,
  BlurrySquareTemplate,
  InputRounded,
  Pagination,
} from '@upshot-tech/upshot-ui'
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

import {
  GET_ASSETS_SEARCH,
  GetAssetsSearchData,
  GetAssetsSearchVars,
} from './queries'

export default function SearchView() {
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
    0: 2,
    1: 2,
    2: 3,
    3: 4,
  }

  const chunkSize = chunks[breakpointIndex]
  const loadArr = [...new Array(PAGE_SIZE)]
  const assetArr = data?.assetGlobalSearch?.assets

  const searchFilters = () => {
    return (
      <>
        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 4, 0] }} color="grey-500">
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
            <Text sx={{ paddingTop: [4, 4, 0] }} color="grey-500">
              Keywords
            </Text>
            <InputRounded
              placeholder="Keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </Flex>
        </Box>

        <Box>
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text sx={{ paddingTop: [4, 4, 0] }} color="grey-500">
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
            <Text sx={{ paddingTop: [4, 4, 0] }} color="grey-500">
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
            <Text sx={{ paddingTop: [4, 4, 0] }} color="grey-500">
              Attributes
            </Text>
            <InputRounded
              placeholder="Attributes"
              value={attributes}
              onChange={(e) => setAttributes(e.currentTarget.value)}
            />
          </Flex>
        </Box>

        <Box sx={{ paddingTop: [5, 5, 0] }}>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </Box>
      </>
    )
  }

  const searchResults = () => (
    <>
      <Flex
        paddingX={8}
        sx={{
          position: ['static', 'static', 'static', 'sticky'],
          top: 0,
          alignSelf: 'flex-start',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
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
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  <Text variant="h3Secondary" color="grey-500">
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
        paddingX={[8, 8, 0]}
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
                                rarity={rarity ? rarity.toFixed(2) + '%' : '-'}
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
                                link={`https://app.upshot.io/analytics/collection/${collection?.id}`}
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

  return (
    <>
      <Head>
        <title>Upshot Analytics</title>
      </Head>
      <Flex sx={{ minHeight: '100vh', flexDirection: 'column' }}>
        <Container
          p={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
          }}
        >
          <Nav />
        </Container>
        {!isMobile ? (
          <Grid
            columns={[1, 1, 1, 3]}
            sx={{
              gridTemplateColumns: ['1fr', '1fr', '1fr 3fr', '1fr 3fr 1fr'],
              flexGrow: 1,
              gap: [8, 5, 0],
            }}
          >
            {searchResults()}
          </Grid>
        ) : (
          searchResults()
        )}
        <Container
          p={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Footer />
        </Container>
      </Flex>
    </>
  )
}
