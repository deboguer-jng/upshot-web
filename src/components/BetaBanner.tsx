import styled from '@emotion/styled'
import { Flex, Text } from 'theme-ui'

const BetaBannerBase = styled.div`
  position: sticky;
  top: 0;
  padding: ${({ theme }) => theme.space[4] + 'px'};
  background: ${({ theme }) => theme.colors['grey-800']};
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.nav + 2};
`

export const BetaBanner = () => (
  <BetaBannerBase>
    <Flex sx={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        color="primary"
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: 4,
          flexShrink: [1, 0, 0],
        }}
      >
        Upshot Beta
      </Text>
      <Text color="grey-400" sx={{ fontSize: 2 }}>
        This is a beta version of Upshot Analytics.{' '}
        <a
          href="https://jv3yfpod32j.typeform.com/to/CZ28JWz9"
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{ color: 'inherit' }}
        >
          Give us feedback.
        </a>
      </Text>
    </Flex>
  </BetaBannerBase>
)
