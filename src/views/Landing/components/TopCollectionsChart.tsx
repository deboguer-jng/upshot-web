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

export default function TopCollectionsCharts({ metric }: { metric: METRIC }) {
  const { loading, error, data } = useQuery<
    GetTopCollectionsData,
    GetTopCollectionsVars
  >(GET_TOP_COLLECTIONS, {
    errorPolicy: 'all',
    variables: { metric },
  }) // Using `all` to include data with errors.

  /* Wait for response from server. */
  if (loading) return <Chart loading />

  /* If there was an error, display the error variant. */
  if (error) return <Chart error /> // Ignored to suppress error reporting.

  /* If no collections with time series data are available, display the noData variant. */
  if (!data?.orderedCollectionsByMetricSearch?.length) return <Chart noData />

  const assetSets = data.orderedCollectionsByMetricSearch.filter(
    ({ timeSeries }) => timeSeries?.length
  )
  if (!assetSets?.length) return <Chart noData />

  /**
   * Reduce the time series to (timestamp, value) tuples.
   * Wei pricing is converted to rounded floats.
   */
  const chartData = assetSets.map(({ timeSeries, name }) => ({
    name,
    data: (timeSeries as TimeSeries[]).reduce(
      (a: (Date | number)[][], c) => [
        ...a,
        [c.timestamp * 1000, parseFloat(ethers.utils.formatEther(c.marketCap))],
      ],
      []
    ),
  }))

  return <Chart data={chartData} />
}
