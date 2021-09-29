import { useQuery } from '@apollo/client'
import { Chart } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'

import {
  GET_TOP_COLLECTIONS,
  GetTopCollectionsData,
  GetTopCollectionsVars,
  TimeSeries,
} from '../queries'
import { METRIC } from './ButtonTabs'

const timeSeriesKeys = {
  AVERAGE: 'average',
  VOLUME: 'marketCap',
  FLOOR: 'floor',
}

export default function TopCollectionsCharts({
  metric,
  selectedCollections,
}: {
  metric: METRIC
  selectedCollections: number[]
}) {
  const { loading, error, data } = useQuery<
    GetTopCollectionsData,
    GetTopCollectionsVars
  >(GET_TOP_COLLECTIONS, {
    errorPolicy: 'all',
    variables: {
      metric,
      stringifiedCollectionIds: selectedCollections.length
        ? `[${selectedCollections.join(',')}]`
        : undefined,
    },
  })
  /* Load state. */
  if (loading) return <Chart loading />

  /* Error state. */
  if (error) return <Chart error />

  /* No results state. */
  if (!data?.orderedCollectionsByMetricSearch?.length) return <Chart noData />

  const assetSets = data.orderedCollectionsByMetricSearch.filter(
    ({ timeSeries }) => timeSeries?.length
  )
  if (!assetSets?.length) return <Chart noData />

  const minDate = Math.max(
    ...assetSets.map(({ timeSeries }) => timeSeries?.[0].timestamp ?? 0)
  )

  const maxDate = Math.max(
    ...assetSets.map(
      ({ timeSeries }) => timeSeries?.slice(-1)[0].timestamp ?? 0
    )
  )

  /**
   * Reduce the time series to (timestamp, value) tuples.
   * Wei pricing is converted to rounded floats.
   */
  const chartData = assetSets
    .map(({ timeSeries, name }) => ({
      name,
      data: (timeSeries as TimeSeries[])
        .filter(({ timestamp }) => timestamp >= minDate)
        .reduce(
          (a: (Date | number)[][], c, i) => [
            ...a,
            [
              c.timestamp * 1000,
              parseFloat(ethers.utils.formatEther(c[timeSeriesKeys[metric]])),
            ],
          ],
          []
        ),
    }))
    .map(({ name, data }) => ({
      name,
      data: data.map((val, i) =>
        i === 0
          ? [minDate * 1000, val[1]]
          : i === data.length - 1
          ? [maxDate * 1000, val[1]]
          : val
      ),
    }))

  console.log({ chartData })

  return <Chart data={chartData} />
}
