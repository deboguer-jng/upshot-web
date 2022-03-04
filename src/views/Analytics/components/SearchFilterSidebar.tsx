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
import { useState } from 'react'
import { parseEthString } from 'utils/number'

import {
  GET_COLLECTION_TRAITS,
  GetCollectionTraitsData,
  GetCollectionTraitsVars,
} from '../Collection/queries'

function TokenIdInput({ onBlur }) {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, grow: 1 }}>
      <Text color="grey-500" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        Token ID
      </Text>
      <InputRoundedSearch fullWidth placeholder="Token ID" {...{ onBlur }} />
    </Flex>
  )
}

function PriceInput({ onChangeMin, onChangeMax }) {
  const [minPriceEth, setMinPriceEth] = useState('')
  const [minPriceWei, setMinPriceWei] = useState<string>()

  const [maxPriceEth, setMaxPriceEth] = useState('')
  const [maxPriceWei, setMaxPriceWei] = useState<string>()

  const handleBlurMinPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value, 2)

    setMinPriceEth(eth || '')
    if (eth) setMinPriceWei(ethers.utils.parseEther(eth).toString())
    onChangeMin(minPriceWei)
  }

  const handleBlurMaxPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const eth = parseEthString(e.currentTarget.value, 2)

    setMaxPriceEth(eth || '')
    if (eth) setMaxPriceWei(ethers.utils.parseEther(eth).toString())
    onChangeMax(maxPriceWei)
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
        />
        <InputRounded
          placeholder="Ξ Max"
          value={maxPriceEth}
          onBlur={handleBlurMaxPrice}
          onChange={(e) => setMaxPriceEth(e.currentTarget.value)}
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
      style={{ cursor: 'pointer', textTransform: 'capitalize' }}
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

export default function SearchFilters({ id }: { id?: number }) {
  const [tokenId, setTokenId] = useState('')
  const [minPriceWei, setMinPriceWei] = useState('')
  const [maxPriceWei, setMaxPriceWei] = useState('')
  const [traitANDMatch, setTraitANDMatch] = useState(false)
  const [selectedTraits, setSelectedTraits] = useState({})

  const { data } = useQuery<GetCollectionTraitsData, GetCollectionTraitsVars>(
    GET_COLLECTION_TRAITS,
    {
      errorPolicy: 'all',
      variables: { id },
      skip: !id,
    }
  )

  const traitGroups = data?.collectionById?.traitGroups ?? []

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

  const handleApplyFilters = () => {
    const traits = Object.keys(selectedTraits)

    console.log({ traits, minPriceWei, maxPriceWei, tokenId, traitANDMatch })
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
        onBlur={(e: React.KeyboardEvent<HTMLInputElement>) =>
          setTokenId(e.currentTarget.value)
        }
      />

      <PriceInput
        onChangeMin={(minPriceWei: string) => setMinPriceWei(minPriceWei)}
        onChangeMax={(maxPriceWei: string) => setMaxPriceWei(maxPriceWei)}
      />

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
        <Button capitalize onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Flex>
    </Flex>
  )
}
