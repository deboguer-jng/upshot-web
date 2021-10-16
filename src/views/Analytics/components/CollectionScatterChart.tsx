import { useQuery } from '@apollo/client'
import { ScatterChart } from '@upshot-tech/upshot-ui'
import { ethers } from 'ethers'

import {
  GET_ALL_COLLECTION_SALES,
  GetAllCollectionSalesData,
  GetAllCollectionSalesVars,
} from '../Collection/queries'

export default function CollectionScatterChart({
  id,
  name = '',
}: {
  id?: number
  name?: string
}) {
  const { loading, error, data } = useQuery<
    GetAllCollectionSalesData,
    GetAllCollectionSalesVars
  >(GET_ALL_COLLECTION_SALES, {
    variables: { id: Number(id) },
    skip: !id,
  })

  /* Load state. */
  if (loading) return <ScatterChart loading />

  /* Error state. */
  if (error) return <ScatterChart error />

  /* No results state. */
  if (!data?.collectionById?.allSaleEvents?.length)
    return <ScatterChart noData />

  const chartData = data.collectionById.allSaleEvents.map(
    ({ ethSalePrice, timestamp }) => [
      timestamp * 1000,
      parseFloat(ethers.utils.formatEther(ethSalePrice)),
    ]
  )

  return <ScatterChart data={[{ name, data: chartData }]} />
}
