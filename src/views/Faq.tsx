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
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export function FaqPanel({ onBack }: { onBack: () => void }) {

  type GmiLevel = {
    title: string
    scoreRange: string
    description: string
  }

  let gmiFactors = ['Realized/Unrealized gains', 'Number of transactions', 'Transaction volume', 'Number of NFTs owned', 'Number of Premium/Blue Chip NFTs owned', 'Age of wallet', 'Number of collections owned']
  let gmiLevels: GmiLevel[] = [
    {
      title: 'based god',
      scoreRange: '>975',
      description: 'Legendary wallets, the very biggest collectors and traders'
    },
    {
      title: 'based',
      scoreRange: '900-975',
      description: 'based'
    },
    {
      title: 'full degen',
      scoreRange: '700-900',
      description: 'Full-time degeneracy'
    },
    {
      title: 'part degen',
      scoreRange: '400-700',
      description: 'Part-time degeneracy'
    },
    {
      title: 'tourist',
      scoreRange: '100-400',
      description: 'Just browsing, mostly'
    },
    {
      title: 'ngmi',
      scoreRange: '<100',
      description: 'Sadly, ngmi'
    }
  ]
  let gmiFutureImprovements = ['Types/Superlatives/Badges', 'Leaderboards and other wallet discovery tools', 'Inclusion of 1/1 collection types', 'Social channels, audience scoring', 'Combining multiple wallets into single identity', 'Governance and DAO membership activities', 'P2E Participation', 'Support for other Chains']

  return (
    <Panel
      outlined
      backgroundColor="grey-900"
      sx={{ display: 'flex', flexDirection: 'column', gap: '16px !important', maxWidth: '800px' }}
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
          A: Upshot gmi is the grading index for NFT wallets -- a single powerful number that helps identify high performing wallets and provides novel insight into the future of metaverse identity & reputation. Complex questions like, “should we lend to this wallet?” or simple ones like “are they gonna make it?” can be quickly and confidently answered through Upshot gmi.
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: How is gmi calculated?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: Building off of previous attempts at this from projects like <Link href="https://degenscore.com/" target="_blank" rel="noopener noreferrer nofollow" component={NextLink} color="blue">Degen Score</Link>, <Link href="https://arcx.game/passport" target="_blank" rel="noopener noreferrer nofollow" component={NextLink} color="blue">ARCx Passports</Link>, and <Link href="https://www.nansen.ai/nansen-101/introducing-smart-money" target="_blank" rel="noopener noreferrer nofollow" component={NextLink} color="blue">Nansen’s Smart Money</Link>, some of the factors that go into calculating a wallet’s gmi include:
        </Text>
        <ul>
          {gmiFactors
          .map((factor, idx) => (
            <li key={idx}>
              <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                {factor}
              </Text>
            </li>
          ))}
        </ul>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          For this first version of gmi, we have made some explicit design choices to help minimize the influence manipulation and/or less-informative factors have on one’s gmi:
        </Text>
        <ol>
            <li>
              <Flex sx={{ flexDirection: 'column', gap: 2, marginBottom: '8px' }}>
                <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                  Currently gmi only contemplates a curated set of collections as opposed to the full universe of NFT collections. These curated collections are largely chosen based on whose pricing is harder to manipulate, which ones have more liquid markets, and which ones maintain certain cultural/memetic levels of influence. This set will continue to evolve as we further refine gmi and add more breadth and depth to the data behind the number. 
                </Text>
              </Flex>
            </li>
            <li>
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                  It’s common practice for NFT collectors to hold NFTs across multiple wallets. Minimally, many collectors will often have one hot wallet (or multiple) that they’re actively using to buy/sell NFTs and a cold wallet where they store their longer-term NFT positions. Because it’s difficult to know when someone is transferring NFTs between their own wallets vs someone else’s wallet, we’ve had to make a decision about how to best attribute gains to different wallets when there are transfers in between sales. For this first version of gmi, the wallet that last <i>purchased</i> the NFT will be the one attributed with the gain/loss when that NFT is sold; regardless of whether or not there were transfers between the last <i>purchase</i> and the sale.
                </Text>
                <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                  For example, let’s say <code>bigpictureguy.eth</code> buys a Bored Ape from one of their hot wallets (<code>hot1.bigpictureguy.eth</code>), then transfers it to their cold wallet for storage (<code>vault.bigpictureguy.eth</code>), then later transfers it to another one of their hot wallets (<code>hot2.bigpictureguy.eth</code>) to sell the ape from. The gain or loss from this sale, even though coming from <code>hot2.bigpictureguy.eth</code>, will be attributed to <code>hot1.bigpictureguy.eth</code> because that was the last wallet to purchase the ape.
                </Text>
              </Flex>
            </li>
        </ol>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          These design decisions come with their own set of trade-offs and may result in some unexpected numbers being displayed on someone’s gmi card. While we feel as though these decisions bring more benefits than detriments in light of the aforementioned complexities and potential for manipulation, subsequent versions of gmi will aim to solve these problems without as many compromises.
        </Text>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: What are the different levels of gmi?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: The leveling system for gmi is broken into six segments:
        </Text>
        <ul>
          {gmiLevels
          .map((level, idx) => (
            <li key={idx}>
              <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                <strong>{level.title}</strong> [{level.scoreRange}] {level.description}
              </Text>
            </li>
          ))}
        </ul>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>
          Q: How will gmi evolve?
        </Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: Reputation and degeneracy take many forms in our space and we’re just getting started in classifying to make them more useful and interoperable for builders, creators, and collectors. Areas of the market like 1/1s, editions, membership tokens, and virtual land are not contemplated in our current gmi calculations and we have only focused on Ethereum transactions at this time. 
        </Text>
        <ul>
          {gmiFutureImprovements
          .map((futureImprovement, idx) => (
            <li key={idx}>
              <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
                {futureImprovement}
              </Text>
            </li>
          ))}
        </ul>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontSize: 5, lineHeight: '3rem' }}>Q: What if I disagree with my gmi?</Text>
        <Text color="grey-500" sx={{ fontSize: 3, lineHeight: '1.4rem' }}>
          A: While this initial version of gmi will help bring context and utility to addresses and provide a new platform for persistent reputation at the intersection of DeFi and NFTs, it is by no means perfect. We’re working to evolve and refine gmi based on what our community values and the feedback we receive, so please <Link href="https://jv3yfpod32j.typeform.com/to/CZ28JWz9" target="_blank" rel="noopener noreferrer nofollow" component={NextLink} color="blue">let us know what you think</Link>.
        </Text>
      </Flex>
    </Panel>
  )
}

export default function Faq() {
  const router = useRouter()

  return (
    <>
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
