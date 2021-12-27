/** @jsxImportSource theme-ui */
import { useQuery } from '@apollo/client'
import {
  BlurrySquareTemplate,
  Box,
  Flex,
  MiniNftCard,
  SwitchDropdown,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { PIXELATED_CONTRACTS } from 'constants/'
import { formatDistance } from 'date-fns'
import { BigNumber as BN } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'
import { weiToEth } from 'utils/number'

import {
  GET_COLLECTION_AVG_PRICE,
  GET_TOP_SALES,
  GetCollectionAvgPriceData,
  GetCollectionAvgPriceVars,
  GetTopSalesData,
  GetTopSalesVars,
} from '../queries'
import { MiniNFTContainer } from './Styled'

export const WINDOWS = {
  HOUR: '1 Hour',
  DAY: '1 Day',
  WEEK: '1 Week',
  MONTH: '1 Month',
  ALLTIME: 'All time',
}

export type WINDOW = keyof typeof WINDOWS

function TopSellingCollectionNFTsHeader({
  period,
  setPeriod,
  topSellingType,
  setTopSellingType,
}: {
  period?: string
  setPeriod?: (val: string) => void
  topSellingType?: string
  setTopSellingType?: (val: string) => void
}) {
  const breakpointIndex = useBreakpointIndex()
  const [open, setOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)

  return (
    <Box
      variant="text.h1Secondary"
      sx={{
        gap: 2,
        alignItems: 'flex-start',
        paddingBottom: '1rem',
        position: 'absolute',
        width: '100%',
        height: open || collectionOpen ? '100%' : 'auto',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 2,
        '&,& *': breakpointIndex <= 1 && {
          lineHeight: '2rem !important',
        },
      }}
    >
      Top Selling
      {!!setTopSellingType ? (
        <SwitchDropdown
          onValueChange={(val) => setTopSellingType?.(val)}
          onToggle={(status) => {
            setCollectionOpen(status)
          }}
          value={topSellingType ?? ''}
          options={['NFTs', 'Collections']}
          sx={{
            display: 'inline-block',
            marginLeft: '0.3rem',
            marginRight: '0.3rem',
          }}
        />
      ) : (
        ' '
      )}
      in
      {!!setPeriod ? (
        <SwitchDropdown
          onValueChange={(val) => setPeriod?.(val)}
          onToggle={(status) => {
            setOpen(status)
          }}
          value={period ?? ''}
          options={['1 day', '1 week', '1 month']}
          sx={{
            display: 'inline-block',
            marginLeft: '0.3rem',
            marginRight: '0.3rem',
          }}
        />
      ) : (
        <></>
      )}
    </Box>
  )
}

export default function TopSellingCollectionNFTs({
  collectionId,
}: {
  collectionId?: number
}) {
  const router = useRouter()
  const [period, setPeriod] = useState('1 day')
  const [topSellingType, setTopSellingType] = useState('NFTs')
  const breakpointIndex = useBreakpointIndex()
  const { loading, error, data } = useQuery<GetTopSalesData, GetTopSalesVars>(
    GET_TOP_SALES,
    {
      errorPolicy: 'all',
      variables: {
        limit: 10,
        windowSize:
          period === '1 day' ? 'DAY' : period === '1 week' ? 'WEEK' : 'MONTH',
        collectionId,
      },
    }
  ) // Using `all` to include data with errors.

  const {
    loading: collectionLoading,
    error: collectionError,
    data: collectionData,
  } = useQuery<GetCollectionAvgPriceData, GetCollectionAvgPriceVars>(
    GET_COLLECTION_AVG_PRICE,
    {
      variables: {
        metric: 'VOLUME',
        windowSize:
          period === '1 day' ? 'DAY' : period === '1 week' ? 'WEEK' : 'MONTH',
        limit: 10,
      },
    }
  )

  const handleClickNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  if (loading || collectionLoading)
    return (
      <>
        <TopSellingCollectionNFTsHeader
          period={period}
          setPeriod={(val) => setPeriod(val)}
          topSellingType={topSellingType}
          setTopSellingType={(val) => setTopSellingType(val)}
        />
        <MiniNFTContainer
          sx={{ paddingTop: '80px' }}
        >
          {[...new Array(10)].map((_, idx) => (
            <BlurrySquareTemplate key={idx} />
          ))}
        </MiniNFTContainer>
      </>
    )

  if (error || collectionError)
    return (
      <>
        <TopSellingCollectionNFTsHeader
          period={period}
          setPeriod={(val) => setPeriod(val)}
          topSellingType={topSellingType}
          setTopSellingType={(val) => setTopSellingType(val)}
        />
        There was an error completing your request.
      </>
    )

  if (
    !data?.topSales.length ||
    !collectionData?.orderedCollectionsByMetricSearch?.assetSets.length
  )
    return (
      <Flex
        sx={{
          paddingBottom: '2rem',
          zIndex: 5,
        }}
      >
        <TopSellingCollectionNFTsHeader
          period={period}
          setPeriod={(val) => setPeriod(val)}
          topSellingType={topSellingType}
          setTopSellingType={(val) => setTopSellingType(val)}
        />
        <text sx={{ paddingTop: '80px' }}>
          No results available.{' '}
        </text>
      </Flex>
    )

  const getSalesNumber = (state) => {
    switch (period) {
      case '1 day':
        return `${BN.from(state.pastDayWeiVolume)
          .div(BN.from(state.pastDayWeiAverage))
          .toNumber()}`
      case '1 week':
        return `${BN.from(state.pastWeekWeiVolume)
          .div(BN.from(state.pastWeekWeiAverage))
          .toNumber()}`
      case '1 month':
        return `${state.pastMonthNumTxs}`
    }
  }

  return (
    <>
      <TopSellingCollectionNFTsHeader
        period={period}
        setPeriod={(val) => setPeriod(val)}
        topSellingType={topSellingType}
        setTopSellingType={(val) => setTopSellingType(val)}
      />
      <MiniNFTContainer
        sx={{ paddingTop: '80px' }}
      >
        {topSellingType === 'NFTs' ? (
          <>
            {data.topSales.map(
              (
                {
                  txAt,
                  txFromAddress,
                  txToAddress,
                  price,
                  asset: {
                    id,
                    contractAddress,
                    previewImageUrl,
                    mediaUrl,
                    rarity,
                    collection,
                  },
                },
                key
              ) => (
                <a
                  key={key}
                  onClick={() => handleClickNFT(id)}
                  style={{ cursor: 'pointer' }}
                >
                  <MiniNftCard
                    price={price ? weiToEth(price) : undefined}
                    to={shortenAddress(txToAddress, 2, 4)}
                    toLink={`/analytics/user/${txToAddress}`}
                    from={shortenAddress(txFromAddress, 2, 4)}
                    fromLink={`/analytics/user/${txFromAddress}`}
                    rarity={rarity ? rarity.toFixed(2) + '%' : '-'}
                    image={previewImageUrl ?? mediaUrl}
                    date={formatDistance(txAt * 1000, new Date())}
                    pixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
                    link={`/analytics/collection/${collection?.id}`}
                  />
                </a>
              )
            )}
          </>
        ) : (
          <>
            {collectionData?.orderedCollectionsByMetricSearch.assetSets.map(
              ({ id, name, imageUrl, latestStats }) => (
                <Link key={id} href={`/analytics/collection/${id}`}>
                  <a style={{ textDecoration: 'none' }}>
                    <MiniNftCard
                      tooltip={`volume / ${period}`}
                      price={
                        latestStats?.pastDayWeiVolume
                          ? weiToEth(latestStats.pastDayWeiVolume)
                          : undefined
                      }
                      name={name}
                      type="collection"
                      image={imageUrl}
                      floorPrice={
                        latestStats?.floor
                          ? weiToEth(latestStats.floor)
                          : undefined
                      }
                      sales={getSalesNumber(latestStats)}
                      link={`/analytics/collection/${id}`}
                    />
                  </a>
                </Link>
              )
            )}
          </>
        )}
      </MiniNFTContainer>
    </>
  )
}
