import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@upshot-tech/upshot-ui'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  Flex,
  MiniNftCard,
  Pagination,
  Skeleton,
  TableCell,
  Text,
  theme,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE, PIXELATED_CONTRACTS } from 'constants/'
import makeBlockie from 'ethereum-blockies-base64'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { weiToEth } from 'utils/number'

import {
  GET_TOP_COLLECTORS,
  GetTopCollectorsData,
  GetTopCollectorsVars,
} from '../../queries'
import { MiniNFTContainer } from '.././Styled'
import { ExplorePanelSkeleton } from './NFTs'

export default function TopCollectors({ searchTerm }: { searchTerm: string }) {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [selectedExtraCollections, setSelectedExtraCollections] = useState({})
  const [selectedExtraCollectionId, setSelectedExtraCollectionId] = useState<
    number | undefined
  >()
  const [selectedCollectorId, setSelectedCollectorId] = useState<
    number | undefined
  >()

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const { loading, error, data } = useQuery<
    GetTopCollectorsData,
    GetTopCollectorsVars
  >(GET_TOP_COLLECTORS, {
    errorPolicy: 'all',
    variables: { limit: PAGE_SIZE, offset: page * PAGE_SIZE, searchTerm },
  })

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  // if (error) return <div>There was an error completing your request.</div>

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.['owners']?.length)
    return <div>No results available.</div>

  const handleShowCollector = (address: string) => {
    router.push('/analytics/user/' + address)
  }

  return (
    <>
      <CollectorAccordionHead>
        {/* <Text sx={{ whiteSpace: 'nowrap' }}>Total Appraised Value</Text> */}
      </CollectorAccordionHead>
      <CollectorAccordion>
        {data.getOwnersByWhaleness['owners'].map(
          (
            {
              username,
              addresses,
              ownedAssets,
              avgHoldTime,
              firstAssetPurchaseTime,
              ownedAssets: { count, assets },
              extraCollections: { collectionAssetCounts },
            }, idx) => (
            <CollectorAccordionRow
              address={addresses?.[0].address}
              key={idx}
              onClick={() => handleShowCollector(addresses?.[0].address)}
              defaultOpen={idx === 0 ? true : false}
              firstAcquisition={firstAssetPurchaseTime}
              extraCollections={collectionAssetCounts.map(
                ({ count, collection: { imageUrl, name, id } }) => ({
                  id,
                  imageUrl,
                  name,
                  count,
                  pixelated: true,
                  url: `/analytics/collection/${id}`,
                })
              )}
              extraCollectionChanged={(collectionId) => {
                setSelectedCollectorId(id)
                setSelectedExtraCollectionId(collectionId)
              }}
              nftCollection={(selectedExtraCollections[id] || assets).map(
                ({ previewImageUrl, id }) => ({
                  id,
                  imageUrl: previewImageUrl,
                  url: `/analytics/nft/${id}`,
                  pixelated: PIXELATED_CONTRACTS.includes(
                    id.toString().split('/')[0]
                  ),
                  count,
                })
              )}
              {...{ username }}
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
