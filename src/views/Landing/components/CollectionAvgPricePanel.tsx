import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Flex, Image, Text } from '@upshot-tech/upshot-ui'
import {
  CollectionButton,
  CollectionButtonTemplate,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useRef, useState } from 'react'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTION_AVG_PRICE,
  GetCollectionAvgPriceData,
  GetCollectionAvgPriceVars,
} from '../queries'
import CollectionPanel from './CollectionPanel'

interface CollectionAvgPricePanelProps {
  selectedCollections: number[]
  onCollectionSelected: (id: number) => void
}

export default function CollectionAvgPricePanel({
  onCollectionSelected,
  selectedCollections,
}: CollectionAvgPricePanelProps) {
  const { theme } = useTheme()
  const searchTermRef = useRef<HTMLInputElement | null>(null)
  const [searchTermApplied, setSearchTermApplied] = useState('')
  const selectedCollectionsColors = ['blue', 'pink', 'purple']
  const breakpointIndex = useBreakpointIndex()

  const getColumns = () => {
    if (breakpointIndex < 2) return 1
    if (breakpointIndex < 3) return 2
    return 4
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    setSearchTermApplied(searchTermRef?.current?.value ?? '')
  }

  const { loading, error, data } = useQuery<
    GetCollectionAvgPriceData,
    GetCollectionAvgPriceVars
  >(GET_COLLECTION_AVG_PRICE, {
    errorPolicy: 'all',
    variables: {
      limit: 12,
      metric: 'AVERAGE',
      name: searchTermApplied,
    },
  })

  const title = 'Collection Avg. Price'
  const subtitle = '(Select Collections to change graph)'
  const getCellNumber = (idx: number) => {
    const columns = getColumns()
    const row = Math.ceil(idx / columns)
    const col = idx % columns

    return col * columns + row + 1
  }

  if (error)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        There was an error completing your request.
      </CollectionPanel>
    )

  if (loading)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        {[...new Array(12)].map((_, idx) => (
          <Flex
            key={idx}
            sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
          >
            <Text>{idx + 1}</Text>
            <CollectionButtonTemplate />
          </Flex>
        ))}
      </CollectionPanel>
    )

  if (!data?.orderedCollectionsByMetricSearch.length)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        No results available.
      </CollectionPanel>
    )

  return (
    <CollectionPanel
      inputProps={{
        ref: searchTermRef,
      }}
      onSearch={handleSearch}
      {...{ title, subtitle }}
    >
      {data.orderedCollectionsByMetricSearch.map(
        ({ id, name, imageUrl, average }, idx) => (
          <Flex
            key={idx}
            sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
          >
            <Text>{getCellNumber(idx)}</Text>
            <CollectionButton
              icon={
                <Image
                  alt={`${name} Cover Artwork`}
                  height="100%"
                  width="100%"
                  sx={{ borderRadius: 'circle' }}
                  src={imageUrl}
                />
              }
              onClick={() => onCollectionSelected(id)}
              underglow={
                selectedCollections.includes(id)
                  ? (selectedCollectionsColors[
                      selectedCollections.indexOf(id)
                    ] as keyof typeof theme.colors)
                  : undefined
              }
              text={name ?? 'Unknown'}
              subText={average ? weiToEth(average) : '-'}
            />
          </Flex>
        )
      )}
    </CollectionPanel>
  )
}
