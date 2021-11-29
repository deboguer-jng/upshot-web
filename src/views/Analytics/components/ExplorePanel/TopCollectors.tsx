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

export default function TopCollectors() {
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
    variables: { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
  })

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return <div>There was an error completing your request.</div>

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.['owners']?.length)
    return <div>No results available.</div>

  return (
    <>
      <CollectorAccordionHead>
        <Text>Collector</Text>
        {/* <Text sx={{ whiteSpace: 'nowrap' }}>Total Appraised Value</Text> */}
      </CollectorAccordionHead>
      <CollectorAccordion>
        {data.getOwnersByWhaleness['owners'].map(
          ({ username, addresses, ownedAssets }, idx) => (
            <CollectorAccordionRow
              address={addresses?.[0]}
              key={idx}
              {...{ username }}
            >
              <div style={{ display: 'grid' }}>
                <Text sx={{ fontSize: 4, fontWeight: 'heading' }}>
                  Most Notable NFTs
                </Text>
                {!isMobile && (
                  <Text
                    sx={{
                      fontWeight: 'heading',
                      color: theme.colors.blue,
                      paddingBottom: '12px',
                      fontSize: 2,
                    }}
                  >
                    {addresses[0]}
                  </Text>
                )}
              </div>
              <MiniNFTContainer>
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
                        link={`https://app.upshot.io/analytics/collection/${collection?.id}`}
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