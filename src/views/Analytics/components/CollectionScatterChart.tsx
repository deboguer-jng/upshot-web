import { useQuery } from '@apollo/client'
import { ScatterChart, ChartDataItem } from '@upshot-tech/upshot-ui'
import { shortenAddress } from 'utils/address'

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
    variables: { id },
    skip: !id,
  })

  /* Load state. */
  if (loading) return <ScatterChart loading />

  /* Error state. */
  // if (error) return <ScatterChart error />

  /* No results state. */
  if (!data?.collectionById?.allSaleEvents?.length)
    return <ScatterChart noData />

  const chartData = data.collectionById.allSaleEvents.map(
    ({ ethFloatPrice, millisecondsTimestamp, asset, assetEvent }): ChartDataItem => {
      return {
        x: millisecondsTimestamp,
        y: ethFloatPrice,
        id: asset.tokenId,
        address: assetEvent?.txToAddress ? shortenAddress(assetEvent.txToAddress) : null,
        gmi: assetEvent?.txToUser?.addresses[0]?.gmi,
        ens: assetEvent?.txToUser?.addresses[0]?.ens
      }
    }
  )

  return <ScatterChart data={[{ name, data: chartData }]} />
}
