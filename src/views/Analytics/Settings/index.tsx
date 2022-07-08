import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Container,
  InputRounded,
  SettingsMenuItem,
  SettingsPanel,
  Spinner,
  TextareaRounded,
  useTheme,
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import makeBlockie from 'ethereum-blockies-base64'
import { useAuth } from 'hooks/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectAddress, selectEns } from 'redux/reducers/web3'
import { Avatar, Flex, Text } from 'theme-ui'

import Breadcrumbs from '../components/Breadcrumbs'
import {
  GET_PROFILE,
  GetUserProfileData,
  GetUserProfileVars,
} from '../User/queries'
import AlertsSettings from './Alerts'
import CollectionAlertSettings from './CollectionAlertSettings'
import CollectorAlertSettings from './CollectorAlertSettings'
import { UPDATE_USER, UpdateUserData, UpdateUserVars } from './mutations'
import NFTAlertSettings from './NFTAlertSettings'

export default function SettingsView() {
  const { theme } = useTheme()
  const router = useRouter()
  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')
  const address = useAppSelector(selectAddress)
  const userEns = useAppSelector(selectEns)
  const { isAuthed, triggerAuth } = useAuth()

  const [displayName, setDisplayName] = useState<string>()
  const [bio, setBio] = useState<string>()
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false)
  const [updateUser, { loading: updateUserLoading }] = useMutation<
    UpdateUserData,
    UpdateUserVars
  >(UPDATE_USER, {
    onError: (err) => console.log(err),
  })

  const handleSignIn = useCallback(() => {
    if (!isAuthed) {
      triggerAuth({
        onError: () =>
          router.push(address ? `/analytics/user/${address}` : '/analytics'),
      })
    }
  }, [isAuthed, address, triggerAuth])

  useEffect(() => handleSignIn(), [handleSignIn])

  const breadcrumbs = prevPath?.includes('/nft/')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('nftName=')[1],
          link: prevPath,
        },
      ]
    : prevPath?.includes('collection')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: decodeURI(prevPath as string).split('?collectionName=')[1],
          link: prevPath,
        },
      ]
    : prevPath?.includes('user')
    ? [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
        {
          text: `${
            decodeURI(prevPath as string).split('?userWallet=')[1]
          }'s Collection`,
          link: prevPath,
        },
      ]
    : [
        {
          text: 'Analytics Home',
          link: '/analytics',
        },
      ]

  const onSave = () => {
    updateUser({
      variables: {
        displayName: displayName,
        bio: bio,
      },
    })
  }
  const onTwitterConnect = () => {}
  const onAvatarClick = () => {}

  const {
    loading: getProfileLoading,
    error,
    data: initProfileData,
  } = useQuery<GetUserProfileData, GetUserProfileVars>(GET_PROFILE, {
    errorPolicy: 'all',
    variables: {
      address: address,
    },
    skip: !address,
    onCompleted: (data) => {
      if (data?.getUser?.displayName) setDisplayName(data.getUser.displayName)
      if (data?.getUser?.bio) setBio(data.getUser.bio)
    },
  })

  const onDisplayNameChange = (e) => {
    setDisplayName(e.currentTarget.value)
    setSaveEnabled(true)
  }

  const onBioChange = (e) => {
    setBio(e.currentTarget.value)
    setSaveEnabled(true)
  }

  return (
    <>
      <Head>
        <title>Settings | Upshot Analytics</title>
      </Head>
      <Nav onSignInRetry={handleSignIn} />
      <Container
        maxBreakpoint="xxl"
        sx={{
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 4,
          padding: 4,
        }}
      >
        <Breadcrumbs crumbs={breadcrumbs} />
        <SettingsPanel loading={getProfileLoading || !isAuthed}>
          <SettingsMenuItem label="Profile">
            <Flex sx={{ flexWrap: 'wrap', gap: '20px 50px' }}>
              <Flex sx={{ flexDirection: 'column', gap: '10px' }}>
                <Text color={theme.colors['grey-500']}>Information</Text>
                <InputRounded
                  dark={true}
                  sx={{ padding: '16px' }}
                  placeholder={
                    userEns?.name ??
                    initProfileData?.getUser?.addresses?.[0]?.ens ??
                    initProfileData?.getUser?.addresses?.[0]?.address
                  }
                  value={displayName}
                  onChange={onDisplayNameChange}
                />
                <TextareaRounded
                  dark={true}
                  optional={true}
                  showCount={true}
                  maxLength={100}
                  placeholder="Write a short bio for your profile"
                  value={bio}
                  onChange={onBioChange}
                />
                {/* <Flex sx={{alignItems: 'center', marginBottom: '20px'}}>
                  <Icon color="grey-500" icon="twitter" size={32} />
                  <Flex sx={{
                    width: '100%',
                    borderRadius: theme.radii.lg,
                    position: 'relative',
                    backgroundColor: theme.colors.black,
                    height: '60px',
                    alignItems: 'center',
                    padding: '16px',
                    marginLeft: '10px'
                  }}>
                    <Text color="grey-500">Twitter</Text>
                    <Button
                      variant="secondary"
                      capitalize={true}
                      color="grey-500"
                      sx={{position: 'absolute', right: '10px'}}
                      onClick={onTwitterConnect}
                    >Connect</Button>
                  </Flex>
                </Flex> */}
              </Flex>
              <Flex
                sx={{
                  flexDirection: 'column',
                  gap: '30px',
                  paddingBottom: '40px',
                }}
              >
                <Text color={theme.colors['grey-500']}>Profile Picture</Text>
                {/* <Link onClick={onAvatarClick}> */}
                <Avatar
                  size="200"
                  src={address ? makeBlockie(address) : undefined}
                ></Avatar>
                {/* </Link> */}
              </Flex>
            </Flex>
            <Flex sx={{ width: '100%' }}>
              <Button
                sx={{ width: 150 }}
                onClick={onSave}
                capitalize={true}
                disabled={!saveEnabled}
              >
                {updateUserLoading ? <Spinner /> : 'Save Changes'}
              </Button>
            </Flex>
          </SettingsMenuItem>
          <SettingsMenuItem label="Alerts">
            <AlertsSettings />
          </SettingsMenuItem>
          <SettingsMenuItem label="Collections" subMenu={true}>
            <CollectionAlertSettings />
          </SettingsMenuItem>
          <SettingsMenuItem label="Collectors" subMenu={true}>
            <CollectorAlertSettings />
          </SettingsMenuItem>
          <SettingsMenuItem label="NFTs" subMenu={true}>
            <NFTAlertSettings />
          </SettingsMenuItem>
        </SettingsPanel>
      </Container>
      <Footer />
    </>
  )
}
