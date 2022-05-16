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
  Panel,
  parseUint256,
  ProgressBar,
  Text,
  useBreakpointIndex,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import { format } from 'date-fns'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setIsBeta } from 'redux/reducers/user'
import {
  selectAddress,
  setActivatingConnector,
  setAddress,
  setEns,
} from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'
import { gmiIndex, gmiLabel } from 'utils/gmi'

import FooterModal from '../components/FooterModal'
import { GET_GMI, GetGmiData, GetGmiVars } from '../graphql/queries'
import { FaqPanel } from '../views/Faq'
import {
  GmiRenderError,
  GmiSocialCard,
  GmiSocialCardProps,
} from './GmiRenderer'

interface GmiPanelProps {
  onReset: () => void
  onToggleFaq: () => void
  onShowPreview: () => void
}

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

const ShareButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  background: ${({ theme }) => theme['colors']['blue']};
  border-radius: 9999px;
  cursor: pointer;
`

function GmiPanel({
  displayName,
  gmi,
  totalBlueChips,
  firstPurchase,
  tradeVolume,
  gainsRealized,
  gainsUnrealized,
  gainsTotal,
  onReset,
  onToggleFaq,
  onShowPreview,
}: GmiSocialCardProps & GmiPanelProps) {
  const breakpointIndex = useBreakpointIndex()
  const isMobile = breakpointIndex <= 1

  const rank = gmiLabel(gmi)

  return (
    <Panel outlined backgroundColor="grey-900">
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
          <Flex
            sx={{
              alignItems: 'baseline',
              gap: 2,
              flexDirection: ['column', 'row'],
            }}
          >
            <GmiScore {...{ gmi }}>
              <IconButton
                onClick={onToggleFaq}
                sx={{
                  background: 'grey-800',
                  width: '28px',
                  height: '28px',
                }}
              >
                <Icon icon="question" size={14} />
              </IconButton>
            </GmiScore>

            <Flex sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
              <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>{rank}</Text>
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
                {totalBlueChips}
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
                {firstPurchase ? format(firstPurchase * 1000, 'M/d/yyyy') : '-'}
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
                {formatNumber(tradeVolume, {
                  fromWei: true,
                  prefix: 'ETHER',
                  decimals: 2,
                })}
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
                color={gainsTotal > 0 ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {formatNumber(gainsTotal, {
                  fromWei: true,
                  prefix: 'ETHER',
                  decimals: 2,
                })}
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
                color={Number(gainsUnrealized) > 0 ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {formatNumber(gainsUnrealized, {
                  fromWei: true,
                  prefix: 'ETHER',
                  decimals: 2,
                })}
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
                color={Number(gainsRealized) > 0 ? 'green' : 'red'}
                sx={{ fontSize: '26px', fontWeight: 'bold' }}
              >
                {formatNumber(gainsRealized, {
                  fromWei: true,
                  prefix: 'ETHER',
                  decimals: 2,
                })}
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
              position: 'relative',
              width: ['200px', '200px', '100%'],
              height: ['200px', '200px', 'auto'],
              flexGrow: 1,
            }}
          >
            <GmiArtwork {...{ gmi }} />
          </Box>

          <ShareButton onClick={onShowPreview}>
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
        </Flex>
      </Grid>
    </Panel>
  )
}

function GmiPreview({
  wallet,
  onBack,
}: {
  wallet: string
  onBack: () => void
}) {
  const { loading, error, data } = useQuery<GetGmiData, GetGmiVars>(GET_GMI, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    variables: {
      address: wallet.startsWith('0x') ? wallet : undefined,
      ens: wallet.endsWith('.eth') ? wallet : undefined,
    },
    skip: !wallet,
  })

  if (error || (data && !data?.getUser?.addresses?.length)) {
    return <GmiRenderError {...{ wallet }} />
  }

  if (loading || !data) {
    return null
  }

  const userAddr = data?.getUser?.addresses?.[0]?.address
  const userEns = data?.getUser?.addresses?.[0]?.ens
  const displayName = userEns || (userAddr ? shortenAddress(userAddr) : '-')
  const gmi = data?.getUser?.addresses?.[0]?.gmi ?? 0
  const totalBlueChips = data?.getUser?.addresses?.[0]?.numBlueChipsOwned ?? 0
  const firstPurchase = data?.getUser?.addresses?.[0]?.startAt
  const tradeVolume = data?.getUser?.addresses?.[0]?.volume ?? '0'
  const gainsRealized = data?.getUser?.addresses?.[0]?.realizedGain ?? '0'
  const gainsUnrealized = data?.getUser?.addresses?.[0]?.unrealizedGain ?? '0'
  const gainsTotal =
    parseUint256(data?.getUser?.addresses?.[0]?.realizedGain ?? '0') +
    parseUint256(data?.getUser?.addresses?.[0]?.unrealizedGain ?? '0')

  return (
    <Panel
      outlined
      backgroundColor="grey-900"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px !important',
        minWidth: ['100%', '100%', '720px', '940px'],
      }}
    >
      <Flex
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Text variant="h1Primary" sx={{ lineHeight: 1 }}>
          Share
        </Text>
        <IconButton onClick={onBack}>
          <Icon icon="close" />
        </IconButton>
      </Flex>
      <Text color="grey-300" sx={{ lineHeight: 1 }}>
        Share your Upshot gmi card on Twitter! Flex your degen level.
      </Text>

      <GmiSocialCard
        {...{
          displayName,
          gmi,
          totalBlueChips,
          firstPurchase,
          tradeVolume,
          gainsRealized,
          gainsUnrealized,
          gainsTotal,
        }}
      />

      <Link
        component={NextLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `View my Upshot gmi:\nhttps://upshot.xyz/gmi/${wallet}`
        )}`}
        sx={{ width: '100%', textDecoration: 'none !important' }}
      >
        <ShareButton sx={{ maxWidth: '200px', margin: '0 auto' }}>
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
    </Panel>
  )
}

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

export function GmiScore({
  gmi,
  children,
}: {
  gmi?: number
  children?: React.ReactNode
}) {
  return (
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
        {gmi ? Math.round(gmi) : '-'}
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
      {children}
    </Flex>
  )
}

export function GmiArtwork({ gmi = 0 }: { gmi?: number }) {
  const gmiIdx = gmiIndex(gmi)

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(/img/gmi/planet/${gmiIdx}.svg)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      {gmiIdx > 1 && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/img/gmi/stars/${gmiIdx}.svg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
      {gmiIdx > 2 && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/img/gmi/moon_1/${gmiIdx}.svg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
      {gmiIdx > 3 && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/img/gmi/moon_2/${gmiIdx}.svg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
      {gmiIdx > 4 && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(/img/gmi/spaceShip/${gmiIdx}.svg)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      )}
    </>
  )
}

function GmiCard({
  wallet,
  showFaq,
  showPreview,
  onReset,
  onToggleFaq,
  onShowPreview,
}: {
  wallet: string
  showFaq?: boolean
  showPreview?: boolean
  onToggleFaq: () => void
  onShowPreview: () => void
  onReset: () => void
}) {
  const MIN_LOADING_SECONDS = 2
  const LOAD_UPDATE_SECONDS = 0.25
  const [lastLoadingAt, setLastLoadingAt] = useState<number>()
  const [loadWait, setLoadWait] = useState(0)
  const router = useRouter()

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

  useEffect(() => {
    if (!data?.getUser) return

    const userAddr = data.getUser.addresses?.[0]?.address
    const userEns = data.getUser.addresses?.[0]?.ens

    router.push(
      `/gmi/${encodeURIComponent(userEns || userAddr || '')}`,
      undefined,
      {
        shallow: true,
      }
    )
  }, [data])

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

  if (showFaq) return <FaqPanel onBack={onToggleFaq} />
  if (showPreview) return <GmiPreview {...{ wallet }} onBack={onReset} />

  const userAddr = data?.getUser?.addresses?.[0]?.address
  const userEns = data?.getUser?.addresses?.[0]?.ens
  const displayName = userEns || (userAddr ? shortenAddress(userAddr) : '-')
  const gmi = data?.getUser?.addresses?.[0]?.gmi ?? 0
  const totalBlueChips = data?.getUser?.addresses?.[0]?.numBlueChipsOwned ?? 0
  const firstPurchase = data?.getUser?.addresses?.[0]?.startAt
  const tradeVolume = data?.getUser?.addresses?.[0]?.volume ?? '0'
  const gainsRealized = data?.getUser?.addresses?.[0]?.realizedGain ?? '0'
  const gainsUnrealized = data?.getUser?.addresses?.[0]?.unrealizedGain ?? '0'
  const gainsTotal =
    parseUint256(data?.getUser?.addresses?.[0]?.realizedGain ?? '0') +
    parseUint256(data?.getUser?.addresses?.[0]?.unrealizedGain ?? '0')

  return (
    <GmiPanel
      {...{
        displayName,
        gmi,
        totalBlueChips,
        firstPurchase,
        tradeVolume,
        gainsRealized,
        gainsUnrealized,
        gainsTotal,
        onReset,
        onToggleFaq,
        onShowPreview,
      }}
    />
  )
}

export default function GmiView() {
  const modalRef = useRef<HTMLDivElement>(null)
  const { activate, connector, deactivate } = useWeb3React()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)
  const [wallet, setWallet] = useState('')
  const [showFaq, setShowFaq] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const urlWallet = router.query['wallet'] as string

    setWallet(urlWallet || address || '')
  }, [address, router.query])

  const handleSearch = (value: string) => {
    if (
      !value.toLowerCase().endsWith('.eth') &&
      !(value.startsWith('0x') && value.length === 42)
    )
      return

    router.push(`/gmi/${encodeURIComponent(value)}`, undefined, {
      shallow: true,
    })
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
    router.push('/gmi', undefined, { shallow: true })
  }

  const hideMetaMask =
    typeof window['ethereum'] === 'undefined' &&
    typeof window['web3'] === 'undefined'

  return (
    <>
      <Head>
        <title>gmi | Upshot Analytics</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@UpshotHQ" />
        <meta
          name="twitter:title"
          content={
            router.query['wallet']
              ? `${router.query['wallet']} | Upshot gmi`
              : 'Upshot gmi'
          }
        />
        <meta
          name="twitter:description"
          content="Search any wallet to see the Upshot gmi."
        />
        {!!router.query['wallet'] && (
          <meta
            name="twitter:image"
            content={`https://stage.analytics.upshot.io/.netlify/functions/gmi?wallet=${router.query['wallet']}&filetype=.png`}
          />
        )}
        <meta property="og:type" content="website" />
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
              padding: 4,
              width: '100%',
            }}
          >
            {wallet ? (
              <GmiCard
                onReset={handleReset}
                key={wallet}
                onToggleFaq={() => setShowFaq(!showFaq)}
                onShowPreview={() => setShowPreview(true)}
                {...{ wallet, showFaq, showPreview }}
              />
            ) : (
              <GmiModal
                {...{ hideMetaMask }}
                onSearch={handleSearch}
                onConnect={handleConnect}
              />
            )}
          </Flex>

          <FooterModal />
        </Flex>
      </Modal>
    </>
  )
}
