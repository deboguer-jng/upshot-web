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
import { useState } from 'react'
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
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [page, setPage] = useState(0)

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleClickNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  const { loading, error, data } = useQuery<
    GetTopCollectorsData,
    GetTopCollectorsVars
  >(GET_TOP_COLLECTORS, {
    errorPolicy: 'all',
    variables: { limit: PAGE_SIZE, offset: page * PAGE_SIZE, searchTerm },
  })

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return <div>There was an error completing your request.</div>

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
          ({ username, addresses, ownedAssets }, idx) => (
            <CollectorAccordionRow
              address={addresses?.[0].address}
              key={idx}
              onClick={() => handleShowCollector(addresses?.[0].address)}
              defaultOpen={idx === 0 ? true : false}
              {...{ username }}
            >
              <div style={{ display: 'grid' }}>
                <a
                  href={`/analytics/user/${addresses[0].address}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Text
                    variant="h3Primary"
                    sx={{
                      color: 'primary',
                      paddingBottom: '12px',
                      fontSize: 4,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Portfolio
                  </Text>
                </a>
                <Text sx={{ fontSize: 4, fontWeight: 'heading' }}>
                  Most Notable NFTs
                </Text>
              </div>
              <MiniNFTContainer onClick={(e) => e.stopPropagation()}>
                {ownedAssets?.assets?.map(
                  (
                    {
                      id,
                      name,
                      creatorAddress,
                      creatorUsername,
                      rarity,
                      latestAppraisal,
                      mediaUrl,
                      tokenId,
                      contractAddress,
                      collection,
                      previewImageUrl,
                    },
                    key
                  ) => (
                    <a
                      key={key}
                      onClick={() => handleClickNFT(id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <MiniNftCard
                        price={
                          latestAppraisal?.estimatedPrice
                            ? weiToEth(latestAppraisal?.estimatedPrice)
                            : undefined
                        }
                        rarity={rarity ? rarity.toFixed(2) + '%' : '-'}
                        image={previewImageUrl ?? mediaUrl}
                        creator={
                          creatorUsername ||
                          shortenAddress(creatorAddress, 2, 4)
                        }
                        pixelated={PIXELATED_CONTRACTS.includes(
                          contractAddress
                        )}
                        type="search"
                        name={getAssetName(name, collection?.name, tokenId)}
                        link={`/analytics/collection/${collection?.id}`}
                      />
                    </a>
                  )
                )}
              </MiniNFTContainer>
            </CollectorAccordionRow>
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
