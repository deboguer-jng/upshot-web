import {
  Box,
  Flex,
  Icon,
  Link,
  Modal,
  Panel,
  Text,
} from '@upshot-tech/upshot-ui'
import FooterModal from 'components/FooterModal'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export function FaqPanel({ onBack }: { onBack: () => void }) {
  return (
    <Panel
      outlined
      backgroundColor="grey-900"
      sx={{ display: 'flex', flexDirection: 'column', gap: '16px !important' }}
    >
      <Flex
        onClick={onBack}
        sx={{ alignItems: 'center', gap: 2, cursor: 'pointer' }}
      >
        <Icon icon="arrowSmallLeft" size={24} />
        <Text variant="h1Primary">FAQ</Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>Q: What is gmi?</Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: The answer.
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: How is gmi calculated?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: The answer.
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: What are the different levels of gmi?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: The answer.
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: Why even calculate someone&apos;s gmi?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: The answer.
        </Text>
      </Flex>
    </Panel>
  )
}

export default function Faq() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>gmi | Upshot Analytics</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@UpshotHQ" />
        <meta name="twitter:creator" content="@UpshotHQ" />
        <meta property="og:url" content="https://upshot.io" />
        <meta property="og:title" content="Upshot Analytics" />
        <meta
          property="og:description"
          content="NFTs offer us a vehicle for tokenizing anything, while the explosive growth of DeFi has demonstrated the power of permissionless financial primitives. Upshot is building scalable NFT pricing infrastructure at the intersection of DeFi x NFTs. Through a combination of crowdsourced appraisals and proprietary machine learning algorithms, Upshot provides deep insight into NFT markets and unlocks a wave of exotic new DeFi possibilities."
        />
        <meta
          property="og:image"
          content="https://upshot.io/img/opengraph/opengraph_analytics.jpg"
        />
      </Head>
      <Box
        sx={{
          position: 'fixed',
          backgroundImage: 'url(/img/arch_planets.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Modal backdropBlur fullWidth open>
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minHeight: '100vh',
          }}
        >
          <Link href="/" component={NextLink}>
            <img
              src="/img/upshot_logo_white.svg"
              width="100%"
              alt="Upshot Logo"
              style={{ margin: '32px auto 0 auto', maxWidth: 192 }}
            />
          </Link>

          <Flex
            sx={{
              alignItems: 'center',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              padding: 4,
              width: '100%',
            }}
          >
            <FaqPanel onBack={() => router.back()} />
          </Flex>

          <FooterModal />
        </Flex>
      </Modal>
    </>
  )
}
