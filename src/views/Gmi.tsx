import { useLazyQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Flex,
  GmiModal,
  Icon,
  IconButton,
  Link,
  Modal,
  Text,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import Head from 'next/head'
import NextLink from 'next/link'
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

function GmiCard({
  wallet,
  onReset,
}: {
  wallet: string
  onReset?: () => void
}) {
  return (
    <>
      <div>{wallet}</div>
      <div onClick={onReset}>Back</div>
    </>
  )
}

function GmiFooter() {
  return (
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
        <title>gmi Score | Upshot Analytics</title>
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
      <Box
        sx={{
          position: 'absolute',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 8,
            margin: '0 auto',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 640,
            flex: '1 1 auto',
            padding: 4,
          }}
        >
          <Flex
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Content
          </Flex>
        </Box>

        <Flex sx={{ flexDirection: 'column', gap: 4 }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 640,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <StyledLink
              href="https://jobs.lever.co/upshot.io"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              Join Our Team
            </StyledLink>
            <Text sx={{ fontSize: 1, margin: '0 8px' }}>|</Text>
            <StyledLink target="_blank" href="/privacy.pdf">
              Privacy
            </StyledLink>
            <Text sx={{ fontSize: 1, margin: '0 8px' }}>|</Text>
            <StyledLink target="_blank" href="/terms.pdf">
              Terms
            </StyledLink>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: 640,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 64px auto',
            }}
          >
            <StyledLink
              href="https://mirror.xyz/0x82FE4757D134a56BFC7968A0f0d1635345053104"
              target="_blank"
            >
              <IconButton>
                <Icon color="grey-700" icon="mirror" size={24} />
              </IconButton>
            </StyledLink>

            <StyledLink href="https://twitter.com/upshothq" target="_blank">
              <IconButton>
                <Icon color="grey-700" icon="twitterCircle" size={24} />
              </IconButton>
            </StyledLink>

            <StyledLink href="https://discord.gg/upshot" target="_blank">
              <IconButton>
                <Icon color="grey-700" icon="discord" size={24} />
              </IconButton>
            </StyledLink>

            <StyledLink
              href="https://www.instagram.com/upshot.hq/"
              target="_blank"
            >
              <IconButton>
                <Icon color="grey-700" icon="instagramCircle" size={24} />
              </IconButton>
            </StyledLink>
          </Box>
        </Flex>
      </Box>

      <Modal backdropBlur ref={modalRef} open>
        {wallet ? (
          <GmiCard onReset={handleReset} {...{ wallet }} />
        ) : (
          <Flex sx={{ flexDirection: 'column', gap: 8 }}>
            <img
              src="/img/upshot_logo_white.svg"
              width="100%"
              alt="Upshot Logo"
              style={{ margin: '32px auto 0 auto', maxWidth: 192 }}
            />
            <GmiModal
              {...{ hideMetaMask }}
              onSearch={handleSearch}
              onConnect={handleConnect}
            />

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
              <GmiFooter />
            </Flex>
          </Flex>
        )}
      </Modal>
    </>
  )
}
