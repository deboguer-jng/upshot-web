/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { Flex, Image, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  CollectionButton,
  CollectionButtonTemplate,
  Icon,
  useTheme,
} from '@upshot-tech/upshot-ui'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
      limit: 100,
      metric,
      name: searchTermApplied,
    },
  })

  useEffect(() => {
    if (data && !selectedCollections.length) {
      const defaultSelected = data.orderedCollectionsByMetricSearch.assetSets
        .slice(0, 3)
        .map((val) => val.id)

      // FIXME: the selected collections should default to the top three
      // as before, but needs logic to filter out brand new collections that will
      // make the chart look bad (mostly relevant on Art Blocks drop days)
      setSelectedCollections([1, 607, 268])
    }
  }, [data])

  const title =
    metric === 'VOLUME'
      ? 'Collections by Weekly Volume'
      : `Collections by ${
          metric.charAt(0) + metric.slice(1).toLowerCase()
        } Price`
  const subtitle =
    'Select collections to add them to the chart, or click icons to see more'

  if (error)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        There was an error completing your request.
      </CollectionPanel>
    )

  const skeletonCells = [...new Array(16)]

  if (loading)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        {skeletonCells.map((idx, index) => (
          <Flex
            key={index}
            sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
          >
            <Text>{index + 1}</Text>
            <CollectionButtonTemplate />
          </Flex>
        ))}
      </CollectionPanel>
    )

  if (!data?.orderedCollectionsByMetricSearch.assetSets.length)
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
      {data.orderedCollectionsByMetricSearch.assetSets.map(
        ({ id, name, imageUrl, latestStats }, index) => {
          const underglow = selectedCollections.includes(id)
            ? (selectedCollectionsColors[
                selectedCollections.indexOf(id)
              ] as keyof typeof theme.colors)
            : undefined

          const hoverUnderglow = (selectedCollectionsColors[
            selectedCollections.length
          ] ??
            selectedCollectionsColors[
              selectedCollectionsColors.length - 1
            ]) as keyof typeof theme.colors

          return (
            <Flex
              key={index}
              sx={{ alignItems: 'center', color: 'disabled', gap: 5 }}
            >
              <Text>{index + 1}</Text>
              <CollectionButton
                icon={
                  <Link passHref href={`/analytics/collection/${id}`}>
                    <Box
                      sx={{
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        alt={`${name} Cover Artwork`}
                        sx={{
                          borderRadius: 'circle',
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        src={imageUrl}
                        height={theme.buttons.collection.iconHeight}
                        width={theme.buttons.collection.iconHeight}
                      />
                      <Icon
                        icon="arrowStylizedRight"
                        sx={{
                          display: 'none',
                          position: 'absolute',
                          top: '0',
                          width: '40% !important',
                          height: '40% !important',
                          margin: '30%',
                        }}
                        size="40%"
                      ></Icon>
                    </Box>
                  </Link>
                }
                onClick={() => onCollectionSelected(id)}
                text={name ?? 'Unknown'}
                subText={printMetricData(metric, {
                  average: latestStats.pastDayWeiAverage,
                  floor: latestStats.floor,
                  volume: latestStats.pastDayWeiVolume,
                })}
                {...{ underglow, hoverUnderglow }}
              />
            </Flex>
          )
        }
      )}
      )
    </CollectionPanel>
  )
}

// returns the metric related data in a human-readable format
function printMetricData(
  metric: METRIC,
  data: { average?: string; floor?: string; volume?: string }
) {
  if (metric === 'VOLUME' && data['volume']) {
    return weiToEth(data['volume']) ?? '-'
  } else if (metric === 'AVERAGE' && data['average']) {
    return weiToEth(data['average']) ?? '-'
  } else if (metric === 'FLOOR' && data['floor']) {
    return weiToEth(data['floor']) ?? '-'
  }
}
