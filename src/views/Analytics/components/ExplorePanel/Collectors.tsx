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
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { formatCommas } from 'utils/number'

import {
  GET_COLLECTORS,
  GET_PREVIOUS_OWNERS,
  GET_USER_OWNED_ASSETS,
  GetCollectorsData,
  GetCollectorsVars,
  GetPreviousOwnersData,
  GetPreviousOwnersVars,
  GetUserOwnedAssetsData,
  GetUserOwnedAssetsVars,
} from '../../queries'

export default function Collectors({
  id,
  name,
  assetId,
  searchTerm = '',
}: {
  id?: number
  name?: string
  assetId?: string
  searchTerm?: string
}) {
  const [selectedExtraCollections, setSelectedExtraCollections] = useState({})
  const [selectedExtraCollectionId, setSelectedExtraCollectionId] = useState<
    number | undefined
  >()
  const [selectedCollectorId, setSelectedCollectorId] = useState<
    number | undefined
  >()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }
  const handleShowCollector = (address: string) => {
    router.push('/analytics/user/' + address)
  }
  let collectorVars = {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    searchTerm,
  }
  if (id) collectorVars['id'] = id
  const isLandingPage = !id && !assetId

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
        variables: { ...collectorVars },
      })

  const { data: extraCollectionData } = useQuery<
    GetUserOwnedAssetsData,
    GetUserOwnedAssetsVars
  >(GET_USER_OWNED_ASSETS, {
    errorPolicy: 'all',
    variables: {
      userId: selectedCollectorId,
      collectionId: selectedExtraCollectionId,
    },
    skip: !selectedCollectorId || !selectedExtraCollectionId,
  })

  useEffect(() => {
    if (
      extraCollectionData?.getUser?.ownedAssets?.assets &&
      selectedCollectorId
    ) {
      setSelectedExtraCollections({
        ...selectedExtraCollections,
        [selectedCollectorId]:
          extraCollectionData?.getUser?.ownedAssets?.assets,
      })
    }
  }, [extraCollectionData])

  useEffect(() => {
    setPage(0)
  }, [searchTerm])

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

  const formatAppraisal = (appraisal) => {
    return appraisal
      ? formatCommas(
          parseFloat(ethers.utils.formatEther(appraisal)).toFixed(2),
          2,
          2
        )
      : appraisal
  }

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  // if (error) return null

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.owners?.length) return null

  return (
    <>
      <CollectorAccordionHead>
        <Text>Collector</Text>
        {name && (
          <Text sx={{ whiteSpace: 'nowrap' }}>
            {`${isMobile ? '' : name} Count`}
          </Text>
        )}
        {!name && !isLandingPage && (
          <Text sx={{ whiteSpace: 'nowrap' }}>NFT Count</Text>
        )}
        {isLandingPage && (
          <Text sx={{ whiteSpace: 'nowrap' }}>Portfolio Appraisal</Text>
        )}
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
                id,
                username,
                addresses,
                ownedAppraisalValue,
                avgHoldTime,
                firstAssetPurchaseTime,
                ownedAssets: { count, assets },
                extraCollections: { collectionAssetCounts },
              },
              idx
            ) => (
              <CollectorAccordionRow
                isLandingPage={isLandingPage}
                address={addresses?.[0].address}
                onClick={() => {
                  handleShowCollector(addresses?.[0].address)
                }}
                firstAcquisition={firstAssetPurchaseTime}
                collectionName={name}
                portfolioValue={formatAppraisal(
                  ownedAppraisalValue?.appraisalWei
                )}
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
                key={idx}
                defaultOpen={idx === 0 ? true : false}
                displayName={
                  addresses[0].ens ?? shortenAddress(addresses[0].address)
                }
                {...{ count, avgHoldTime }}
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
