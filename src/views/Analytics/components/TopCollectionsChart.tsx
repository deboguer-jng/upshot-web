import { useQuery } from '@apollo/client'
import { Chart } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'
import { weiToEth } from 'utils/number'

import {
  GET_TOP_COLLECTIONS,
  GetTopCollectionsData,
  GetTopCollectionsVars,
  TimeSeries,
} from '../queries'
import { METRIC } from './ButtonTabs'

interface TopCollectionsChartsProps {
  metric: METRIC
  selectedCollections: number[]
  onClose?: (index: number) => void
}

const timeSeriesKeys = {
  AVERAGE: 'average',
  VOLUME: 'volume',
  FLOOR: 'floor',
}

const athKeys = {
  AVERAGE: 'athAverageWeeklyWei',
  VOLUME: 'athVolumeWeeklyWei',
  FLOOR: 'athFloor',
}

const atlKeys = {
  AVERAGE: 'atlAverageWeeklyWei',
  VOLUME: 'atlVolumeWeeklyWei',
  FLOOR: 'atlFloor',
}

const floorCheck = (val) => {
  return val ? parseFloat(ethers.utils.formatEther(val)) : 0
}

export default function TopCollectionsCharts({
  metric,
  selectedCollections,
  onClose,
}: TopCollectionsChartsProps) {
  const currentDate = Date.now()
  const before7Daysdate = currentDate - 1000 * 60 * 60 * 24 * 7 // extract 7 days in millisec
  const minTimestamp =
    metric === 'VOLUME' ? Math.floor(before7Daysdate / 1000) : 0

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
      minTimestamp: minTimestamp,
    },
  })
  /* Load state. */
  if (loading) return <Chart loading />

  /* Error state. */
  // if (error) return <Chart error />

  /* No results state. */
  if (!data?.orderedCollectionsByMetricSearch?.assetSets?.length)
    return <Chart noData />

  /* No selected state. */
  if (!selectedCollections.length) return <Chart noSelected />

  const assetSets = data.orderedCollectionsByMetricSearch.assetSets.filter(
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
    .map(({ timeSeries, ...rest }) => ({
      data: (timeSeries as TimeSeries[])
        .filter(({ timestamp }) => timestamp >= minDate)
        .reduce(
          (a: number[][], c) => [
            ...a,
            [c.timestamp * 1000, floorCheck(c[timeSeriesKeys[metric]])],
          ],
          []
        ),
      ...rest,
    }))
    .sort(
      (a, b) =>
        selectedCollections.indexOf(a.id) - selectedCollections.indexOf(b.id)
    )
    .map(({ data, name, id, latestStats, ...rest }) => {
      const ath = rest[athKeys[metric]]?.value
      const atl = rest[atlKeys[metric]]?.value
      const priceChange = !latestStats?.sevenDayChange
        ? null
        : latestStats.sevenDayChange >= 0
        ? '+' + latestStats.sevenDayChange + '%'
        : latestStats.sevenDayChange + '%'

      return {
        name,
        url: `/analytics/collection/${id}`,
        ath: ath && metric !== 'FLOOR' ? weiToEth(ath, 2) : null,
        atl: atl && metric !== 'FLOOR' ? weiToEth(atl, 2) : null,
        /* priceUsd: 10, */
        // priceChange,
        volume:
          metric === 'VOLUME' && latestStats?.volume
            ? parseFloat(weiToEth(latestStats.volume, 2, false))
            : 0,
        data: data.map((val, i) =>
          i === 0
            ? [minDate * 1000, val[1]] // Align window start
            : i === data.length - 1
            ? [maxDate * 1000, val[1]] // Align window end
            : val
        ),
        metric,
        currentFloor: weiToEth((latestStats?.floor).toString(), 4, false),
        currentAvg: weiToEth(
          (latestStats?.pastDayWeiAverage).toString(),
          4,
          false
        ),
      }
    })

  const handleClose = (index: number) => {}

  return <Chart data={chartData} {...{ onClose }} />
}
