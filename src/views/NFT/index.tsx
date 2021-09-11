import { useBreakpointIndex } from '@theme-ui/match-media'
import { AppBar, Container, InputRoundedSearch } from '@upshot-tech/upshot-ui'
import { Flex, Grid, Icon, Image, Text } from '@upshot-tech/upshot-ui'
import {
  Box,
  Chart,
  Label,
  LabelAttribute,
  Pagination,
  Panel,
} from '@upshot-tech/upshot-ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'

import {
  chartData,
  collectionItems,
  transactionHistory,
} from '../Landing/constants'

function CircleColor(props: CircleColorProps) {
  return
}

export default function NFTView() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1
  const columns = ['Last Sale', 'Total Sales', '% Change']

  return (
    <Box padding={4}>
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <AppBar />
      </Container>

      <Grid
        columns={[1, 1, 1, 3]}
        sx={{
          gridTemplateColumns: ['1fr', '1fr', '1fr 3fr'],
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <video
            autoPlay
            loop
            controls
            controlsList="nodownload"
            src="https://storage.opensea.io/files/353da0d0012f94fce5999a705d9f5cc3.mp4"
            style={{
              borderRadius: '16px',
              width: '100%',
            }}
          />
          <Flex sx={{ flexDirection: 'column' }}>
            <Text variant="h2Primary">Punk #1024</Text>
            <Label size="md">82% Rarity</Label>
          </Flex>

          <Flex sx={{ gap: 4, alignItems: 'center' }}>
            <Image
              src="/img/demo/collection/CryptoPunks.png"
              alt="Avatar: CryptoPunk"
              width={32}
              sx={{ borderRadius: 'circle', height: 32, width: 32 }}
            />
            <Flex sx={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text color="grey-500" sx={{ lineHeight: 1.25, fontSize: 2 }}>
                Collection
              </Text>
              <Text
                color="grey-300"
                sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: 4 }}
              >
                CryptoPunks
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <Flex
            sx={{
              gap: 4,
              flexDirection: ['column', 'column', 'column', 'row'],
            }}
          >
            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <Panel sx={{ flexGrow: 1 }}>
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Text variant="h3Secondary">General Info</Text>

                  <Flex sx={{ gap: 4 }}>
                    <Flex sx={{ gap: 4, alignItems: 'center' }}>
                      <Image
                        src="/img/demo/collection/CryptoPunks.png"
                        alt="Avatar: CryptoPunk"
                        width={32}
                        sx={{ borderRadius: 'circle', height: 32, width: 32 }}
                      />
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          color="grey-500"
                          sx={{ lineHeight: 1.25, fontSize: 2 }}
                        >
                          Collection
                        </Text>
                        <Text
                          color="grey-300"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: 1.25,
                            fontSize: 4,
                          }}
                        >
                          CryptoPunks
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex sx={{ gap: 4, alignItems: 'center' }}>
                      <Image
                        src="/img/demo/collection/LarvaLabs.png"
                        alt="Avatar: LarvaLabs"
                        width={32}
                        sx={{ borderRadius: 'circle', height: 32, width: 32 }}
                      />
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          color="grey-500"
                          sx={{ lineHeight: 1.25, fontSize: 2 }}
                        >
                          Created By
                        </Text>
                        <Text
                          color="grey-300"
                          sx={{
                            fontWeight: 'bold',
                            lineHeight: 1.25,
                            fontSize: 4,
                          }}
                        >
                          Larva Labs
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Box>
                    <Table
                      sx={{
                        width: 'auto',
                        borderSpacing: '16px 4px',
                        marginLeft: '-16px',
                      }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Text color="grey-500" sx={{ fontSize: 2 }}>
                              Marketplace
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text>Rarible</Text>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Text color="grey-500" sx={{ fontSize: 2 }}>
                              Editions
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text>38</Text>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Flex>
              </Panel>
              <Panel sx={{ flexGrow: 1 }}>
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Text variant="h3Secondary">Statistics</Text>
                  <Box>
                    <Table
                      sx={{
                        borderSpacing: '32px 8px',
                        marginTop: '-8px',
                        marginLeft: '-32px',
                        width: 'auto',
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Text color="grey-500" sx={{ fontSize: 2 }}>
                              Price Change
                              <br />
                              from Primary Market
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text color="grey-500" sx={{ fontSize: 2 }}>
                              Original Primary
                              <br />
                              Market Price
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text color="grey-500" sx={{ fontSize: 3 }}>
                              Average
                              <br />
                              Resale Price
                            </Text>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ borderSpacing: '8px' }}>
                        <TableRow>
                          <TableCell>
                            <Text
                              sx={{
                                fontWeight: 'bold',
                                fontSize: 5,
                                color: 'green',
                              }}
                            >
                              +5%
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                              $10,000
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                              $12,000
                            </Text>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>

                  <Text variant="h3Secondary">Attributes</Text>
                  <Grid columns={2}>
                    {[...new Array(8)].map((val, key) => (
                      <LabelAttribute
                        key={key}
                        variant={Math.random() > 0.5 ? 'percentage' : 'regular'}
                        percentage="15"
                      >
                        Attribute
                      </LabelAttribute>
                    ))}
                  </Grid>
                </Flex>
              </Panel>
            </Flex>
            <Flex sx={{ flexDirection: 'column', gap: 4, flexGrow: 1 }}>
              <Panel sx={{ flexGrow: 1, display: 'flex' }}>
                <Flex sx={{ flexDirection: 'column', flexGrow: 1 }}>
                  <Text variant="h3Secondary">Pricing History</Text>
                  <Flex sx={{ gap: 4, flexGrow: 1 }}>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Text
                        color="pink"
                        variant="h3Primary"
                        sx={{ fontWeight: 'heading' }}
                      >
                        Last Sold Value
                      </Text>
                      <Label
                        color="pink"
                        currencySymbol="$"
                        variant="currency"
                        size="lg"
                      >
                        10,000
                      </Label>
                      <Text variant="h2Primary">Ξ3.50</Text>
                      <Text variant="small" color="pink">
                        +20.31 (+16.47%)
                      </Text>
                      <Text color="pink" sx={{ fontSize: 2 }}>
                        FEB 00 2021 00:00
                      </Text>
                    </Flex>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Flex sx={{ gap: 4 }}>
                        <Text
                          color="primary"
                          variant="h3Primary"
                          sx={{ fontWeight: 'heading' }}
                        >
                          Last Appraisal Value
                        </Text>

                        <Label color="blue">78%</Label>
                      </Flex>
                      <Label
                        color="primary"
                        currencySymbol="$"
                        variant="currency"
                        size="lg"
                      >
                        10,000
                      </Label>
                      <Text variant="h2Primary">Ξ3.50</Text>
                      <Text variant="small" color="blue">
                        +20.31 (+16.47%)
                      </Text>
                      <Text color="blue" sx={{ fontSize: 2 }}>
                        FEB 00 2021 00:00
                      </Text>
                    </Flex>
                  </Flex>
                  <Chart data={chartData} />
                </Flex>
              </Panel>
            </Flex>
          </Flex>
          <Panel>
            <Flex sx={{ flexDirection: 'column', gap: 4 }}>
              <Flex variant="text.h3Secondary" sx={{ gap: 2 }}>
                <Flex
                  color="primary"
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  Sale
                  <Icon icon="arrowDropUserBubble" color="primary" size={12} />
                </Flex>
                History
              </Flex>
              <Chart data={chartData} />
              <Panel inner>
                <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                  <Flex
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text variant="h3Secondary">Transaction History</Text>
                    <Text>
                      <InputRoundedSearch hasButton />
                    </Text>
                  </Flex>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell color="grey-500">Date</TableCell>
                        {!isMobile && (
                          <>
                            <TableCell color="grey-500">Sender</TableCell>
                            <TableCell color="grey-500">Recipient</TableCell>
                          </>
                        )}

                        <TableCell color="grey-500">Sale Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionHistory.map(
                        ({ date, sender, recipient, price }, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ width: '100%' }}>{date}</TableCell>
                            {!isMobile && (
                              <>
                                <TableCell sx={{ minWidth: 140 }}>
                                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                                    <Box
                                      sx={{
                                        borderRadius: 'circle',
                                        bg: 'yellow',
                                        width: 3,
                                        height: 3,
                                      }}
                                    />
                                    <Text>{sender}</Text>
                                  </Flex>
                                </TableCell>
                                <TableCell sx={{ minWidth: 140 }}>
                                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                                    <Box
                                      sx={{
                                        borderRadius: 'circle',
                                        bg: 'purple',
                                        width: 3,
                                        height: 3,
                                      }}
                                    />
                                    <Text>{sender}</Text>
                                  </Flex>
                                </TableCell>
                              </>
                            )}
                            <TableCell sx={{ minWidth: 100, color: 'pink' }}>
                              Ξ{price}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>

                  <Flex sx={{ justifyContent: 'center', marginTop: -1 }}>
                    <Pagination
                      pageCount={100}
                      pageRangeDisplayed={isMobile ? 3 : 5}
                      marginPagesDisplayed={isMobile ? 1 : 5}
                    />
                  </Flex>
                </Flex>
              </Panel>
            </Flex>
          </Panel>
          <Panel sx={{ flexGrow: 1 }}>
            <Text variant="h3Secondary">Statistics</Text>
            <Flex
              sx={{
                gap: 4,
                flexDirection: ['column', 'column', 'column', 'row'],
              }}
            >
              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                <Table
                  sx={{
                    borderSpacing: '32px 8px',
                    marginTop: '-8px',
                    marginLeft: '-32px',
                    width: 'auto',
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Text color="grey-500" sx={{ fontSize: 2 }}>
                          Price Change
                          <br />
                          from Primary Market
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text color="grey-500" sx={{ fontSize: 2 }}>
                          Orginal Primary
                          <br />
                          Market Price
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text color="grey-500" sx={{ fontSize: 2 }}>
                          Average
                          <br />
                          Resale Price
                        </Text>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ borderSpacing: '8px' }}>
                    <TableRow>
                      <TableCell>
                        <Text
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 5,
                            color: 'green',
                          }}
                        >
                          +5%
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                          $10,000
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                          $12,000
                        </Text>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Text variant="h3Secondary">Attributes</Text>
                <Grid columns={2}>
                  {[...new Array(8)].map((val, key) => (
                    <LabelAttribute
                      key={key}
                      variant={Math.random() > 0.5 ? 'percentage' : 'regular'}
                      percentage="15"
                    >
                      Attribute
                    </LabelAttribute>
                  ))}
                </Grid>
              </Flex>
              <Box sx={{ flexGrow: 1 }}>
                <Panel inner>
                  <Flex sx={{ flexDirection: 'column', gap: 4 }}>
                    <Text>Attribute Sale History</Text>
                    <Text color="grey-500" sx={{ fontSize: 3 }}>
                      Select attributes from this NFT to view the pricing
                      history of NFTs with similar traits.
                    </Text>
                  </Flex>
                </Panel>
              </Box>
            </Flex>
          </Panel>
        </Flex>
      </Grid>

      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        [Footer]
      </Container>
    </Box>
  )
}
