import { useQuery } from '@apollo/client'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  Skeleton,
  TableCell,
  Text,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { PAGE_SIZE } from 'constants/'

import {
  GET_COLLECTORS,
  GET_PREVIOUS_OWNERS,
  GetCollectorsData,
  GetCollectorsVars,
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
  const { loading, error, data } = assetId
    ? useQuery<GetPreviousOwnersData, GetPreviousOwnersVars>(
        GET_PREVIOUS_OWNERS,
        {
          errorPolicy: 'all',
          variables: { id, limit: 10, assetId },
          skip: !id,
        }
      )
    : useQuery<GetCollectorsData, GetCollectorsVars>(GET_COLLECTORS, {
        errorPolicy: 'all',
        variables: { id, limit: 10 },
        skip: !id,
      })

    const breakpointIndex = useBreakpointIndex()
    const isMobile = breakpointIndex <= 1

  const ExplorePanelSkeleton = () => {
    return (
      <CollectorAccordion>
        {[...new Array(PAGE_SIZE)].map((_, idx) => (
          <Skeleton sx={{ height: 56 }} as="tr" key={idx}>
            <TableCell colSpan={5}>
              <Box sx={{ height: 40, width: '100%' }} />
            </TableCell>
          </Skeleton>
        ))}
      </CollectorAccordion>
    )
  }

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
        <Text sx={{ whiteSpace: 'nowrap' }}>{`${ isMobile ? '' : name} Count`}</Text>
      </CollectorAccordionHead>
      <CollectorAccordion>
        {[...data.getOwnersByWhaleness.owners]
          .sort((owner1, owner2) => {
            if (owner1.firstAssetPurchaseTime < owner2.firstAssetPurchaseTime)
              return 1
            if (owner1.firstAssetPurchaseTime === owner2.firstAssetPurchaseTime)
              return 0
            return -1
          })
          .map(
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
                address={addresses?.[0]}
                firstAcquisition={firstAssetPurchaseTime}
                collectionName={name}
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
                defaultOpen={ idx === 0 ? true : false }
                {...{ username, count, avgHoldTime }}
              />
            )
          )}
      </CollectorAccordion>
    </>
  )
}
