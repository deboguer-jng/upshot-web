/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import { Grid, Image, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  CollectionButton,
  CollectionButtonTemplate,
  formatNumber,
  Icon,
  Link,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useEffect, useRef, useState } from 'react'

import {
  GET_COLLECTIONS_BY_METRIC,
  GetCollectionsByMetricData,
  GetCollectionsByMetricVars,
} from '../queries'
import { METRIC } from './ButtonTabs'
import CollectionPanel from './CollectionPanel'

interface CollectionAvgPricePanelProps {
  selectedCollections: number[]
  onCollectionSelected: (id: number) => void
  metric: METRIC
  setSelectedCollections: (collections: number[]) => void
  selectedCollectionsColors: string[]
  colorCycleIndex: number
}

export default function CollectionAvgPricePanel({
  onCollectionSelected,
  selectedCollections,
  metric,
  setSelectedCollections,
  selectedCollectionsColors,
  colorCycleIndex,
}: CollectionAvgPricePanelProps) {
  const { theme } = useTheme()
  const [page, setPage] = useState(0)
  const searchTermRef = useRef<HTMLInputElement | null>(null)
  const [searchTermApplied, setSearchTermApplied] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    setSearchTermApplied(searchTermRef?.current?.value ?? '')
  }

  const { loading, error, data } = useQuery<
    GetCollectionsByMetricData,
    GetCollectionsByMetricVars
  >(GET_COLLECTIONS_BY_METRIC, {
    errorPolicy: 'all',
    variables: {
      orderColumn: metric,
      orderDirection: 'DESC',
      limit: 100,
      offset: page * 100,
      name: searchTermApplied,
    },
  })

  useEffect(() => {
    if (data && !selectedCollections.length) {
      // FIXME: the selected collections should default to the top three
      // as before, but needs logic to filter out brand new collections that will
      // make the chart look bad (mostly relevant on Art Blocks drop days)
      setSelectedCollections([1, 607, 268])
    }
  }, [data])

  const title =
    metric === 'PAST_WEEK_VOLUME'
      ? 'Collections by Weekly Volume'
      : metric === 'PAST_WEEK_AVERAGE'
      ? 'Collections by Average Price'
      : 'Collections by Floor Price'
  const subtitle =
    'Select collections to add them to the chart, or click icons to see more'

  // if (error)
  //   return (
  //     <CollectionPanel {...{ title, subtitle }}>
  //       There was an error completing your request.
  //     </CollectionPanel>
  //   )

  const skeletonCells = [...new Array(20)]

  if (loading)
    return (
      <CollectionPanel {...{ title, subtitle }}>
        {skeletonCells.map((idx, index) => (
          <Grid
            key={index}
            columns={['25px auto']}
            sx={{ alignItems: 'center', color: 'disabled', gap: 1 }}
          >
            <Text>{index + 1}</Text>
            <CollectionButtonTemplate />
          </Grid>
        ))}
      </CollectionPanel>
    )

  if (!data?.searchCollectionByMetric.assetSets.length)
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
      {data.searchCollectionByMetric.assetSets.map(
        ({ id, name, imageUrl, latestStats }, index) => {
          const underglow = selectedCollections.includes(id)
            ? (selectedCollectionsColors[
                selectedCollections.indexOf(id)
              ] as keyof typeof theme.colors)
            : undefined

          const hoverUnderglow = selectedCollectionsColors[
            colorCycleIndex
          ] as keyof typeof theme.colors

          return (
            <Grid
              key={index}
              columns={['25px auto']}
              sx={{ alignItems: 'center', color: 'disabled', gap: 1 }}
            >
              <Text>{index + 1}</Text>
              <CollectionButton
                icon={
                  <Link
                    href={`/analytics/collection/${id}`}
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
                  </Link>
                }
                onClick={() => onCollectionSelected(id)}
                text={name ?? 'Unknown'}
                subText={
                  printMetricData(metric, {
                    average: latestStats?.pastDayWeiAverage,
                    floor: latestStats?.floor,
                    volume: latestStats?.pastWeekWeiVolume,
                  }) ?? ''
                }
                {...{ underglow, hoverUnderglow }}
              />
            </Grid>
          )
        }
      )}
    </CollectionPanel>
  )
}

// returns the metric related data in a human-readable format
function printMetricData(
  metric: METRIC,
  data: { average?: string; floor?: string; volume?: string }
) {
  if (metric === 'PAST_WEEK_VOLUME' && data['volume']) {
    return (
      formatNumber(data['volume'], {
        fromWei: true,
        decimals: 2,
        prefix: 'ETHER',
        kmbUnits: true,
      }) ?? '-'
    )
  } else if (metric === 'PAST_WEEK_AVERAGE' && data['average']) {
    return (
      formatNumber(data['average'], {
        fromWei: true,
        decimals: 2,
        prefix: 'ETHER',
      }) ?? '-'
    )
  } else if (metric === 'FLOOR' && data['floor']) {
    return (
      formatNumber(data['floor'], {
        fromWei: true,
        decimals: 2,
        prefix: 'ETHER',
      }) ?? '-'
    )
  }
}
