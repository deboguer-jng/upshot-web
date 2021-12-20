import { useQuery } from '@apollo/client'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  Flex,
  Pagination,
  Skeleton,
  TableCell,
  Text,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE, PIXELATED_CONTRACTS } from 'constants/'
import { useState } from 'react'

import {
  GET_COLLECTORS,
  GET_PREVIOUS_OWNERS,
  GetCollectorsData,
  GetCollectorsVars,
  GetPreviousOwnersData,
  GetPreviousOwnersVars,
} from '../../queries'

export default function Collectors({
  id,
  name,
  assetId,
}: {
  id?: number
  name?: string
  assetId?: string
}) {
  const [page, setPage] = useState(0)
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const { loading, error, data } = assetId
    ? useQuery<GetPreviousOwnersData, GetPreviousOwnersVars>(
        GET_PREVIOUS_OWNERS,
        {
          errorPolicy: 'all',
          variables: {
            id,
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
            assetId,
          },
          skip: !id,
        }
      )
    : useQuery<GetCollectorsData, GetCollectorsVars>(GET_COLLECTORS, {
        errorPolicy: 'all',
        variables: { id, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
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
        <Text sx={{ whiteSpace: 'nowrap' }}>{`${
          isMobile ? '' : name
        } Count`}</Text>
      </CollectorAccordionHead>
      <CollectorAccordion>
        {[...data.getOwnersByWhaleness.owners].map(
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
                ({ collection: { imageUrl, id } }) => ({
                  id,
                  imageUrl,
                  url: `/analytics/nft/${id}`,
                  pixelated: PIXELATED_CONTRACTS.includes(id.toString().split('/')[0]),
                }))}
                key={idx}
                defaultOpen={idx === 0 ? true : false}
                {...{ username, count, avgHoldTime }}
              />
            )
          )}
      </CollectorAccordion>
      <Flex sx={{ justifyContent: 'center', marginTop: '18px' }}>
        <Pagination
          forcePage={page}
          pageCount={Math.ceil(data.getOwnersByWhaleness['count'] / PAGE_SIZE)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}
