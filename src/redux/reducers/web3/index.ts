import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectorName } from 'constants/connectors'
import { RootState } from 'redux/store'

type ENSAccount = {
  name?: string
}

export interface Web3State {
  activatingConnector?: ConnectorName
  address?: string
  authToken?: string
  chain?: number
  ens: ENSAccount
}

const initialState: Web3State = {
  /**
   * Connector currently being activated.
   */
  activatingConnector: undefined,
  /**
   * Connected wallet address.
   */
  address: undefined,
  /**
   * Token received following auth signature flow.
   */
  authToken: undefined,
  /**
   * Wallet's ENS name if available.
   */
  ens: {
    name: undefined,
  },
  /**
   * RPC Chain ID
   */
  chain: undefined,
}

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setActivatingConnector: (
      state,
      action: PayloadAction<ConnectorName | undefined>
    ) => {
      state.activatingConnector = action.payload
    },
    setAddress: (state, action: PayloadAction<string | undefined>) => {
      state.address = action.payload
    },
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload
    },
    setEns: (state, action: PayloadAction<ENSAccount>) => {
      state.ens = action.payload
    },
    setChain: (state, action: PayloadAction<number | undefined>) => {
      state.chain = action.payload
    },
    resetWeb3: (state) => {
      state.address = undefined
      state.authToken = undefined
      state.chain = undefined
      state.ens = {
        name: undefined,
      }
    },
  },
})

export const {
  setActivatingConnector,
  setAddress,
  setAuthToken,
  setEns,
  setChain,
  resetWeb3,
} = web3Slice.actions

export const selectActivatingConnector = (state: RootState) =>
  state.web3.activatingConnector

export const selectAddress = (state: RootState) => state.web3.address

export const selectAuthToken = (state: RootState) => state.web3.authToken

export const selectEns = (state: RootState) => state.web3.ens

export default web3Slice.reducer
