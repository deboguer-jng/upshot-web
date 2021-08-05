import '@upshot-tech/upshot-ui/dist/css/typekit.css'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { ThemeProvider } from '@emotion/react'
import { globalStyles, theme } from '@upshot-tech/upshot-ui'
import { Web3ReactProvider } from '@web3-react/core'
import { providers } from 'ethers'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { persistor } from 'redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { initGA } from 'utils/googleAnalytics'

/**
 * Instantiate an Ethers web3 provider library.
 *
 * @param provider Low-level provider.
 * @returns {Web3Provider} Web3 library object.
 */
const getLibrary = (
  provider: providers.ExternalProvider | providers.JsonRpcFetchFunc
): providers.Web3Provider => new providers.Web3Provider(provider)

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    /* Initialize Google Analytics */
    initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!)

    /* Initialize Bugsnag */
    Bugsnag.start({
      apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY!,
      plugins: [new BugsnagPluginReact()],
      releaseStage: process.env.NEXT_PUBLIC_ENV,
      /* Prevent error-logging during development & testing. */
      enabledReleaseStages: ['production', 'staging'],
    })
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider {...{ theme }}>
        {globalStyles}
        <Web3ReactProvider {...{ getLibrary }}>
          <PersistGate {...{ persistor }}>
            <Component {...pageProps} />
          </PersistGate>
        </Web3ReactProvider>
      </ThemeProvider>
    </>
  )
}
