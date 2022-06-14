import { useQuery } from '@apollo/client'
import {
  Box,
  CollectionGridRow,
  Flex,
  formatNumber,
  Grid,
  Pagination,
  Text,
  useBreakpointIndex
} from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getPriceChangeColor } from 'utils/color'
import { getUnderOverPricedLabel } from 'utils/number'
import { formatDistance } from 'utils/time'
import {
GET_FOLLOWED_NFTS,
  GetFollowedNFTsData,
  GetFollowedNFTsVars} from 'views/Analytics/User/queries'

import { PAGE_SIZE, PIXELATED_CONTRACTS } from '../../../../constants'
import {
  ExplorePanelSkeleton,
  NFTItemsWrapper,
  NFTTableHead
} from '../ExplorePanel/NFTs'




export const nftColumns = {
  LAST_SALE_DATE: 'Last Sale',
  LAST_SALE_PRICE: 'Last Sale Price',
  LAST_APPRAISAL_PRICE: 'Latest Appraisal',
  LAST_APPRAISAL_SALE_RATIO: '% Difference',
}

const colSpacing =
  '46px minmax(100px,3fr) minmax(80px, 1fr) minmax(110px, 1fr) minmax(120px, 1fr) minmax(80px, 1fr) 40px'

const FollowedNFTs = ({ userId }: { userId?: number }) => {
  const breakpointIndex = useBreakpointIndex()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const isMobile = breakpointIndex <= 1
  const [selectedColumn, setSelectedColumn] = useState<number>(0)
  const [sortAscending, setSortAscending] = useState(false)
  const { loading, error, data } = useQuery<
    GetFollowedNFTsData,
    GetFollowedNFTsVars
  >(GET_FOLLOWED_NFTS, {
    errorPolicy: 'all',
    variables: {
      userId: userId,
    },
    skip: !userId,
  })

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected)
  }

  const handleShowNFT = (id: string) => {
    router.push('/analytics/nft/' + id)
  }

  if (loading) {
    return <ExplorePanelSkeleton>
      <NFTTableHead
        {...{ selectedColumn, sortAscending, handleChangeSelection: () => {} }}
      />
    </ExplorePanelSkeleton>
  }

  return (
    <>
      <NFTItemsWrapper
        {...{ selectedColumn, sortAscending, handleChangeSelection: () => {} }}
      >
        {data?.assetsFollowedByUser.map(
          (
            {
              id,
              name,
              contractAddress,
              mediaUrl,
              lastSale,
              lastAppraisalWeiPrice,
              lastAppraisalSaleRatio,
            },
            idx
          ) => (
            <CollectionGridRow
              variant="black"
              title={name}
              imageSrc={mediaUrl}
              key={idx}
              defaultOpen={idx === 0 ? true : false}
              onClick={() => handleShowNFT(id)}
              pixelated={PIXELATED_CONTRACTS.includes(contractAddress)}
              href={`/analytics/nft/${id}`}
              linkComponent={NextLink}
              columns={colSpacing}
            >
              {isMobile ? (
                <Grid columns={['1fr 1fr']} sx={{ padding: 4 }}>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {nftColumns.LAST_SALE_DATE}
                    </Text>
                    <Text>
                      {lastSale?.timestamp
                        ? formatDistance(lastSale.timestamp * 1000) + ' ago'
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {nftColumns.LAST_SALE_PRICE}
                    </Text>
                    <Text>
                      {lastSale?.ethSalePrice
                        ? formatNumber(lastSale.ethSalePrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
                          })
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {nftColumns.LAST_APPRAISAL_PRICE}
                    </Text>
                    <Text>
                      {lastAppraisalWeiPrice
                        ? formatNumber(lastAppraisalWeiPrice, {
                            decimals: 4,
                            prefix: 'ETHER',
                            fromWei: true,
                          })
                        : '-'}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text sx={{ marginBottom: 1, textAlign: 'center' }}>
                      {nftColumns.LAST_APPRAISAL_SALE_RATIO}
                    </Text>
                    <Text
                      sx={{
                        color: getPriceChangeColor(lastAppraisalSaleRatio),
                      }}
                    >
                      {getUnderOverPricedLabel(lastAppraisalSaleRatio)}
                    </Text>
                  </Flex>
                </Grid>
              ) : (
                <>
                  <Box>
                    {lastSale?.timestamp
                      ? formatDistance(lastSale.timestamp * 1000) + ' ago'
                      : '-'}
                  </Box>
                  <Box>
                    {lastSale?.ethSalePrice
                      ? formatNumber(lastSale.ethSalePrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box>
                    {lastAppraisalWeiPrice
                      ? formatNumber(lastAppraisalWeiPrice, {
                          decimals: 4,
                          prefix: 'ETHER',
                          fromWei: true,
                        })
                      : '-'}
                  </Box>
                  <Box
                    sx={{
                      color: getPriceChangeColor(lastAppraisalSaleRatio),
                    }}
                  >
                    {getUnderOverPricedLabel(lastAppraisalSaleRatio)}
                  </Box>
                </>
              )}
            </CollectionGridRow>
          )
        )}
      </NFTItemsWrapper>
      <Flex sx={{ justifyContent: 'center', marginTop: '10px' }}>
        <Pagination
          forcePage={page}
          pageCount={Math.ceil(
            (data?.assetsFollowedByUser?.length ?? 0) / PAGE_SIZE
          )}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  )
}

export default FollowedNFTs
