import { useQuery } from '@apollo/client'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  Flex,
  formatNumber,
  Pagination,
  Skeleton,
  TableCell,
  Text,
  useBreakpointIndex
} from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAlertState } from 'redux/reducers/layout'
import { shortenAddress } from 'utils/address'
import {
GET_USER_OWNED_ASSETS,
  GetUserOwnedAssetsData,
  GetUserOwnedAssetsVars} from 'views/Analytics/queries'
import {
GET_FOLLOWED_COLLECTORS,
  GetFollowedCollectorsData,
  GetFollowedCollectorsVars} from 'views/Analytics/User/queries'

import { PAGE_SIZE, PIXELATED_CONTRACTS } from '../../../../constants'

const FollowedCollectors = ({
  userId,
  name,
}: {
  userId?: number
  name?: string
}) => {
  const dispatch = useDispatch()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [selectedExtraCollections, setSelectedExtraCollections] = useState({})
  const [selectedExtraCollectionId, setSelectedExtraCollectionId] = useState<
    number | undefined
  >()
  const [selectedCollectorId, setSelectedCollectorId] = useState<
    number | undefined
  >()
  const [selectedColumn, setSelectedColumn] = useState<number>(0)
  const [sortAscending, setSortAscending] = useState(false)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const { loading, error, data } = useQuery<
    GetFollowedCollectorsData,
    GetFollowedCollectorsVars
  >(GET_FOLLOWED_COLLECTORS, {
    errorPolicy: 'all',
    variables: {
      userId: userId,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
    skip: !userId,
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

  if (loading) return <ExplorePanelSkeleton />

  const formatAppraisal = (appraisal) => {
    return appraisal
      ? formatNumber(appraisal, { fromWei: true, decimals: 2 })
      : appraisal
  }

  return (
    <>
      {data?.usersFollowedByUser?.length ? (
        <>
          <CollectorAccordionHead>
            <Text>Collector</Text>
            {name && (
              <Text sx={{ whiteSpace: 'nowrap' }}>
                {`${isMobile ? '' : name} Count`}
              </Text>
            )}
            {!name && <Text sx={{ whiteSpace: 'nowrap' }}>NFT Count</Text>}
          </CollectorAccordionHead>
          <CollectorAccordion>
            {data?.usersFollowedByUser
              ?.sort((owner1, owner2) => {
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
                    linkComponent={NextLink}
                    address={addresses?.[0].address}
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
                    onCopyAddress={() => {
                      dispatch(
                        setAlertState({
                          showAlert: true,
                          alertText: 'Address copied to clipboard!',
                        })
                      )
                    }}
                    nftCollection={(selectedExtraCollections[id] || assets).map(
                      ({ mediaUrl, id }) => ({
                        id,
                        imageUrl: mediaUrl,
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
              pageCount={Math.ceil(
                (data?.usersFollowedByUser?.length ?? 0) / PAGE_SIZE
              )}
              pageRangeDisplayed={0}
              marginPagesDisplayed={0}
              onPageChange={handlePageChange}
            />
          </Flex>
        </>
      ): (
        <>
          <Text sx={{textAlign: 'center'}} as="h4">
            This user is not currently following any other collectors.
          </Text>
        </>
      )}
    </>
  )
}

export default FollowedCollectors
