import { useQuery } from '@apollo/client'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  Skeleton,
  TableCell,
  Text,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'
import { format, formatDistance } from 'date-fns'
import makeBlockie from 'ethereum-blockies-base64'
import { formatUsername } from 'utils/address'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTORS,
  GetCollectorsData,
  GetCollectorsVars,
  GET_PREVIOUS_OWNERS,
  GetPreviousOwnersData,
  GetPreviousOwnersVars,
} from '../../queries'
import { ExplorePanelSkeleton } from './NFTs'

export default function Collectors({
  id,
  name,
  assetId,
}: {
  id?: number
  name?: string
  assetId?: string
}) {
  const { loading, error, data } = 
    assetId ?
      useQuery<
        GetPreviousOwnersData,
        GetPreviousOwnersVars
      >(GET_PREVIOUS_OWNERS, {
        errorPolicy: 'all',
        variables: { id, limit: 10, assetId },
        skip: !id,
      }) :
      useQuery<
        GetCollectorsData,
        GetCollectorsVars
      >(GET_COLLECTORS, {
        errorPolicy: 'all',
        variables: { id, limit: 10 },
        skip: !id,
      })

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return null

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.owners?.length) return null

  return (
    <>
      <CollectorAccordionHead>
        <Text>Collector</Text>
        <Text sx={{ whiteSpace: 'nowrap' }}>{`${name} Count`}</Text>
      </CollectorAccordionHead>
      <CollectorAccordion>
        {data.getOwnersByWhaleness.owners.map(
          (
            {
              username,
              addresses,
              avgHoldTime,
              firstAssetPurchaseTime,
              ownedAssets: { count, assets },
              extraCollections: { collectionAssetCounts },
            },
            idx
          ) => (
            <CollectorAccordionRow
              avatarImageUrl={
                addresses?.[0] ? makeBlockie(addresses[0]) : undefined
              }
              count={count}
              name={formatUsername(username ?? addresses?.[0] ?? 'Unknown')}
              firstAcquisition={format(
                firstAssetPurchaseTime * 1000,
                'MM/dd/yyyy'
              )}
              collectionName={name}
              avgHoldTime={formatDistance(0, avgHoldTime * 1000)}
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
    </>
  )
}
