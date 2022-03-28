import { useLazyQuery } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Box,
  Button,
  ConnectModal,
  Flex,
  Icon,
  IconButton,
  Modal,
  Text,
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
  color: ${({ theme }) => theme.colors['grey-500']};
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function WaitListView() {
  const [open, setOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const toggleModal = () => setOpen(!open)
  const { activate, connector } = useWeb3React()
  const dispatch = useAppDispatch()
  const address = useAppSelector(selectAddress)

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
        <title>Waitlist | Upshot Analytics</title>
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
          backgroundImage: 'url(./img/waitlist.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
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
            justifyContent: 'center',
            width: '100%',
            maxWidth: 640,
            flex: '1 1 auto',
            padding: 4,
          }}
        >
          <img
            src="./img/upshot_logo_white.svg"
            width="100%"
            alt="Upshot Logo"
            style={{ margin: '0 auto', maxWidth: 360 }}
          />
          <Text variant="h3Primary" sx={{ textAlign: 'center' }}>
            Upshot provides deep insight into NFT markets and unlocks a wave of
            exotic new DeFi possibilities.
          </Text>
          <Flex sx={{ flexDirection: 'column', margin: '0 auto', gap: 4 }}>
            <Button
              as="a"
              rel="noopener nofollow noreferrer"
              target="_blank"
              href="https://airtable.com/shr6XDMGxrNqjdMkT"
              sx={{
                //@ts-ignore
                '& span': {
                  textTransform: 'none!important',
                  fontSize: 4,
                  fontWeight: 700,
                },
                borderRadius: '8px !important',
              }}
            >
              Join The Waitlist
            </Button>
            <Flex sx={{ alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              {loading ? (
                <img
                  src="/img/Logo_bounce_spin.gif"
                  width={256}
                  alt="Loading"
                />
              ) : address && !isBeta ? (
                <Flex sx={{ flexDirection: 'column' }}>
                  <Text color="grey-500">
                    Looks like {shortAddr} hasn&apos;t been approved yet.
                  </Text>
                  <Text color="grey-500">
                    Join the waitlist or connect a wallet that has been
                    approved.
                  </Text>
                </Flex>
              ) : (
                <>
                  <Text color="blue" sx={{ fontSize: 2 }} onClick={toggleModal}>
                    Already Approved? Connect Here
                  </Text>
                  <Icon color="blue" icon="arrowStylizedRight" size={12} />
                </>
              )}
            </Flex>
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

      <Modal ref={modalRef} onClose={toggleModal} {...{ open }}>
        <ConnectModal {...{ hideMetaMask }} onConnect={handleConnect} />
      </Modal>
    </>
  )
}
