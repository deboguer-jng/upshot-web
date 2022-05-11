import { useQuery } from '@apollo/client'
import { Box, Flex, Grid, Text } from '@upshot-tech/upshot-ui'
import { formatNumber, parseUint256, useTheme } from '@upshot-tech/upshot-ui'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { shortenAddress } from 'utils/address'

import { GET_GMI, GetGmiData, GetGmiVars } from '../graphql/queries'
import { GmiArtwork, GmiScore } from './Gmi'
import { getRank, rankTitles } from './Gmi'

interface GmiRowProps {
  label: string
  value?: string | number
  color?: string
}

function GmiRow({ label, value = '', color = 'grey-500' }: GmiRowProps) {
  const { theme } = useTheme()

  return (
    <Flex sx={{ alignItems: 'baseline' }}>
      <Text
        color="grey-300"
        variant="h3Primary"
        sx={{ fontWeight: 'heading', lineHeight: 1 }}
      >
        {label}
      </Text>
      <div
        style={{
          flexGrow: 1,
          margin: '0 16px',
          borderBottom: `1px solid ${theme.rawColors['grey-700']}`,
        }}
      ></div>
      <Text
        color={color as keyof typeof theme.colors}
        variant="h3Primary"
        sx={{ fontWeight: 'bold', lineHeight: 1 }}
      >
        {value}
      </Text>
    </Flex>
  )
}

function GmiRenderError({ wallet }: { wallet?: string }) {
  return (
    <Flex
      sx={{
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 40,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <Grid sx={{ gridTemplateColumns: '1fr 1fr' }}>
          <Flex sx={{ flexDirection: 'column', gap: 3 }}>
            <Text variant="h1Primary" sx={{ lineHeight: 1 }}>
              Failure to launch!
            </Text>
            <Flex sx={{ marginBottom: 4 }}>
              <GmiScore />
            </Flex>
            <GmiRow label="Blue Chips Owned" color="blue" />
            <GmiRow label="First Purchase" color="blue" />
            <GmiRow label="Trade Volume" color="blue" />
            <GmiRow label="Total Gains" />
            <GmiRow label="Unrealized Gains" />
            <GmiRow label="Realized Gains" />
          </Flex>
          <Flex sx={{ flexDirection: 'column' }}>
            <Text color="grey-500" sx={{ fontSize: 3, textAlign: 'right' }}>
              {wallet}
            </Text>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: 400,
                height: 'auto',
                flexGrow: 1,
              }}
            >
              <GmiArtwork />
            </Box>
          </Flex>
        </Grid>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <img src="/img/upshot_logo_white.svg" width={140} alt="Upshot Logo" />
        <Text color="grey-500" sx={{ fontSize: 3 }}>
          upshot.xyz/gmi
        </Text>
      </Flex>
    </Flex>
  )
}

export default function GmiRenderer() {
  const router = useRouter()
  const [wallet, setWallet] = useState('')

  const { loading, error, data } = useQuery<GetGmiData, GetGmiVars>(GET_GMI, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    variables: {
      address: wallet.startsWith('0x') ? wallet : undefined,
      ens: wallet.endsWith('.eth') ? wallet : undefined,
    },
    skip: !wallet,
  })

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

  const rank = rankTitles[getRank(gmi)]

  useEffect(() => {
    const urlAddress = (router.query['wallet'] as string) || ''

    setWallet(urlAddress)
  }, [router.query])

  if (error || (data && !data?.getUser?.addresses?.length)) {
    return <GmiRenderError {...{ wallet }} />
  }

  return (
    <Flex
      sx={{
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 40,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 4 }}>
        <Grid sx={{ gridTemplateColumns: '1fr 1fr' }}>
          <Flex sx={{ flexDirection: 'column', gap: 3 }}>
            <Text variant="h1Primary" sx={{ lineHeight: 1 }}>
              {rank}
            </Text>
            <Flex sx={{ marginBottom: 4 }}>
              <GmiScore {...{ gmi }} />
            </Flex>
            <GmiRow label="Blue Chips Owned" color="blue" value={blueChips} />
            <GmiRow label="First Purchase" color="blue" value={firstPurchase} />
            <GmiRow label="Trade Volume" color="blue" value={txVolume} />
            <GmiRow
              label="Total Gains"
              color={isGainsTotalProfit ? 'green' : 'red'}
              value={gainsTotal}
            />
            <GmiRow
              label="Unrealized Gains"
              color={isGainsUnrealizedProfit ? 'green' : 'red'}
              value={gainsUnrealized}
            />
            <GmiRow
              label="Realized Gains"
              color={isGainsRealizedProfit ? 'green' : 'red'}
              value={gainsRealized}
            />
          </Flex>
          <Flex sx={{ flexDirection: 'column' }}>
            <Text color="grey-500" sx={{ fontSize: 3, textAlign: 'right' }}>
              {displayName}
            </Text>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: 400,
                height: 'auto',
                flexGrow: 1,
              }}
            >
              <GmiArtwork {...{ gmi }} />
            </Box>
          </Flex>
        </Grid>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <img src="/img/upshot_logo_white.svg" width={140} alt="Upshot Logo" />
        <Text color="grey-500" sx={{ fontSize: 3 }}>
          upshot.xyz/gmi
        </Text>
      </Flex>
    </Flex>
  )
}
