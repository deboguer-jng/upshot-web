import { useMutation, useQuery } from '@apollo/client'
import { 
  Button,
  Container, 
  Icon, 
  InputRounded,
  SettingsMenuItem,
  SettingsPanel,
  SpinnerBoxTemplate,
  TextareaRounded,
  useTheme
} from '@upshot-tech/upshot-ui'
import { useWeb3React } from '@web3-react/core'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import makeBlockie from 'ethereum-blockies-base64'
import { useAuth } from 'hooks/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppSelector } from 'redux/hooks'
import { selectAddress, selectEns, selectAuthToken } from 'redux/reducers/web3'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'

import Breadcrumbs from '../components/Breadcrumbs'
import { GetUserProfileData, GetUserProfileVars, GET_PROFILE } from '../User/queries'
import { UpdateUserData, UpdateUserVars, UPDATE_USER } from './mutations'

export default function SettingsView() {
  const { theme } = useTheme()
  const router = useRouter()
  const { account } = useWeb3React()
  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')
  const address = useAppSelector(selectAddress)
  const userEns = useAppSelector(selectEns)
  const [isAuthed, triggerAuth] = useAuth();
  
  const [displayName, setDisplayName] = useState<string>()
  const [bio, setBio] = useState<string>()
  const [updateUser] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER, {
    onError: err => console.log(err)
  })

  useEffect(() => {
    if (!isAuthed) triggerAuth({onError: () => router.push('/analytics')})
  }, [])

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
            text: `${decodeURI(prevPath as string).split('?userWallet=')[1]
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
        bio: bio
      }
    })
  }
  const onTwitterConnect = () => {}
  const onAvatarClick = () => {}

  const {
    loading,
    error,
    data,
  } = useQuery<GetUserProfileData, GetUserProfileVars>(GET_PROFILE, {
    errorPolicy: 'all',
    variables: {
      address: address,
    },
    skip: !address,
  })

  if(data?.getUser?.displayName) setDisplayName(data?.getUser?.displayName)

  return (
    <>
      <Head>
        <title>
          Settings | Upshot Analytics
        </title>
      </Head>
      <Nav />
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
        { !isAuthed ? 
          (<SpinnerBoxTemplate sx={{height: '500px'}}/>) : 
          (<SettingsPanel>
            <SettingsMenuItem label="Profile">
              <Flex sx={{flexWrap: 'wrap', gap: '20px 50px'}}>
                <Flex sx={{flexDirection: 'column', gap: '10px'}}>
                  <Text color={theme.colors['grey-500']}>Information</Text>
                  <InputRounded 
                    dark={true} 
                    sx={{padding: '16px'}} 
                    placeholder={userEns?.name ?? data?.getUser?.addresses?.[0]?.ens ??
                      data?.getUser?.addresses?.[0]?.address}
                    value={displayName}
                    onChange={e => setDisplayName(e.currentTarget.value)} />
                  <TextareaRounded 
                    dark={true}
                    optional={true}
                    showCount={true}
                    maxLength={100}
                    placeholder='Write a short bio for your profile'
                    value={bio}
                    onChange={e => setBio(e.currentTarget.value)}
                  />
                  <Flex sx={{alignItems: 'center', marginBottom: '20px'}}>
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
                  </Flex>
                </Flex>
                <Flex sx={{flexDirection: 'column', gap: '30px', paddingBottom: '40px'}}>
                  <Text color={theme.colors['grey-500']}>Profile Picture</Text>
                  {/* <Link onClick={onAvatarClick}> */}
                    <Avatar size="200" src={address ? makeBlockie(address) : undefined}></Avatar>
                  {/* </Link> */}
                </Flex>
              </Flex>
                <Flex sx={{width: '100%'}}>
                  <Button onClick={onSave} sx={{width: 150}} capitalize={true}>Save Changes</Button>
                </Flex>
            </SettingsMenuItem>
            <SettingsMenuItem label="Notifications">
              
            </SettingsMenuItem>
          </SettingsPanel>)
        }
      </Container>
      <Footer />
    </>
  )
}
