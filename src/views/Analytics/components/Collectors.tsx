import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  CollectorAccordionRow,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { format, formatDistance } from 'date-fns'
import { formatUsername } from 'utils/address'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTORS,
  GetCollectorsData,
  GetCollectorsVars,
} from '../queries'

export default function Collectors({
  id,
  name,
}: {
  id?: number
  name?: string
}) {
  const { loading, error, data } = useQuery<
    GetCollectorsData,
    GetCollectorsVars
  >(GET_COLLECTORS, {
    errorPolicy: 'all',
    variables: { id: Number(id), limit: 10 },
    skip: !id,
  })

  /* Load state. */
  if (loading) return null

  /* Error state. */
  if (error) return null

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.owners?.length) return null

  return (
    <CollectorAccordion>
      {data.getOwnersByWhaleness.owners.map(
        (
          {
            username,
            addresses,
            totalAssetAppraisedValue,
            avgHoldTime,
            firstAssetPurchaseTime,
            ownedAssets: { count, assets },
            extraCollections: { collectionAssetCounts },
          },
          idx
        ) => (
          <CollectorAccordionRow
            count={count}
            name={formatUsername(username ?? addresses?.[0] ?? 'Unknown')}
            firstAcquisition={format(
              firstAssetPurchaseTime * 1000,
              'MM/dd/yyyy'
            )}
            collectionName={name}
            avgHoldTime={formatDistance(0, avgHoldTime * 1000)}
            totalNftValue={
              totalAssetAppraisedValue
                ? weiToEth(totalAssetAppraisedValue, 2, false)
                : null
            }
            extraCollections={collectionAssetCounts.map(
              ({ count, collection: { imageUrl, name, id } }) => ({
                id,
                imageUrl,
                name,
                count,
                url: `/analytics/collection/${id}`,
              })
            )}
            nftCollection={assets.map(({ previewImageUrl, id }) => ({
              id,
              imageUrl: previewImageUrl,
              url: `/analytics/nft/${id}`,
              pixelated: PIXELATED_CONTRACTS.includes(id.split('/')[0]),
            }))}
            key={idx}
          />
        )
      )}
    </CollectorAccordion>
  )
}
