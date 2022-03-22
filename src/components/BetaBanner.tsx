import styled from '@emotion/styled'
import { Icon, Link } from '@upshot-tech/upshot-ui'
import { Flex, Text } from 'theme-ui'

const BetaBannerBase = styled.div`
  position: sticky;
  top: 0;
  padding: ${({ theme }) => theme.space[4] + 'px'};
  background: ${({ theme }) => theme.colors['grey-800']};
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.nav + 2};
`

interface BetaBannerProps {
  error?: boolean
}

export const BetaBanner = ({ error = false }: BetaBannerProps) => (
  <BetaBannerBase>
    {!error ? <Flex sx={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        color="primary"
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: 4,
          flexShrink: [1, 0],
        }}
      >
        Upshot Beta
      </Text>
      <Text color="grey-400" sx={{ fontSize: 2 }}>
        This is a beta version of Upshot Analytics.{' '}
        <Link
          href="https://jv3yfpod32j.typeform.com/to/CZ28JWz9"
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{ color: 'inherit' }}
        >
          Give us feedback.
        </Link>
      </Text>
    </Flex> : (
      <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Icon size={20} icon="warning" color='red' />
        <Text color="red" > We are having trouble pulling data from our partners right now; please refer back soon! </Text>
      </Flex>
    )}
  </BetaBannerBase>
)
