import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Button, Container, Footer } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import {
  BlurrySquareTemplate,
  InputRounded,
  Pagination,
} from '@upshot-tech/upshot-ui'
import { Nav } from 'components/Nav'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { parseEthString, weiToEth } from 'utils/number'

import {
  GET_ASSETS_SEARCH,
  GetAssetsSearchData,
  GetAssetsSearchVars,
} from './queries'

export default function SearchView() {
  const router = useRouter()
  const [page, setPage] = useState(0)

  // @todo Replace these states refs
  const [searchTerm, setSearchTerm] = useState(
    (router.query.query as string) ?? ''
  )
  const [searchTermApplied, setSearchTermApplied] = useState(
    (router.query.query as string) ?? ''
  )

  const [tokenId, setTokenId] = useState('')
  const [tokenIdApplied, setTokenIdApplied] = useState('')
  const [attributes, setAttributes] = useState('')
  const [attributesApplied, setAttributesApplied] = useState('')

  const [collectionName, setCollectionName] = useState(
    (router.query.collection as string) ?? ''
  )
  const [collectionNameApplied, setCollectionNameApplied] = useState(
    (router.query.collection as string) ?? ''
  )

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
      attributes ? JSON.stringify(attributes.split(/\s+/)) : ''
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
    router.push('/nft/' + id)
  }

  return (
    <>
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Nav />
      </Container>

      <Grid
        columns={[1, 1, 1, 3]}
        sx={{
          gridTemplateColumns: ['1fr', '1fr', '1fr 3fr', '1fr 3fr 1fr'],
        }}
      >
        <Flex
          paddingX={8}
          sx={{
            position: ['static', 'static', 'static', 'sticky'],
            top: 0,
            alignSelf: 'flex-start',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                <Text variant="h3Secondary" color="grey-500">
                  Search Filters
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Text color="grey-500">Pricing Range (min - max)</Text>
              <Flex sx={{ gap: 4 }}>
                <InputRounded
                  placeholder="Ξ Min"
                  sx={{ maxWidth: 128 }}
                  value={minPriceEth}
                  onBlur={handleBlurMinPrice}
                  onChange={(e) => setMinPriceEth(e.currentTarget.value)}
                />
                <InputRounded
                  placeholder="Ξ Max"
                  sx={{ maxWidth: 128 }}
                  value={maxPriceEth}
                  onBlur={handleBlurMaxPrice}
                  onChange={(e) => setMaxPriceEth(e.currentTarget.value)}
                />
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Text variant="h3Secondary" color="grey-500">
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
              <Text variant="h3Secondary" color="grey-500">
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
              <Text variant="h3Secondary" color="grey-500">
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
              <Text variant="h3Secondary" color="grey-500">
                Attributes
              </Text>
              <InputRounded
                placeholder="Search attributes"
                value={attributes}
                onChange={(e) => setAttributes(e.currentTarget.value)}
              />
            </Flex>
          </Box>

          <Box>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </Box>
        </Flex>
        <Flex
          paddingX={8}
          sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 4 }}
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
            <Grid
              gap={5}
              sx={{
                gridTemplateColumns: 'repeat(auto-fill, 156px)',
              }}
            >
              {loading
                ? [...new Array(10)].map((_, idx) => (
                    <BlurrySquareTemplate key={idx} />
                  ))
                : data?.assetGlobalSearch?.assets.map(
                    (
                      {
                        id,
                        contractAddress,
                        previewImageUrl,
                        mediaUrl,
                        name,
                        lastSale,
                        rarity,
                        creatorUsername,
                        creatorAddress,
                      },
                      key
                    ) => (
                      <a
                        key={key}
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
                          {...{ name }}
                        />
                      </a>
                    )
                  )}
            </Grid>
          )}

          <Flex sx={{ justifyContent: 'center' }}>
            {!!data?.assetGlobalSearch?.count && (
              <Pagination
                forcePage={page}
                pageCount={Math.ceil(data.assetGlobalSearch.count / PAGE_SIZE)}
                pageRangeDisplayed={isMobile ? 3 : 5}
                marginPagesDisplayed={isMobile ? 1 : 5}
                onPageChange={handlePageChange}
              />
            )}
          </Flex>
        </Flex>
      </Grid>

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
    </>
  )
}
