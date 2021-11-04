/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Flex, Image, Text } from '@upshot-tech/upshot-ui'
import {
  CollectionButton,
  CollectionButtonTemplate,
  useTheme,
  Box,
  Icon,
} from '@upshot-tech/upshot-ui'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTION_AVG_PRICE,
  GetCollectionAvgPriceData,
  GetCollectionAvgPriceVars,
} from '../queries'
import { METRIC } from './ButtonTabs'
import CollectionPanel from './CollectionPanel'

interface CollectionAvgPricePanelProps {
  selectedCollections: number[]
  onCollectionSelected: (id: number) => void
  metric: METRIC
  setSelectedCollections: (collections: number[]) => void
}

export default function CollectionAvgPricePanel({
  onCollectionSelected,
  selectedCollections,
  metric,
  setSelectedCollections,
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
      metric,
      name: searchTermApplied,
    },
  })

  useEffect(() => {
    if (data) {
      const defaultSelected = data.orderedCollectionsByMetricSearch.slice(0, 3).map((val) => val.id)
      setSelectedCollections(defaultSelected)
    }
  }, [data])

  const title = metric === 'VOLUME'
    ? 'Collections by Weekly Volume'
    : `Collections by ${
        metric.charAt(0) + metric.slice(1).toLowerCase()
      } Price` 
  const subtitle = '(Select Collections to change graph)'

  /* Transposes a horizontally-labeled index to vertical-labeled index */
  const getCellNumber = (length: number, idx: number) =>
    idx === length - 1 ? idx : (idx * getColumns()) % (length - 1)

  if (error)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        There was an error completing your request.
      </CollectionPanel>
    )

  const skeletonCells = [...new Array(12)]
    .map((_, idx) => idx)
    .sort((a, b) => getCellNumber(12, a) - getCellNumber(12, b))

  if (loading)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        {skeletonCells.map((idx) => (
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

  const sorted = data.orderedCollectionsByMetricSearch
    .map((val, idx) => ({
      ...val,
      idx,
    }))
    .sort(
      (a, b) =>
        getCellNumber(data.orderedCollectionsByMetricSearch.length, a.idx) -
        getCellNumber(data.orderedCollectionsByMetricSearch.length, b.idx)
    )

  return (
    <CollectionPanel
      inputProps={{
        ref: searchTermRef,
      }}
      onSearch={handleSearch}
      {...{ title, subtitle }}
    >
      {sorted.map(({ id, name, imageUrl, average, idx }) => (
        <Flex
          key={idx}
          sx={{ alignItems: 'center', color: 'disabled', gap: 5 }}
        >
          <Text>{idx + 1}</Text>
          <CollectionButton
            icon={
              <Link passHref href={`/analytics/collection/${id}`}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                    '&:hover img': {
                      display: 'none',
                    },
                    '&:hover svg': {
                      display: 'block',
                    },
                  }}
                >
                  <Image
                    alt={`${name} Cover Artwork`}
                    sx={{
                      borderRadius: 'circle',
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src={imageUrl}
                  />
                  <Icon icon='arrowStylizedRight' sx={{
                      display: 'none',
                      position: 'absolute',
                      top: '0',
                      width: '40% !important',
                      height: '40% !important',
                      margin: '30%',
                    }} size='40%'></Icon>
                </Box>
              </Link>
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
      ))}
    </CollectionPanel>
  )
}
