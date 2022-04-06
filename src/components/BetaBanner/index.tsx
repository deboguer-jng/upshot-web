import { Icon, Link } from '@upshot-tech/upshot-ui'
import { Flex, Text } from 'theme-ui'

import { BetaBannerBase } from './Styled'

interface BetaBannerProps {
  /**
   * Display the error variant.
   */
  error?: boolean
  /**
   * Display the maintenance variant.
   */
  maintenance?: boolean
}

enum BannerVariant {
  BETA,
  ERROR,
  MAINTENANCE,
}

export const BetaBanner = ({
  error = false,
  maintenance = false,
}: BetaBannerProps) => {
  const getVariantFromPropsFlag = () => {
    if (error) return BannerVariant.ERROR
    if (maintenance) return BannerVariant.MAINTENANCE
    return BannerVariant.BETA
  }

  const variant = getVariantFromPropsFlag()

  const contentsByVariant = {
    [BannerVariant.BETA]: (
      <Flex sx={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
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
            style={{
              color: 'inherit',
              textDecoration: 'underline',
              fontSize: 'inherit',
            }}
          >
            Give us feedback.
          </Link>
        </Text>
      </Flex>
    ),
    [BannerVariant.MAINTENANCE]: (
      <Flex sx={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
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
          Hi fren - we are performing site maintenance to make Upshot work even
          better for you; we&apos;ll be back later today, see you soon!
        </Text>
      </Flex>
    ),
    [BannerVariant.ERROR]: (
      <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Icon size={20} icon="warning" color="red" />
        <Text color="red">
          We are having trouble pulling data from our partners right now; please
          refer back soon!
        </Text>
      </Flex>
    ),
  }

  return <BetaBannerBase>{contentsByVariant[variant]}</BetaBannerBase>
}
