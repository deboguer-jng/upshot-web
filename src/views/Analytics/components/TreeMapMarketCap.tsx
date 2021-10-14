import { useQuery } from '@apollo/client'
import { TreeMap } from '@upshot-tech/upshot-ui'

import {
  GET_SEVEN_DAY_MC_CHANGE,
  GetSevenDayMCChangeData,
  GetSevenDayMCChangeVars,
} from '../queries'

export default function TreeMapMarketCap() {
  const { loading, error, data } = useQuery<
    GetSevenDayMCChangeData,
    GetSevenDayMCChangeVars
  >(GET_SEVEN_DAY_MC_CHANGE, {
    errorPolicy: 'all',
    variables: { limit: 100 },
  })
  /* Load state. */
  if (loading) return <TreeMap loading data={[]} />

  /* Error state. */
  // if (error) return <TreeMap error data={[]} />

  /* No results state. */
  if (!data?.collections?.assetSets?.length) return <TreeMap noData data={[]} />

  const chartData = data?.collections?.assetSets
    ?.filter(({ sevenDayMCChange }) => sevenDayMCChange)
    .map(({ name, sevenDayMCChange: value }) => ({
      name,
      value,
    }))

  return <TreeMap data={chartData} />
}
