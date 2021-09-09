import { useBreakpointIndex } from '@theme-ui/match-media'
import { AppBar, Chart, Container, Pagination } from '@upshot-tech/upshot-ui'
import { Box, Flex, Icon, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import { CollectionButton, Image } from '@upshot-tech/upshot-ui'
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@upshot-tech/upshot-ui'
import { CollectionRow, CollectionTable } from '@upshot-tech/upshot-ui'

import ButtonTabs from './ButtonTabs'
import CollectionPanel from './CollectionPanel'
import { cardItems, chartData, collectionItems } from './constants'
import ExplorePanel from './ExplorePanel'
import { MiniNFTContainer } from './Styled'

export default function LandingView() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const columns = ['Last Sale', 'Total Sales', '% Change']

  return (
    <Container
      p={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        gap: 4,
      }}
    >
      <AppBar />
      <Flex sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 5 }}>
        <Text variant="h1Secondary">Top Collections</Text>
        <ButtonTabs />

        <Box>
          <Chart data={chartData} />
        </Box>

        <CollectionPanel
          title="Collection Avg. Price"
          subtitle="(Select Collections to change graph)"
        >
          {collectionItems.map(({ text, subText, src }, idx) => (
            <Flex
              key={idx}
              sx={{ alignItems: 'center', color: 'disabled', gap: 2 }}
            >
              <Text>{idx + 1}</Text>
              <CollectionButton
                icon={
                  <Image
                    alt={`${text} Cover Artwork`}
                    height="100%"
                    width="100%"
                    sx={{ borderRadius: 'circle' }}
                    {...{ src }}
                  />
                }
                {...{ text, subText }}
              />
            </Flex>
          ))}
        </CollectionPanel>
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
        <MiniNFTContainer>
          {cardItems.map(({ image }, key) => (
            <MiniNftCard price="$20.00" rarity="15%" key={key} {...{ image }} />
          ))}
        </MiniNFTContainer>
        <ExplorePanel title="Explore">
          <CollectionTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Name</TableCell>
                {isMobile ? (
                  // Mobile only shows the first and last columns
                  <TableCell sx={{ minWidth: 100 }}>Details</TableCell>
                ) : (
                  <>
                    {columns.map((col, key) => (
                      <TableCell key={key} sx={{ minWidth: 100 }}>
                        {col}
                      </TableCell>
                    ))}
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {collectionItems.map(({ text, src }, idx) => (
                <CollectionRow dark title={text} imageSrc={src} key={idx}>
                  {isMobile ? (
                    <TableCell sx={{ maxWidth: 100 }}>
                      <Flex
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Flex>{columns[1]}</Flex>
                        <Flex>{columns[columns.length - 1]}</Flex>
                      </Flex>
                    </TableCell>
                  ) : (
                    columns.map((column, key) => (
                      <TableCell key={key} sx={{ maxWidth: 100 }}>
                        {column}
                      </TableCell>
                    ))
                  )}
                </CollectionRow>
              ))}
            </TableBody>
          </CollectionTable>

          <Flex sx={{ justifyContent: 'center', marginTop: -1 }}>
            <Pagination
              pageCount={100}
              pageRangeDisplayed={isMobile ? 3 : 5}
              marginPagesDisplayed={isMobile ? 1 : 5}
            />
          </Flex>
        </ExplorePanel>
      </Flex>
      [Footer]
    </Container>
  )
}
