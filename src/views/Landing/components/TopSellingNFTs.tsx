import { useQuery } from '@apollo/client'
import {
  BlurrySquareTemplate,
  Flex,
  Icon,
  MiniNftCard,
} from '@upshot-tech/upshot-ui'
import { formatDistance } from 'date-fns'
import { useRouter } from 'next/router'
import { shortenAddress } from 'utils/address'
import { weiToEth } from 'utils/number'

import { GET_TOP_SALES, GetTopSalesData, GetTopSalesVars } from '../queries'
import { MiniNFTContainer } from './Styled'

export const WINDOWS = {
  HOUR: '1 Hour',
  DAY: '1 Day',
  WEEK: '1 Week',
  MONTH: '1 Month',
  ALLTIME: 'All time',
}

export type WINDOW = keyof typeof WINDOWS

function TopSellingNFTsHeader() {
  return (
    <Flex variant="text.h3Secondary" sx={{ gap: 2 }}>
      Top Selling NFTs in
      <Flex
        color="primary"
        sx={{ justifyContent: 'center', alignItems: 'center', gap: 2 }}
      >
        1 Day
        <Icon icon="arrowDropUserBubble" color="primary" size={12} />
      </Flex>
    </Flex>
  )
}

export default function TopSellingNFTs() {
  const router = useRouter()
  const { loading, error, data } = useQuery<GetTopSalesData, GetTopSalesVars>(
    GET_TOP_SALES,
    {
      errorPolicy: 'all',
      variables: { limit: 10, windowSize: 'ALLTIME' },
    }
  ) // Using `all` to include data with errors.

  const handleClickNFT = (id: string) => {
    router.push('/nft/' + id)
  }

  if (loading)
    return (
      <>
        <TopSellingNFTsHeader />
        <MiniNFTContainer>
          {[...new Array(10)].map((_, idx) => (
            <BlurrySquareTemplate key={idx} />
          ))}
        </MiniNFTContainer>
      </>
    )

  if (error)
    return (
      <>
        <TopSellingNFTsHeader />
        There was an error completing your request.
      </>
    )

  if (!data?.topSales.length)
    return (
      <>
        <TopSellingNFTsHeader />
        No results available.
      </>
    )

  return (
    <>
      <MiniNFTContainer>
        {data.topSales.map(
          (
            {
              txAt,
              txFromAddress,
              txToAddress,
              asset: { id, previewImageUrl, mediaUrl, lastSale, rarity },
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
                  lastSale?.ethSalePrice
                    ? weiToEth(lastSale.ethSalePrice)
                    : undefined
                }
                to={shortenAddress(txToAddress, 2, 4)}
                from={shortenAddress(txFromAddress, 2, 4)}
                rarity={rarity ? rarity.toFixed(2) + '%' : '-'}
                image={previewImageUrl ?? mediaUrl}
                date={formatDistance(txAt * 1000, new Date())}
              />
            </a>
          )
        )}
      </MiniNFTContainer>
    </>
  )
}
