import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export enum ConnectorName {
  Injected = 'Injected',
  WalletConnect = 'WalletConnect',
}

export const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
}

export const Injected = new InjectedConnector({ supportedChainIds: [1] })

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
})

export const connectorsByName: { [connectorName in ConnectorName]: any } = {
  [ConnectorName.Injected]: Injected,
  [ConnectorName.WalletConnect]: WalletConnect,
}
