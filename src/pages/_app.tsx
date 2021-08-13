import '@upshot-tech/upshot-ui/css/typekit.css'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { UpshotThemeProvider } from '@upshot-tech/upshot-ui'
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
    /* Initialize telemetry on enabled release stages. */
    const enabledTelemetryStages = ['production', 'staging']

    if (enabledTelemetryStages.includes(process.env.NEXT_PUBLIC_ENV!)) {
      /* Start google analytics */
      initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!)

      /* Start BugSnag */
      Bugsnag.start({
        apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY!,
        releaseStage: process.env.NEXT_PUBLIC_ENV,
        plugins: [new BugsnagPluginReact()],
      })
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UpshotThemeProvider>
        <Web3ReactProvider {...{ getLibrary }}>
          <PersistGate {...{ persistor }}>
            <Component {...pageProps} />
          </PersistGate>
        </Web3ReactProvider>
      </UpshotThemeProvider>
    </>
  )
}
