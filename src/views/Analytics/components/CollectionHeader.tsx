import { useTheme } from '@emotion/react'
import { Avatar, Box, Button, formatNumber, Icon, imageOptimizer, InputRoundedSearch, Link, Tooltip, useBreakpointIndex } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Panel, Text } from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'
import React, { forwardRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import { selectShowHelpModal, setShowHelpModal } from 'redux/reducers/layout'

interface CollectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Collection id
   */
  collectionId: number
  /**
   * Name of the collection
   */
  name: string
  /**
   * Collection image
   */
  imageUrl: string
  /**
   * Whether or not the collection is appraised by Upshot
   */
  isAppraised: boolean
  /**
   * Number of NFTs in the collection
   */
  size?: string
  /**
   * Floor price of the collection (in Wei)
   */
  floor?: string
  /**
   * The 1W change in floor price
   */
  weekFloorChange?: number
  /**
   * The volume for the collection over the past week (in Wei)
   */
  pastWeekWeiVolume?: string
}

export default forwardRef(function CollectionPanel(
  {
    collectionId,
    name,
    imageUrl,
    isAppraised,
    size,
    floor,
    weekFloorChange,
    pastWeekWeiVolume,
    ...props
  }: CollectionHeaderProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const dispatch = useAppDispatch()
  const helpOpen = useSelector(selectShowHelpModal)
  const toggleHelpModal = () => dispatch(setShowHelpModal(!helpOpen))
  const theme = useTheme()
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
          <Grid
            columns={['1fr', '1fr', '1fr 1fr']}
            sx={{ gap: '40px' }}
          >
            <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
              <Flex
                sx={{ gap: 6, height: 100, alignItems: 'center' }}
              >
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
                      imageOptimizer(
                        imageUrl,
                        {
                          width: parseInt(
                            theme.images.avatar.xl.size
                          ),
                          height: parseInt(
                            theme.images.avatar.xl.size
                          ),
                        }
                      ) ?? imageUrl
                    }
                  />
                </Box>
                <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                    <Text
                      variant="h1Secondary"
                      sx={{ lineHeight: '2rem' }}
                    >
                      {name}
                    </Text>
                    {isAppraised && (
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
                    {size && (
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
                          {formatNumber(
                            size
                          )}
                        </Text>
                      </Flex>
                    )}
                    {floor && (
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
                            floor,
                            { fromWei: true, decimals: 2 }
                          )}
                        </Text>
                        {weekFloorChange && weekFloorChange != 0 && (
                            <Text
                              color={
                                weekFloorChange > 0
                                  ? 'green'
                                  : 'red'
                              }
                              variant="large"
                            >
                              ({weekFloorChange}%)
                            </Text>
                          )}
                      </Flex>
                    )}
                    {pastWeekWeiVolume && (
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
                            pastWeekWeiVolume,
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
                  justifyContent: 'flex-end',
                  minHeight: isMobile ? 0 : 100,
                  marginBottom: isMobile ? 5 : 0,
                  width: isMobile ? '100%' : 'auto',
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
                    Collection Analytics
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </Grid>
        </Flex>
  </Flex>
  )
})
