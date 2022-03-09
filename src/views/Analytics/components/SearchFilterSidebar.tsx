import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Button,
  Flex,
  Icon,
  InputRounded,
  InputRoundedSearch,
  LabelAttribute,
  LabeledSwitch,
  Text,
} from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { parseEthString } from 'utils/number'

import {
  GET_COLLECTION_TRAITS,
  GetCollectionTraitsData,
  GetCollectionTraitsVars,
} from '../Collection/queries'

function TokenIdInput({ defaultValue, onBlur, onSubmit }) {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, grow: 1 }}>
      <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        Token ID
      </Text>
      <InputRoundedSearch
        fullWidth
        placeholder="Token ID"
        onKeyPress={(e) => {
          if (e.key === 'Enter') onSubmit?.(e.currentTarget.value)
        }}
        {...{ defaultValue, onBlur }}
      />
    </Flex>
  )
}

function PriceInput({
  minPrice,
  maxPrice,
  onChangeMin,
  onChangeMax,
  onSubmit,
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const minPriceWei = ethers.utils
                .parseEther(e.currentTarget.value ?? '0')
                .toString()
              const maxPriceWei = ethers.utils.parseEther(maxPriceEth ?? '0')
              onSubmit?.(minPriceWei, maxPriceWei)
            }
          }}
        />
        <InputRounded
          placeholder="Ξ Max"
          value={maxPriceEth}
          onBlur={handleBlurMaxPrice}
          onChange={(e) => setMaxPriceEth(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const minPriceWei = ethers.utils.parseEther(minPriceEth ?? '0')
              const maxPriceWei = ethers.utils
                .parseEther(e.currentTarget.value ?? '0')
                .toString()

              onSubmit?.(minPriceWei, maxPriceWei)
            }
          }}
        />
      </Flex>
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
      style={{ cursor: 'pointer', textTransform: 'capitalize' }}
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
  collectionName: defaultCollectionName,
}: {
  collectionId?: number
  collectionName?: string
}) {
  const router = useRouter()
  const [collectionId, setCollectionId] = useState(defaultCollectionId)
  const [collectionName, setCollectionName] = useState(defaultCollectionName)
  const [tokenId, setTokenId] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [traitANDMatch, setTraitANDMatch] = useState(false)
  const [traitIds, setTraitIds] = useState<number[]>([])

  useEffect(() => {
    if (!router.query) return

    const collectionId = router.query.collectionId
      ? Number(router.query.collectionId)
      : undefined
    if (!defaultCollectionId) setCollectionId(collectionId)

    const collectionName = router.query.collectionName as string
    if (!defaultCollectionName) setCollectionName(collectionName)

    const tokenId = router.query.tokenId as string
    setTokenId(tokenId)

    const minPrice = router.query.minPrice as string
    setMinPrice(minPrice)

    const maxPrice = router.query.maxPrice as string
    setMaxPrice(maxPrice)

    const traitANDMatch = router.query.traitANDMatch === 'true'
    setTraitANDMatch(traitANDMatch)

    const traitIds = [router.query?.traits ?? []]
      .flat()
      .map((val) => Number(val))
    setTraitIds(traitIds)
  }, [router.query, defaultCollectionId, defaultCollectionName])

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
    router.push({
      pathname: '/analytics/search',
      query: {
        traits: traitIds,
        collectionId,
        collectionName,
        minPrice,
        maxPrice,
        tokenId,
        traitANDMatch,
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

  return (
    <Flex sx={{ minWidth: 300, flexDirection: 'column', gap: 8 }}>
      <Flex sx={{ alignItems: 'center', gap: 4 }}>
        <Icon icon="filter" size={24} color="white" />
        <Text color="white" sx={{ fontSize: 4, fontWeight: 'bold' }}>
          Search Filters
        </Text>
      </Flex>

      <TokenIdInput
        defaultValue={tokenId}
        key={tokenId}
        onBlur={(e: React.KeyboardEvent<HTMLInputElement>) =>
          setTokenId(e.currentTarget.value)
        }
        onSubmit={(tokenId) => {
          handleApplyFilters({ tokenId })
        }}
      />

      <PriceInput
        onChangeMin={(minPrice: string) => setMinPrice(minPrice)}
        onChangeMax={(maxPrice: string) => setMaxPrice(maxPrice)}
        onSubmit={(minPrice, maxPrice) => {
          handleApplyFilters({ minPrice, maxPrice })
        }}
        {...{ minPrice, maxPrice }}
      />

      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
          {name} Attributes
        </Text>

        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <LabeledSwitch
            on={traitANDMatch}
            onToggle={() => {
              handleApplyFilters({ traitANDMatch: !traitANDMatch })
              setTraitANDMatch(!traitANDMatch)
            }}
            labelOff="Contains any"
            labelOn="Contains all"
          />

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
                  expanded
                  expandedText={traitsLUT[id].traitType}
                  onRemove={() => toggleTraitSelection(Number(id))}
                >
                  {traitsLUT[id].name}
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
                  {...{ traitType, traits, traitIds }}
                  onToggleSelection={toggleTraitSelection}
                  key={idx}
                />
              ))}
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <Flex sx={{ justifyContent: 'flex-end' }}>
        <Button capitalize onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Flex>
    </Flex>
  )
}
