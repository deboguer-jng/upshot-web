import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { TreeMap } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import {
  GET_SEVEN_DAY_MC_CHANGE,
  GetSevenDayMCChangeData,
  GetSevenDayMCChangeVars,
} from '../queries'

export default function TreeMapMarketCap() {
  const isMobile = useBreakpointIndex() <= 1
  const router = useRouter()
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
    ?.filter(({ latestStats }) => latestStats?.sevenDayChange)
    .map(({ id, name, latestStats }) => ({
      id,
      name,
      delta: latestStats?.sevenDayChange ?? 0,
      marketCap: parseFloat(
        ethers.utils.formatEther(latestStats?.totalWeiVolume ?? 0)
      ),
    }))

  return (
    <TreeMap
      data={!isMobile ? chartData : chartData.slice(0, 15)}
      onCollectionSelected={(collectionId: number) => {
        router.push(`/analytics/collection/${collectionId}`)
      }}
    />
  )
}
