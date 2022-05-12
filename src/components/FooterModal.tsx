import { Flex, Icon, IconButton, Link } from '@upshot-tech/upshot-ui'
import NextLink from 'next/link'

export default function FooterModal() {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Flex sx={{ gap: 3, color: 'grey-500' }}>
        <Link
          href="/privacy.pdf"
          sx={{
            transition: 'all .1s ease',
            '&:hover': { color: 'white' },
          }}
        >
          Privacy
        </Link>
        <span>|</span>
        <Link
          href="/terms.pdf"
          sx={{
            transition: 'all .1s ease',
            '&:hover': { color: 'white' },
          }}
        >
          Terms
        </Link>
      </Flex>

      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          padding: 4,
        }}
      >
        <Link
          href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton sx={{ '&:hover': { color: 'white' } }}>
            <Icon icon="mirror" size={32} />
          </IconButton>
        </Link>
        <Link
          href="https://twitter.com/upshothq"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton sx={{ '&:hover': { color: 'white' } }}>
            <Icon icon="twitterCircle" size={32} />
          </IconButton>
        </Link>
        <Link
          href="https://discord.gg/upshot"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton sx={{ '&:hover': { color: 'white' } }}>
            <Icon icon="discord" size={32} />
          </IconButton>
        </Link>
        <Link
          href="https://www.instagram.com/upshot.hq/"
          target="_blank"
          rel="noreferrer"
          component={NextLink}
        >
          <IconButton sx={{ '&:hover': { color: 'white' } }}>
            <Icon icon="instagramCircle" size={32} />
          </IconButton>
        </Link>
      </Flex>
    </Flex>
  )
}
