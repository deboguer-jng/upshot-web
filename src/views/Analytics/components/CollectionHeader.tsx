import { useQuery } from '@apollo/client'
import { useTheme } from '@emotion/react'
import {
  Avatar,
  Box,
  Button,
  formatNumber,
  Icon,
  imageOptimizer,
  Link,
  Skeleton,
  Tooltip,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import router from 'next/router'
import React, { forwardRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'

import {
  GET_COLLECTION,
  GetCollectionData,
  GetCollectionVars,
} from '../Search/queries'

export function CollectionHeaderSkeleton() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
        <Grid columns={['1fr', '1fr', '1fr 1fr']} sx={{ gap: '40px' }}>
          <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
            <Flex sx={{ gap: 6, height: 100, alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: '#231F20',
                  minWidth: '63px',
                  padding: isMobile ? '4px' : '8px',
                  borderRadius: '50%',

                  flexShrink: 0,
                }}
              >
                <Skeleton
                  circle={true}
                  sx={{
                    width: isMobile ? '55px' : '100px',
                    height: isMobile ? '55px' : '100px',
                    minWidth: 'unset',
                  }}
                />
              </Box>
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <Skeleton sx={{ height: '30px', width: '250px' }} />
                </Flex>
                <Skeleton sx={{ height: '25px', width: '350px' }} />
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  )
}

export default forwardRef(function CollectionHeader(
  {},
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const dispatch = useAppDispatch()
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const theme = useTheme()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const [collectionId, setCollectionId] = useState<number>()

  useEffect(() => {
    /* Parse assetId from router */
    const collectionId = router.query.id
    if (!collectionId) return

    setCollectionId(Number(collectionId))
  }, [router.query])

  const { loading, data, error } = useQuery<
    GetCollectionData,
    GetCollectionVars
  >(GET_COLLECTION, {
    errorPolicy: 'all',
    variables: { id: collectionId },
    skip: !collectionId,
  })

  return (
    <>
      {!collectionId ||
      loading ||
      error ||
      !data?.collectionById?.name ||
      !data?.collectionById?.imageUrl ? (
        <CollectionHeaderSkeleton />
      ) : (
        <Flex
          sx={{
            flex: '1 auto auto',
            flexDirection: 'column',
            width: '100%',
            gap: 6,
          }}
        >
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
              <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
                <Flex sx={{ gap: 6, height: 100, alignItems: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: '#231F20',
                      minWidth: '63px',
                      padding: isMobile ? '4px' : '8px',
                      borderRadius: '50%',

                      flexShrink: 0,
                    }}
                  >
                    <Avatar
                      size="xl"
                      sx={{
                        width: isMobile ? '55px' : '100px',
                        height: isMobile ? '55px' : '100px',
                        minWidth: 'unset',
                      }}
                      src={
                        imageOptimizer(data?.collectionById?.imageUrl, {
                          width: parseInt(theme.images.avatar.xl.size),
                          height: parseInt(theme.images.avatar.xl.size),
                        }) ?? data?.collectionById?.imageUrl
                      }
                    />
                  </Box>
                  <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
                      <Text variant="h1Secondary" sx={{ lineHeight: '2rem' }}>
                        {data?.collectionById?.name}
                      </Text>
                      {data?.collectionById?.isAppraised && (
                        <Tooltip
                          tooltip={'Appraised by Upshot'}
                          sx={{
                            marginLeft: '0',
                            marginTop: '5px',
                            height: 25,
                          }}
                        >
                          <Icon
                            icon="upshot"
                            onClick={toggleHelpModal}
                            size={25}
                            color="primary"
                          />
                        </Tooltip>
                      )}
                    </Flex>

                    <Flex
                      sx={{
                        flexDirection: 'row',
                        gap: 2,
                        flexWrap: 'wrap',
                        height: 'min-content',
                      }}
                    >
                      {data?.collectionById?.size && (
                        <Flex
                          sx={{
                            flexDirection: 'row',
                            gap: 1,
                            width: 'min-content',
                          }}
                        >
                          <Text color="grey" variant="large">
                            NFTs:
                          </Text>
                          <Text
                            color="white"
                            variant="large"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {formatNumber(data.collectionById.size)}
                          </Text>
                        </Flex>
                      )}
                      {data?.collectionById?.latestStats?.floor && (
                        <Flex
                          sx={{
                            flexDirection: 'row',
                            gap: 1,
                            width: 'min-content',
                          }}
                        >
                          <Text color="grey" variant="large">
                            Floor:
                          </Text>
                          <Text
                            color="white"
                            variant="large"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Ξ
                            {formatNumber(
                              data.collectionById.latestStats.floor,
                              { fromWei: true, decimals: 2 }
                            )}
                          </Text>
                          {data?.collectionById?.latestStats?.weekFloorChange &&
                            data?.collectionById?.latestStats
                              ?.weekFloorChange != 0 && (
                              <Text
                                color={
                                  data.collectionById.latestStats
                                    .weekFloorChange > 0
                                    ? 'green'
                                    : 'red'
                                }
                                variant="large"
                              >
                                (
                                {
                                  data.collectionById.latestStats
                                    .weekFloorChange
                                }
                                %)
                              </Text>
                            )}
                        </Flex>
                      )}
                      {data?.collectionById?.latestStats?.pastWeekWeiVolume && (
                        <Flex
                          sx={{
                            flexDirection: 'row',
                            gap: 1,
                            width: 'min-content',
                          }}
                        >
                          <Text
                            color="grey"
                            variant="large"
                            sx={{
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Volume (1W):
                          </Text>
                          <Text
                            color="white"
                            variant="large"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Ξ
                            {formatNumber(
                              data.collectionById.latestStats.pastWeekWeiVolume,
                              {
                                fromWei: true,
                                decimals: 2,
                                kmbUnits: true,
                              }
                            )}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <Flex
                  sx={{
                    marginTop: '25px',
                    minHeight: isMobile ? 0 : 100,
                    marginBottom: isMobile ? 5 : 0,
                    width: isMobile ? '100%' : 'auto',
                    gap: 4,
                  }}
                >
                  <Link
                    href={`/analytics/collection/${collectionId}`}
                    sx={{
                      width: isMobile ? '100%' : 'auto',
                    }}
                    component={NextLink}
                    noHover
                  >
                    <Button
                      icon={<Icon icon="analytics" />}
                      sx={{
                        width: isMobile ? '100%' : 'auto',
                        '& span': {
                          textTransform: 'none',
                        },
                        '&:not(:hover) svg': {
                          path: { fill: '#000 !important' },
                        },
                      }}
                    >
                      Analytics
                    </Button>
                  </Link>
                  <Link
                    href={`/analytics/collection/${collectionId}/items`}
                    sx={{
                      width: isMobile ? '100%' : 'auto',
                    }}
                    component={NextLink}
                    noHover
                  >
                    <Button
                      icon={<Icon icon="analytics" />}
                      sx={{
                        width: isMobile ? '100%' : 'auto',
                        '& span': {
                          textTransform: 'none',
                        },
                        '&:not(:hover) svg': {
                          path: { fill: '#000 !important' },
                        },
                      }}
                    >
                      items
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  )
})
