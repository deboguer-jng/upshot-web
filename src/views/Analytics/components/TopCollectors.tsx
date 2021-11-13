import { useQuery } from '@apollo/client'
import { useBreakpointIndex } from '@theme-ui/match-media'
import {
  Box,
  CollectorAccordion,
  CollectorAccordionHead,
  CollectorAccordionRow,
  MiniNftCard,
  Skeleton,
  TableCell,
  Text,
  theme,
} from '@upshot-tech/upshot-ui'
import { PAGE_SIZE, PIXELATED_CONTRACTS } from 'constants/'
import makeBlockie from 'ethereum-blockies-base64'
import { useRouter } from 'next/router'
import { formatUsername } from 'utils/address'
import { shortenAddress } from 'utils/address'
import { getAssetName } from 'utils/asset'
import { weiToEth } from 'utils/number'

import {
  GET_TOP_COLLECTORS,
  GetTopCollectorsData,
  GetTopCollectorsVars,
} from '../queries'
import { MiniNFTContainer } from './Styled'

export default function TopCollectors() {
  const router = useRouter()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const { loading, error, data } = useQuery<
    GetTopCollectorsData,
    GetTopCollectorsVars
  >(GET_TOP_COLLECTORS, {
    errorPolicy: 'all',
    variables: { limit: 10 },
  })

  const handleClickNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  const ExplorePanelSkeleton = () => {
    return (
      <CollectorAccordion>
        {[...new Array(PAGE_SIZE)].map((_, idx) => (
          <CollectorAccordionRow key={idx}>
            <Skeleton sx={{ height: 56 }} as="tr" key={idx}>
              <TableCell colSpan={5}>
                <Box sx={{ height: 40, width: '100%' }} />
              </TableCell>
            </Skeleton>
          </CollectorAccordionRow>
        ))}
      </CollectorAccordion>
    )
  }

  /* Load state. */
  if (loading) return <ExplorePanelSkeleton />

  /* Error state. */
  if (error) return null

  /* No results state. */
  if (!data?.getOwnersByWhaleness?.['owners']?.length) return null

  return (
    <>
      <CollectorAccordionHead>
        <Text>Collector</Text>
        <Text sx={{ whiteSpace: 'nowrap' }}>Total Appraised Value</Text>
      </CollectorAccordionHead>
      <CollectorAccordion>
        {data.getOwnersByWhaleness['owners'].map(
          (
            { username, addresses, totalAssetAppraisedValue, ownedAssets },
            idx
          ) => (
            <CollectorAccordionRow
              avatarImageUrl={
                addresses?.[0] ? makeBlockie(addresses[0]) : undefined
              }
              name={formatUsername(username ?? addresses?.[0] ?? 'Unknown')}
              portfolioValue='soon'
              key={idx}
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
    </>
  )
}
