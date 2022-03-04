/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  imageOptimizer,
  theme,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import {
  Button,
  Container,
  Flex,
  Grid,
  InputRounded,
  Label,
  LabelAttribute,
  LabeledSwitch,
} from '@upshot-tech/upshot-ui'
import { Avatar, Icon, InputRoundedSearch, Text } from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Box } from 'theme-ui'
import { parseEthString, weiToEth } from 'utils/number'
import CollectionScatterChart from 'views/Analytics/components/CollectionScatterChart'
import ExplorePanel from 'views/Analytics/components/ExplorePanel'
import TopSellingNFTs from 'views/Analytics/components/TopSellingNFTs'

import Breadcrumbs from '../components/Breadcrumbs'
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
        padding: '8px 16px',
        textAlign: 'center',
        color,
      }}
    >
      {currencySymbol !== '' && (
        <Label
          currencySymbol={currencySymbol}
          variant="currency"
          color={color}
          style={{
            fontWeight: 700,
          }}
        >
          {value}
        </Label>
      )}
      {currencySymbol === '' && value}

      <Text variant="small">{label}</Text>
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
          content="https://upshot.io/img/opengraph/opengraph_collection.jpg"
        />
      </Head>
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

const TraitList = styled.div<{ $isExpanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2] + 'px'};
  max-height: ${({ $isExpanded }) => ($isExpanded ? '200px' : 0)};
  overflow-y: auto;
  transition: ${({ theme }) => theme.transitions.default};
  padding-right: ${({ theme }) => theme.space[4] + 'px'};
  ${({ theme: { scroll } }) => scroll.thin}
`

function TraitCategoryItem({
  children,
  onToggleSelection,
  selected,
}: {
  children: React.ReactNode
  onToggleSelection: () => void
  selected: boolean
}) {
  return (
    <LabelAttribute
      onClick={onToggleSelection}
      transparent={!selected}
      sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
    >
      {children}
    </LabelAttribute>
  )
}

function TraitCategoryList({
  traitType,
  traits,
  selectedTraits,
  onToggleSelection,
}: {
  traitType: string
  traits: { id: number; value: string }[]
  onToggleSelection: (id: number, value?: string, traitType?: string) => void
  selectedTraits: { [id: number]: { value: string; traitType: string } }
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          cursor: 'pointer',
          width: 300,
        }}
        onClick={() => setOpen(!open)}
      >
        <Text
          color="blue"
          sx={{
            fontSize: 3,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textTransform: 'capitalize',
          }}
        >
          {traitType}
        </Text>
        <Icon
          color="blue"
          icon={open ? 'arrowUp' : 'arrowDropdown'}
          size={12}
        />
      </Flex>
      <TraitList $isExpanded={open}>
        {traits.map(({ id, value }, idx) => (
          <TraitCategoryItem
            selected={id in selectedTraits}
            onToggleSelection={() => {
              onToggleSelection(id, value, traitType)
            }}
            key={idx}
          >
            {value}
          </TraitCategoryItem>
        ))}
      </TraitList>
    </>
  )
}

function AttributeSearch({ suggestions, onSuggestionSelect }) {
  const [value, setValue] = useState('')
  const [suggestionsFiltered, setSuggestionsFiltered] = useState(
    suggestions ?? []
  )

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
    setSuggestionsFiltered(
      suggestions.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  return (
    <InputRoundedSearch
      fullWidth
      placeholder="Press ↩ to add attributes"
      suggestions={suggestionsFiltered}
      onChange={handleChange}
      onSuggestionSelect={({ id, name, traitType }) => {
        setValue('')
        onSuggestionSelect?.(id, name, traitType)
      }}
      {...{ value }}
    />
  )
}

export default function CollectionView() {
  const [id, setId] = useState<number>()
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()

  const [traitANDMatch, setTraitANDMatch] = useState(false)

  const [minPriceEth, setMinPriceEth] = useState('')
  const [minPriceWei, setMinPriceWei] = useState<string>()

  const [maxPriceEth, setMaxPriceEth] = useState('')
  const [maxPriceWei, setMaxPriceWei] = useState<string>()

  const [selectedTraits, setSelectedTraits] = useState({})

  const handleBlurMinPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value)

    setMinPriceEth(eth || '')
  }

  const handleBlurMaxPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value)

    setMaxPriceEth(eth || '')
  }

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

  useEffect(() => {
    if (data?.collectionById && data?.collectionById.name) {
      const storage = globalThis?.sessionStorage
      const curPath = storage.getItem('currentPath')
      if (curPath?.indexOf('collectionName=') === -1)
        storage.setItem(
          'currentPath',
          `${curPath}?collectionName=${data?.collectionById.name}`
        )
    }
  }, [data?.collectionById])

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
        <Container
          sx={{
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          Loading...
        </Container>
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

  const {
    name,
    description,
    imageUrl,
    isAppraised,
    size,
    latestStats,
    traitGroups,
  } = data.collectionById

  const traits = data?.collectionById?.traitGroups
    ?.map(({ traitType, traits }) =>
      traits.map(({ value: name, id }) => ({ name, id, traitType }))
    )
    .flat()

  const toggleTraitSelection = (
    id: number,
    value?: string,
    traitType?: string
  ) => {
    const updatedTraits = { ...selectedTraits }
    selectedTraits[id]
      ? delete updatedTraits[id]
      : (updatedTraits[id] = { value, traitType })
    setSelectedTraits(updatedTraits)
  }

  return (
    <Layout>
      <Flex
        sx={{ flexDirection: ['column', 'column', 'column', 'row'], gap: 4 }}
      >
        <Flex sx={{ minWidth: 300, flexDirection: 'column', gap: 8 }}>
          <Flex sx={{ alignItems: 'center', gap: 4 }}>
            <Icon icon="filter" size={24} color="white" />
            <Text color="white" sx={{ fontSize: 4, fontWeight: 'bold' }}>
              Search Filters
            </Text>
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 2, grow: 1 }}>
            <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
              Token ID
            </Text>
            <InputRoundedSearch fullWidth placeholder="Token ID" />
          </Flex>

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
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

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
              {name} Attributes
            </Text>

            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <LabeledSwitch
                on={traitANDMatch}
                onToggle={() => setTraitANDMatch(!traitANDMatch)}
                labelOff="Contains any"
                labelOn="Contains all"
              />

              <AttributeSearch
                suggestions={traits}
                onSuggestionSelect={toggleTraitSelection}
              />

              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                {Object.keys(selectedTraits).map((id, idx) => (
                  <LabelAttribute
                    variant="removeable"
                    key={idx}
                    expanded
                    expandedText={selectedTraits[id].traitType}
                    onRemove={() => toggleTraitSelection(Number(id))}
                  >
                    {selectedTraits[id].value}
                  </LabelAttribute>
                ))}
              </Flex>

              <Box>
                <Flex
                  sx={{
                    display: 'inline-flex',
                    gap: 4,
                    flexDirection: 'column',
                  }}
                >
                  {traitGroups.map(({ traitType, traits }, idx) => (
                    <TraitCategoryList
                      {...{ traitType, traits, selectedTraits }}
                      onToggleSelection={toggleTraitSelection}
                      key={idx}
                    />
                  ))}
                </Flex>
              </Box>
            </Flex>
          </Flex>

          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Button capitalize onClick={() => {}}>
              Apply Filters
            </Button>
          </Flex>
        </Flex>
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <Grid columns={['1fr', '1fr', '1fr 1fr']} sx={{ gap: '40px' }}>
            <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
              <Flex sx={{ gap: 6, height: 100, alignItems: 'center' }}>
                <Box
                  sx={{
                    backgroundColor: '#231F20',
                    minWidth: '63px',
                    padding: isMobile ? '4px' : '8px',
                    borderRadius: '50%',

                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    size="xl"
                    sx={{
                      width: isMobile ? '55px' : '100px',
                      height: isMobile ? '55px' : '100px',
                      minWidth: 'unset',
                    }}
                    src={
                      imageOptimizer(imageUrl, {
                        width: parseInt(theme.images.avatar.xl.size),
                        height: parseInt(theme.images.avatar.xl.size),
                      }) ?? imageUrl
                    }
                  />
                </Box>
                <Flex sx={{ flexDirection: 'column' }}>
                  <Text variant="h1Secondary" sx={{ lineHeight: '2rem' }}>
                    {name}
                  </Text>
                  <Text
                    color="grey"
                    variant="h4Primary"
                    sx={{
                      fontWeight: 700,
                      marginTop: '2px',
                    }}
                  >
                    Collection
                  </Text>
                </Flex>
              </Flex>
              <Text
                variant="large"
                sx={{ textTransform: 'uppercase', fontWeight: 400 }}
              >
                General Stats
              </Text>
              {isAppraised && (
                <a
                  href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
                  target="_blank"
                  sx={{ textDecoration: 'none' }}
                  rel="noreferrer"
                >
                  <Box
                    sx={{
                      cursor: 'pointer',
                      width: '100%',
                      borderRadius: '10px',
                      color: theme.colors.primary,
                      border: '1px solid',
                      padding: '10px',
                      borderColor: theme.colors.primary,
                      textDecoration: 'none',
                      fontSize: '12px',
                      '&:hover': {
                        background: theme.colors['grey-800'],
                      },
                    }}
                  >
                    How do we develop our appraisals? Read article to learn
                    more.
                  </Box>
                </a>
              )}
              <Grid
                columns="repeat(auto-fit, minmax(140px, 1fr))"
                sx={{ gap: 4 }}
              >
                <CollectionStat
                  color="blue"
                  value={
                    latestStats?.average
                      ? weiToEth(latestStats?.average, 4, false)
                      : '-'
                  }
                  currencySymbol="Ξ"
                  label="Average Price"
                />
                <CollectionStat
                  color="pink"
                  value={
                    latestStats?.floor
                      ? weiToEth(latestStats?.floor, 4, false)
                      : '-'
                  }
                  currencySymbol="Ξ"
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
                    latestStats?.marketCap
                      ? weiToEth(latestStats?.marketCap, 4, false)
                      : '-'
                  }
                  currencySymbol="Ξ"
                  label="Market Cap"
                />
                <CollectionStat
                  value={
                    latestStats?.pastWeekWeiVolume
                      ? weiToEth(latestStats?.pastWeekWeiVolume, 4, false)
                      : '-'
                  }
                  currencySymbol="Ξ"
                  label="Weekly Volume"
                />
                <CollectionStat value={size} label="NFTs in Collection" />
              </Grid>
            </Flex>
            <Flex
              sx={{ flexDirection: 'column', paddingTop: isMobile ? 0 : 116 }}
            >
              {description && (
                <Text variant="large" sx={{ textTransform: 'uppercase' }}>
                  About
                </Text>
              )}
              <Text
                color="grey-300"
                onClick={() => {
                  setDescriptionOpen(!descriptionOpen)
                }}
                sx={{
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  height: descriptionOpen ? 'auto' : '150px',
                  WebkitLineClamp: !descriptionOpen ? 6 : 'none',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  '& a': { color: 'white' },
                }}
              >
                {(
                  <ReactMarkdown allowedElements={['a', 'p']}>
                    {description}
                  </ReactMarkdown>
                ) ?? 'No information.'}
              </Text>
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

          <ExplorePanel collectionId={id} collectionName={name} />
        </Flex>
      </Flex>
    </Layout>
  )
}
