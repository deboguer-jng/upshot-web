import { useBreakpointIndex } from '@theme-ui/match-media'
import { ButtonDropdown, Container, Navbar } from '@upshot-tech/upshot-ui'
import { Box, Flex, Grid, MiniNftCard, Text } from '@upshot-tech/upshot-ui'
import { InputRounded, Pagination } from '@upshot-tech/upshot-ui'

import { cardItems } from '../Landing/constants'

export default function SearchView() {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  return (
    <>
      <Container
        p={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Navbar />
      </Container>

      <Grid
        columns={[1, 1, 1, 3]}
        sx={{
          gridTemplateColumns: ['1fr', '1fr', '1fr 3fr', '1fr 3fr 1fr'],
        }}
      >
        <Flex
          paddingX={8}
          sx={{
            position: ['static', 'static', 'static', 'sticky'],
            top: 0,
            alignSelf: 'flex-start',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                <Text variant="h3Secondary" color="grey-500">
                  Search Filters
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Text color="grey-500">Pricing Range (min - max)</Text>
              <Flex sx={{ gap: 4 }}>
                <InputRounded placeholder="Ξ Min" sx={{ maxWidth: 128 }} />
                <InputRounded placeholder="Ξ Max" sx={{ maxWidth: 128 }} />
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Text variant="h3Secondary" color="grey-500">
                Keywords
              </Text>
              <InputRounded placeholder="Search terms" />
            </Flex>
          </Box>
        </Flex>
        <Flex
          paddingX={8}
          sx={{ flex: '1 1 auto', flexDirection: 'column', gap: 4 }}
        >
          <Flex sx={{ flexDirection: 'column' }}>
            <Text>Search Results for</Text>
            <Text variant="h1Primary">Monkey</Text>
          </Flex>

          <Flex sx={{ alignItems: 'center' }}>
            <Text>NFTs</Text>
            <ButtonDropdown
              name="Sort By"
              options={['Most Rare']}
              value="Most Rare"
            />
          </Flex>

          <Grid
            gap={5}
            sx={{
              gridTemplateColumns: 'repeat(auto-fill, 156px)',
            }}
          >
            {[...new Array(3)]
              .map((_) => cardItems)
              .flat()
              .map(({ image }, key) => (
                <MiniNftCard
                  price="$20.00"
                  rarity="15%"
                  key={key}
                  {...{ image }}
                />
              ))}
          </Grid>

          <Flex sx={{ justifyContent: 'center' }}>
            <Pagination
              pageCount={100}
              pageRangeDisplayed={isMobile ? 3 : 5}
              marginPagesDisplayed={isMobile ? 1 : 5}
            />
          </Flex>
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
        <Footer />
      </Container>
    </>
  )
}
