import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export type Environment = 'development' | 'staging' | 'production'

export type EnvChainList = {
  [key in Environment]: number[]
}

export enum ConnectorName {
  Injected = 'Injected',
  WalletConnect = 'WalletConnect',
}

export const allowedChainsByEnv: EnvChainList = {
  production: [1],
  staging: [1, 4],
  development: [1, 4],
}

export const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
  4: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
}

export const supportedChainIds = allowedChainsByEnv[process.env.NODE_ENV]

export const Injected = new InjectedConnector({
  supportedChainIds,
})

export const WalletConnect = new WalletConnectConnector({
  rpc: Object.fromEntries(
    supportedChainIds.map((k) => [k, supportedChainIds[k]])
  ),
  qrcode: true,
  infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  bridge: 'https://bridge.walletconnect.org',
})

export const connectorsByName: { [connectorName in ConnectorName]: any } = {
  [ConnectorName.Injected]: Injected,
  [ConnectorName.WalletConnect]: WalletConnect,
}
