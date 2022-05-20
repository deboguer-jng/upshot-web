import { 
  Button,
  Container, 
  Icon, 
  InputRounded,
  SettingsMenuItem,
  SettingsPanel,
  TextareaRounded,
  useTheme
} from '@upshot-tech/upshot-ui'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import { Avatar, Box, Flex, Link, Text } from 'theme-ui'

import Breadcrumbs from '../components/Breadcrumbs'

export default function SettingsView() {
  const { theme } = useTheme()
  const storage = globalThis?.sessionStorage
  const prevPath = storage.getItem('prevPath')
  
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

  const onSave = () => {}
  const onTwitterConnect = () => {}
  const onAvatarClick = () => {}

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

        <SettingsPanel>
          <SettingsMenuItem label="Profile">
            <Flex sx={{flexWrap: 'wrap', gap: '20px 50px'}}>
              <Flex sx={{flexDirection: 'column', gap: '10px'}}>
                <Text color={theme.colors['grey-500']}>Information</Text>
                <InputRounded dark={true} sx={{padding: '16px'}} />
                <TextareaRounded 
                  dark={true}
                  optional={true}
                  showCount={true}
                  maxLength={100}
                  placeholder='Write a short bio for your profile'
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
                <Link onClick={onAvatarClick}>
                  <Avatar size="200" src="/img/defaultAvatar.png"></Avatar>
                </Link>
              </Flex>
            </Flex>
              <Flex sx={{width: '100%'}}>
                <Button onClick={onSave} sx={{width: 150}} capitalize={true}>Save Changes</Button>
              </Flex>
          </SettingsMenuItem>
          <SettingsMenuItem label="Notifications">
            
          </SettingsMenuItem>
        </SettingsPanel>
      </Container>
    </>
  )
}
