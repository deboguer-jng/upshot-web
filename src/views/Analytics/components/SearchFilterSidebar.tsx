import { useLazyQuery, useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  InputRounded,
  InputRoundedSearch,
  LabelAttribute,
  LabeledSwitch,
  Text,
  transientOptions,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { IconButton, Label as LabelUI } from 'theme-ui'
import { parseEthString } from 'utils/number'

import {
  GET_NAV_BAR_COLLECTIONS,
  GetNavBarCollectionsData,
  GetNavBarCollectionsVars,
} from '../../../graphql/queries'
import {
  GET_COLLECTION_TRAITS,
  GetCollectionTraitsData,
  GetCollectionTraitsVars,
} from '../Collection/queries'

function CollectionNameInput({
  onSelect,
}: {
  onSelect: ({ collectionId: number, collectionName: string }) => void
}) {
  const [nameFilter, setNameFilter] = useState('')

  const [getCollections, { data }] = useLazyQuery<
    GetNavBarCollectionsData,
    GetNavBarCollectionsVars
  >(GET_NAV_BAR_COLLECTIONS)

  const suggestions = useMemo(() => {
    const suggestions = data?.collections?.assetSets ?? []

    return suggestions.filter(({ name }) =>
      name.toLowerCase().includes(nameFilter.toLowerCase())
    )
  }, [data, nameFilter])

  const handleKeyUp = () => {
    if (data?.collections?.assetSets?.length) return

    getCollections({ variables: { limit: 1000 } })
  }

  const handleSelect = ({ id, name }) => {
    setNameFilter('')
    onSelect?.({ collectionId: id, collectionName: name })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!suggestions.length) return
    const { id, name } = suggestions[0]
    setNameFilter('')
    onSelect?.({ collectionId: id, collectionName: name })
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, grow: 1 }}>
      <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        Collection
      </Text>
      <form onSubmit={handleSubmit}>
        <InputRoundedSearch
          fullWidth
          placeholder="Collections"
          onChange={(e) => setNameFilter(e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          onSuggestionSelect={handleSelect}
          {...{ suggestions }}
        />
      </form>
    </Flex>
  )
}

function TokenIdInput({ defaultValue, onBlur, onSubmit }) {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, grow: 1 }}>
      <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        Token ID
      </Text>
      <InputRoundedSearch
        fullWidth
        sx={{
          borderRadius: '10px',
        }}
        placeholder="Token ID"
        onKeyPress={(e) => {
          if (e.key === 'Enter') onSubmit?.(e.currentTarget.value)
        }}
        {...{ defaultValue, onBlur }}
      />
    </Flex>
  )
}

function priceKeyPress(minPriceEth, maxPriceEth, e, onSubmit) {
  if (e.key === 'Enter') {
    let minPriceWei
    let maxPriceWei

    if (minPriceEth) {
      try {
        minPriceWei = ethers.utils.parseEther(minPriceEth).toString()
        if (minPriceWei === '0') minPriceWei = undefined
      } catch (err) {
        console.warn(err)
      }
    }

    if (maxPriceEth) {
      try {
        maxPriceWei = ethers.utils.parseEther(maxPriceEth).toString()
        if (maxPriceWei === '0') maxPriceWei = undefined
      } catch (err) {
        console.warn(err)
      }
    }

    onSubmit?.(minPriceWei, maxPriceWei)
  }
}

function PriceInput({
  minPrice,
  maxPrice,
  listedOnly,
  onChangeMin,
  onChangeMax,
  onSubmit,
  onToggleListed,
}) {
  const [minPriceEth, setMinPriceEth] = useState<string>()
  const [maxPriceEth, setMaxPriceEth] = useState<string>()

  useEffect(() => {
    try {
      setMinPriceEth(minPrice ? ethers.utils.formatEther(minPrice) : undefined)
    } catch (err) {
      console.error(err)
    }
  }, [minPrice])

  useEffect(() => {
    try {
      setMaxPriceEth(maxPrice ? ethers.utils.formatEther(maxPrice) : undefined)
    } catch (err) {
      console.error(err)
    }
  }, [maxPrice])

  const handleBlurMinPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value, 2)

    setMinPriceEth(eth || '')
    if (!Number.isNaN(Number(eth)))
      onChangeMin(ethers.utils.parseEther(eth).toString())
  }

  const handleBlurMaxPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value, 2)

    setMaxPriceEth(eth || '')
    if (!Number.isNaN(Number(eth)))
      onChangeMax(ethers.utils.parseEther(eth).toString())
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        Listings
      </Text>
      <LabelUI sx={{ alignItems: 'center', marginBottom: 2 }}>
        <Checkbox
          readOnly
          checked={listedOnly}
          sx={{ cursor: 'pointer' }}
          onClick={() => onToggleListed(!listedOnly)}
        />
        <Text color="grey-500">Show only listed assets</Text>
      </LabelUI>
      {listedOnly && (
        <>
          <Text color="grey-500" sx={{ fontSize: 2, fontWeight: 'bold' }}>
            Price Range
          </Text>
          <Flex sx={{ gap: 4 }}>
            <InputRounded
              placeholder="Ξ Min"
              value={minPriceEth}
              onBlur={handleBlurMinPrice}
              onChange={(e) => setMinPriceEth(e.currentTarget.value)}
              onKeyPress={(e) =>
                priceKeyPress(e.currentTarget.value, maxPriceEth, e, onSubmit)
              }
            />
            <InputRounded
              placeholder="Ξ Max"
              value={maxPriceEth}
              onBlur={handleBlurMaxPrice}
              onChange={(e) => setMaxPriceEth(e.currentTarget.value)}
              onKeyPress={(e) =>
                priceKeyPress(minPriceEth, e.currentTarget.value, e, onSubmit)
              }
            />
          </Flex>
        </>
      )}
    </Flex>
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
      suggestions={value ? suggestionsFiltered : []}
      onChange={handleChange}
      onSuggestionSelect={({ id, name, traitType }) => {
        setValue('')
        onSuggestionSelect?.(id, name, traitType)
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && suggestionsFiltered.length > 0) {
          setValue('')
          const { id, name, traitType } = suggestionsFiltered[0]
          onSuggestionSelect?.(id, name, traitType)
          setSuggestionsFiltered(suggestions)
        }
      }}
      {...{ value }}
    />
  )
}

const TraitList = styled('div', transientOptions)<{ $isExpanded?: boolean }>`
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
  rarity,
}: {
  children: React.ReactNode
  onToggleSelection: () => void
  selected: boolean
  rarity?: number
}) {
  return (
    <LabelAttribute
      onClick={onToggleSelection}
      transparent={!selected}
      variant={rarity ? 'percentage' : 'regular'}
      percentage={rarity ? (100 - rarity * 100).toFixed(2).toString() : ''}
      style={{
        cursor: 'pointer',
        textTransform: 'capitalize',
        maxWidth: '276px',
      }}
    >
      {children}
    </LabelAttribute>
  )
}

function TraitCategoryList({
  traitType,
  traits,
  traitIds,
  onToggleSelection,
}: {
  traitType: string
  traits: { id: number; value: string; rarity: number }[]
  onToggleSelection: (
    id: number,
    value?: string,
    traitType?: string,
    rarity?: number
  ) => void
  traitIds: number[]
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
          width: '100%',
          minWidth: '300px',
          backgroundColor: 'grey-800',
          padding: '10px 12px;',
          borderRadius: '10px',
          minHeight: '54px',
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
        {traits.map(({ id, value, rarity }, idx) => (
          <TraitCategoryItem
            selected={traitIds.includes(id)}
            onToggleSelection={() => {
              onToggleSelection(id, value, traitType)
            }}
            key={idx}
            rarity={rarity}
          >
            {value}
          </TraitCategoryItem>
        ))}
      </TraitList>
    </>
  )
}

export default function SearchFilterSidebar({
  collectionId: defaultCollectionId,
  open,
  onOpenSidebar,
  onApply,
  onHideFilters,
}: {
  collectionId?: number
  open?: boolean
  onOpenSidebar?: () => void
  onApply?: ({ query }) => void
  onHideFilters?: () => void
}) {
  const { theme } = useTheme()
  const router = useRouter()
  const [collectionId, setCollectionId] = useState<number>()
  const [tokenId, setTokenId] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [traitANDMatch, setTraitANDMatch] = useState(false)
  const [traitIds, setTraitIds] = useState<number[]>([])
  const [listedOnly, setListedOnly] = useState(true)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 2

  useEffect(() => {
    if (!router?.query?.id) return

    const collId = router.query.id ? Number(router.query.id) : undefined
    setCollectionId(collId || defaultCollectionId)

    const tokenId = router.query.tokenId as string
    setTokenId(tokenId)

    const minPrice = router.query.minPrice as string
    setMinPrice(minPrice)

    const maxPrice = router.query.maxPrice as string
    setMaxPrice(maxPrice)

    if (router.query.traitANDMatch) {
      const traitANDMatch = router.query.traitANDMatch === 'true'
      setTraitANDMatch(traitANDMatch)
    }

    if (router.query.listedOnly) {
      const listedOnly = router.query.listedOnly != 'false'
      setListedOnly(listedOnly)
    }

    const traitIds = [router.query?.traits ?? []]
      .flat()
      .map((val) => Number(val))
    setTraitIds(traitIds)
  }, [router.query, defaultCollectionId])

  const { data } = useQuery<GetCollectionTraitsData, GetCollectionTraitsVars>(
    GET_COLLECTION_TRAITS,
    {
      errorPolicy: 'all',
      variables: { id: collectionId },
      skip: !collectionId,
    }
  )

  const traitGroups = data?.collectionById?.traitGroups ?? []

  const traits =
    data?.collectionById?.traitGroups
      ?.map(({ traitType, traits }) =>
        traits.map(({ value: name, id, rarity }) => ({
          name,
          id,
          traitType,
          rarity,
        }))
      )
      .flat() ?? []

  const traitsLUT = Object.fromEntries(
    traits.map(({ id, name, traitType, rarity }) => [
      id,
      { name, traitType, rarity },
    ])
  )

  const handleApplyFilters = (query = {}) => {
    onApply?.({
      query: {
        traits: traitIds,
        collectionId,
        minPrice,
        maxPrice,
        tokenId,
        traitANDMatch,
        listedOnly,
        ...query,
      },
    })
  }

  const toggleTraitSelection = (id: number) => {
    const selection = traitIds.includes(id)
      ? traitIds.filter((traitId) => traitId !== id)
      : [...traitIds, id]
    setTraitIds(selection)

    handleApplyFilters({ traits: selection })
  }

  const formatTraitLabel = ({ name, traitType }) => {
    if (
      ['true', 'false'].includes(name.toLowerCase()) ||
      !Number.isNaN(Number(name))
    ) {
      return `${traitType}: ${name}`
    }
    return name
  }

  const handleApplyFiltersClick = () => {
    handleApplyFilters()
    onHideFilters?.()
  }

  return (
    <>
      {!isMobile && (
        <Flex
          sx={{
            alignItems: 'center',
            gap: 4,
            position: ['static', 'static', 'sticky', 'sticky'],
            height: 'min-content',
            width: '100%',
            top: '0px',
            backgroundColor: 'black',
            zIndex: '20',
            padding: '10px 0',
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              padding: '25px',
              borderRadius: '10px',
              backgroundColor: `${theme.rawColors['grey-800']}`,
            }}
          >
            <Icon icon="filter" size={24} color="white" />
          </IconButton>
          <Flex sx={{ alignItems: 'center' }}>
            <Text
              color="white"
              sx={{
                whiteSpace: 'nowrap',
                position: 'absolute',
                pointerEvents: 'none',
                fontSize: 4,
                fontWeight: 'bold',
                opacity: open ? 1 : 0,
                transition: 'default',
              }}
            >
              Search Filters
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex
        sx={{
          maxWidth: ['100%', '100%', '100%', open ? 316 : 0],
          overflowY: ['auto', 'auto', 'auto', open ? 'auto' : 'hidden'],
          overflowX: 'hidden',
          opacity: [1, 1, 1, open ? 1 : 0],
          flexDirection: 'column',
          paddingRight: open ? '8px' : 0,
          gap: 8,
          width: ['100%', '100%', '100%', 'auto'],
          height: ['auto', 'auto', 'auto', '100%'],
          transform: [
            'none',
            'none',
            'none',
            `translateX(${open ? 0 : '-316px'})`,
          ],
          transition: 'default',
        }}
        css={theme.scroll.thin}
      >
        {!!collectionId ? (
          <>
            <PriceInput
              onToggleListed={() => {
                handleApplyFilters({ listedOnly: !listedOnly })
                setListedOnly(!listedOnly)
              }}
              onChangeMin={(minPrice: string) => setMinPrice(minPrice)}
              onChangeMax={(maxPrice: string) => setMaxPrice(maxPrice)}
              onSubmit={(minPrice: string, maxPrice: string) => {
                handleApplyFilters({ minPrice, maxPrice })
              }}
              {...{ listedOnly, minPrice, maxPrice }}
            />

            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
                {`${name} Attributes`}
              </Text>

              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                <Box
                  sx={{
                    margin: '0 auto',
                    width: '95%',
                  }}
                >
                  <LabeledSwitch
                    on={traitANDMatch}
                    onToggle={() => {
                      handleApplyFilters({ traitANDMatch: !traitANDMatch })
                      setTraitANDMatch(!traitANDMatch)
                    }}
                    labelOff="Contains any"
                    labelOn="Contains all"
                  />
                </Box>

                <AttributeSearch
                  suggestions={traits}
                  onSuggestionSelect={toggleTraitSelection}
                />

                <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                  {traitIds
                    .filter((id) => id in traitsLUT)
                    .map((id, idx) => (
                      <LabelAttribute
                        variant="removeable"
                        key={idx}
                        onRemove={() => toggleTraitSelection(Number(id))}
                      >
                        {formatTraitLabel(traitsLUT[id])}
                      </LabelAttribute>
                    ))}
                </Flex>

                <Box>
                  <Flex
                    sx={{
                      display: 'inline-flex',
                      gap: 1,
                      flexDirection: 'column',
                    }}
                  >
                    {traitGroups.map(({ traitType, traits }, idx) => (
                      <TraitCategoryList
                        {...{ traitType, traits, traitIds }}
                        onToggleSelection={toggleTraitSelection}
                        key={idx}
                      />
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <CollectionNameInput onSelect={handleApplyFilters} />
          </>
        )}

        {isMobile && (
          <Flex sx={{ justifyContent: 'flex-end', py: 2 }}>
            <Button capitalize onClick={handleApplyFiltersClick}>
              Apply Filters
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  )
}
