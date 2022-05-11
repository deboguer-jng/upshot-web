import { Container, useTheme } from '@upshot-tech/upshot-ui'
import Breadcrumbs from '../components/Breadcrumbs'
import { Footer } from 'components/Footer'
import { Nav } from 'components/Nav'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

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
      </Container>
    </>
  )
}
