import { useQuery } from '@apollo/client'
import {
  CollectorAccordion,
  CollectorAccordionRow,
} from '@upshot-tech/upshot-ui'
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

  console.log(data?.getOwnersByWhaleness?.owners)

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
            extraCollections: { collectionAssetCounts },
          },
          idx
        ) => (
          <CollectorAccordionRow
            name={formatUsername(username ?? addresses?.[0] ?? 'Unknown')}
            portfolioValue={
              totalAssetAppraisedValue
                ? weiToEth(totalAssetAppraisedValue, 2, false)
                : null
            }
            // nftCollection={collectionAssetCounts.map(
            //   ({ collection: { imageUrl, name, id } }) => ({
            //     id,
            //     imageUrl,
            //     name,
            //     url: `/analytics/collection/${id}`,
            //   })
            // )}
            key={idx}
          />
        )
      )}
    </CollectorAccordion>
  )
}
