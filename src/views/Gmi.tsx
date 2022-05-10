import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Flex,
  formatNumber,
  GmiModal,
  Grid,
  Icon,
  IconButton,
  Link,
  Modal,
  parseUint256,
  ProgressBar,
  Text,
  useBreakpointIndex,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import { format } from 'date-fns'
import Head from 'next/head'
import NextLink from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setIsBeta } from 'redux/reducers/user'
import {
  selectAddress,
  setActivatingConnector,
  setAddress,
  setEns,
} from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'

import { GET_GMI, GetGmiData, GetGmiVars } from '../graphql/queries'

const StyledLink = styled.a`
  cursor: pointer;
  color: inherit;
  font-size: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const WideButton = styled(Flex)`
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.blue};
  height: 60px;
  border-radius: 14px;
  transition: ${({ theme }) => theme.transitions.default};
  padding: 0 16px;
  min-width: 200px;
  cursor: pointer;
  color: ${({ theme }) => theme.rawColors['grey-200']};
  font-size: ${({ theme }) => theme.fontSizes[3]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  user-select: none;
  flex-shrink: 0;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.default};
    color: ${({ theme }) => theme.rawColors.white};
  }
`

const GmiCardBase = styled(Flex)`
  flex-direction: column;
  gap: 32px;
  width: calc(100vw - 32px);
  max-width: 1024px;
  background: ${({ theme }) => theme['colors']['grey-900']};
  border-radius: ${({ theme }) => theme['radii']['md']};
  padding: 40px;
  border: 1px solid ${({ theme }) => theme['rawColors']['grey-700']};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.7);
`

const ShareButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  background: ${({ theme }) => theme['colors']['blue']};
  border-radius: 9999px;
`

function GmiError({
  wallet,
  onReset,
}: {
  wallet: string
  onReset?: () => void
}) {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '30px',
        background: 'grey-800',
        borderRadius: '30px',
      }}
    >
      <Text variant="h1Primary" color="grey-300">
        Oops, failure to launch.
      </Text>
      <img src="/img/failShip.svg" width={196} alt="Error requesting gmi." />
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Text color="grey-300">
          Sorry, this wallet does not have a gmi yet.
        </Text>
        <Text color="red">{wallet}</Text>
      </Flex>
      <WideButton onClick={onReset}>Try another wallet.</WideButton>
    </Flex>
  )
}

function GmiCard({
  wallet,
  onReset,
}: {
  wallet: string
  onReset?: () => void
}) {
  const MIN_LOADING_SECONDS = 2
  const LOAD_UPDATE_SECONDS = 0.25
  const [lastLoadingAt, setLastLoadingAt] = useState<number>()
  const [loadWait, setLoadWait] = useState(0)
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const { loading, error, data } = useQuery<GetGmiData, GetGmiVars>(GET_GMI, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    variables: {
      address: wallet.startsWith('0x') ? wallet : undefined,
      ens: wallet.endsWith('.eth') ? wallet : undefined,
    },
    skip: !wallet,
  })

  useEffect(() => {
    if (!loading) return
    setLastLoadingAt(Date.now())
  }, [loading])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadWait(lastLoadingAt ? (Date.now() - lastLoadingAt) / 1000 : 0)
    }, 1000 * LOAD_UPDATE_SECONDS)

    return () => {
      clearInterval(interval)
    }
  }, [lastLoadingAt])

  if (error || (data && !data?.getUser?.addresses?.length)) {
    return <GmiError {...{ wallet, onReset }} />
  }

  if (loading || loadWait < MIN_LOADING_SECONDS) {
    return (
      <div>
        <img src="/img/Logo_bounce_spin.gif" width={256} alt="Loading" />
      </div>
    )
  }

  const userAddr = data?.getUser?.addresses?.[0]?.address
  const userEns = data?.getUser?.addresses?.[0]?.ens
  const displayName = userEns || (userAddr ? shortenAddress(userAddr) : '-')
  const gmi = data?.getUser?.addresses?.[0]?.gmi ?? 0
  const blueChips = data?.getUser?.addresses?.[0]?.numBlueChipsOwned ?? 0
  const firstPurchase = data?.getUser?.addresses?.[0]?.startAt
    ? format(data.getUser.addresses[0].startAt * 1000, 'M/d/yyyy')
    : '-'
  const txVolume = data?.getUser?.addresses?.[0]?.volume
    ? formatNumber(data.getUser.addresses[0].volume, {
        fromWei: true,
        prefix: 'ETHER',
        decimals: 2,
      })
    : '-'
  const isGainsRealizedProfit =
    data?.getUser?.addresses?.[0]?.realizedGain &&
    Number(data.getUser.addresses[0].realizedGain) > 0
  const gainsRealized = data?.getUser?.addresses?.[0]?.realizedGain
    ? formatNumber(data.getUser.addresses[0].realizedGain, {
        fromWei: true,
        prefix: 'ETHER',
        decimals: 2,
      })
    : '-'

  const isGainsUnrealizedProfit =
    data?.getUser?.addresses?.[0]?.unrealizedGain &&
    Number(data.getUser.addresses[0].unrealizedGain) > 0
  const gainsUnrealized = data?.getUser?.addresses?.[0]?.unrealizedGain
    ? formatNumber(data.getUser.addresses[0].unrealizedGain, {
        fromWei: true,
        prefix: 'ETHER',
        decimals: 2,
      })
    : '-'

  const isGainsTotalProfit =
    parseUint256(data?.getUser?.addresses?.[0]?.realizedGain || '0') +
      parseUint256(data?.getUser?.addresses?.[0]?.unrealizedGain || '0') >
    0
  const gainsTotal = formatNumber(
    parseUint256(data?.getUser?.addresses?.[0]?.realizedGain || '0') +
      parseUint256(data?.getUser?.addresses?.[0]?.unrealizedGain || '0'),
    {
      prefix: 'ETHER',
      decimals: 2,
    }
  )

  const getRank = (gmi: number) => {
    if (gmi < 100) return 'ngmi'
    if (gmi < 400) return 'Tourist'
    if (gmi < 700) return 'Part Degen'
    if (gmi < 900) return 'Full Degen'
    if (gmi < 975) return 'Based'
    return 'Based God'
  }

  const rank = getRank(gmi)

  return (
    <GmiCardBase>
      <Flex sx={{ flexGrow: 1, width: '100%' }}>
        {!isMobile && (
          <Flex sx={{ flexGrow: 1, width: '100%' }}>
            <Text sx={{ fontWeight: 'bold', fontSize: '18px' }}>
              {displayName}
            </Text>
          </Flex>
        )}

        <Flex
          sx={{
            flexShrink: 0,
            gap: 2,
            width: ['100%', '100%', 'auto'],
            justifyContent: ['center', 'center', 'auto'],
          }}
        >
          <Text
            color={isMobile ? 'white' : 'grey-500'}
            sx={{ fontWeight: 'heading', fontSize: ['16px', '18px', '14px'] }}
          >
            {displayName}
          </Text>
          <Text
            onClick={onReset}
            color="blue"
            sx={{
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 'heading',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Try another wallet?
          </Text>
        </Flex>
      </Flex>

      <Grid
        sx={{
          gridTemplateColumns: isMobile ? '1fr' : '3fr 1fr',
          columnGap: '24px',
        }}
      >
        <Flex sx={{ flexDirection: 'column', gap: 7 }}>
          <Flex sx={{ alignItems: 'baseline', gap: 2 }}>
            <Text
              color="blue"
              sx={{
                fontFamily: 'degular-display',
                fontSize: '54px',
                fontWeight: 'bold',
                lineHeight: '54px',
              }}
            >
              {gmi ? Math.floor(gmi) : '-'}
            </Text>
            <Text
              color="grey-500"
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              /
            </Text>
            <Box sx={{ position: 'relative' }}>
              <Text
                color="grey-500"
                sx={{
                  position: 'absolute',
                  marginTop: '-1.33rem',
                  fontSize: '.85rem',
                }}
              >
                gmi
              </Text>
              <Text
                color="grey-500"
                sx={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                1000
              </Text>
            </Box>
            <IconButton
              sx={{
                background: 'grey-800',
                width: '28px',
                height: '28px',
              }}
            >
              <Icon icon="question" size={14} />
            </IconButton>
            <Flex sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
              <Text variant="h3Primary">{rank}</Text>
            </Flex>
          </Flex>
          <ProgressBar percent={(gmi / 1000) * 100} bgColor="grey-900" />
          <Grid
            sx={{
              gridTemplateColumns: ['1fr', '1fr', '1fr 1fr 1fr'],
              columnGap: '16px',
              rowGap: '16px',
            }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                Blue Chips Owned
              </Text>
              <Text color="blue" sx={{ fontSize: '26px', fontWeight: 'bold' }}>
                {blueChips}
              </Text>
            </Flex>

            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                First Purchase
              </Text>
              <Text color="blue" sx={{ fontSize: '26px', fontWeight: 'bold' }}>
                {firstPurchase}
              </Text>
            </Flex>

            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                Trade Volume
              </Text>
              <Text color="blue" sx={{ fontSize: '26px', fontWeight: 'bold' }}>
                {txVolume}
              </Text>
            </Flex>

            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                Total Gains
              </Text>
              <Text
                color={isGainsTotalProfit ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {gainsTotal}
              </Text>
            </Flex>

            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                Unrealized Gains
              </Text>
              <Text
                color={isGainsUnrealizedProfit ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {gainsUnrealized}
              </Text>
            </Flex>

            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid #545454`,
                borderRadius: '10px',
                minHeight: '92px',
                padding: '20px',
              }}
            >
              <Text sx={{ fontSize: '16px', fontWeight: 'heading' }}>
                Realized Gains
              </Text>
              <Text
                color={isGainsRealizedProfit ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {gainsRealized}
              </Text>
            </Flex>
          </Grid>
        </Flex>

        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: ['200px', '200px', '100%'],
              height: ['200px', '200px', 'auto'],
              backgroundImage: 'url(/img/upshotBall.svg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              flexGrow: 1,
            }}
          />

          <Link
            component={NextLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `View my Upshot gmi:\nhttps://upshot.xyz/gmi/${displayName}`
            )}`}
            sx={{ width: '100%', textDecoration: 'none !important' }}
          >
            <ShareButton>
              <Text
                color="white"
                sx={{
                  fontWeight: 'heading',
                  fontSize: '18px',
                }}
              >
                Share
              </Text>
              <Icon color="white" icon="twitter" size={32} />
            </ShareButton>
          </Link>
        </Flex>
      </Grid>
    </GmiCardBase>
  )
}

function GmiFooter() {
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

export default function GmiView() {
  const modalRef = useRef<HTMLDivElement>(null)
  const { activate, connector, deactivate } = useWeb3React()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)
  const [wallet, setWallet] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    if (!address) return

    setWallet(address)
  }, [address])

  const handleSearch = (value: string) => {
    if (
      !value.toLowerCase().endsWith('.eth') &&
      !(value.startsWith('0x') && value.length === 42)
    )
      return

    setWallet(value)
  }

  const handleConnect = (provider: ConnectorName) => {
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined
    }
    setWallet(address)

    dispatch(setActivatingConnector(provider))
    activate(connectorsByName[provider], (err) => console.error(err))
  }

  const handleReset = () => {
    setWallet('')
    deactivate()
    dispatch(setAddress(undefined))
    dispatch(setEns({ name: undefined }))
    dispatch(setIsBeta(undefined))
  }

  const hideMetaMask =
    typeof window['ethereum'] === 'undefined' &&
    typeof window['web3'] === 'undefined'

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

      <Modal backdropBlur ref={modalRef} fullWidth open>
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
            }}
          >
            {wallet ? (
              <GmiCard onReset={handleReset} {...{ wallet }} />
            ) : (
              <GmiModal
                {...{ hideMetaMask }}
                onSearch={handleSearch}
                onConnect={handleConnect}
              />
            )}
          </Flex>

          <GmiFooter />
        </Flex>
      </Modal>
    </>
  )
}
