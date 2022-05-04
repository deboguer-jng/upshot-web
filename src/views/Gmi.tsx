import { useLazyQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Button,
  Flex,
  GmiModal,
  Icon,
  IconButton,
  Modal,
  Text,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorName, connectorsByName } from 'constants/connectors'
import {
  GET_WAIT_LIST,
  GetWaitListData,
  GetWaitListVars,
} from 'graphql/queries'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectIsBeta, setIsBeta } from 'redux/reducers/user'
import { selectAddress, setActivatingConnector } from 'redux/reducers/web3'
import { shortenAddress } from 'utils/address'

const StyledLink = styled.a`
  cursor: pointer;
  color: inherit;
  font-size: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function GmiView() {
  const [open, setOpen] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)
  const toggleModal = () => setOpen(!open)
  const { activate, connector } = useWeb3React()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)
  const { theme } = useTheme()

  const shortAddr = shortenAddress(address)
  const isBeta = useAppSelector(selectIsBeta)

  const [getWaitlistStatus, { loading }] = useLazyQuery<
    GetWaitListData,
    GetWaitListVars
  >(GET_WAIT_LIST, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const isBeta = Boolean(data?.getUser?.isBeta)
      dispatch(setIsBeta(isBeta))
    },
    onError: (err) => {
      console.error(err)
    },
  })

  useEffect(() => {
    if (!address) return
    dispatch(setIsBeta(undefined))

    getWaitlistStatus({ variables: { address } })
  }, [address])

  const handleConnect = (provider: ConnectorName) => {
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined
    }

    dispatch(setActivatingConnector(provider))
    activate(connectorsByName[provider], (err) => console.error(err))
    modalRef?.current?.click()
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
          <img
            src="/img/upshot_logo_white.svg"
            width="100%"
            alt="Upshot Logo"
            style={{ margin: '32px auto 0 auto', maxWidth: 192 }}
          />
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

      <Modal backdropBlur ref={modalRef} onClose={toggleModal} {...{ open }}>
        <GmiModal {...{ hideMetaMask }} onConnect={handleConnect} />
      </Modal>
    </>
  )
}
