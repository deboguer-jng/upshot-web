import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectorName } from 'constants/connectors'
import { RootState } from 'redux/store'

type Auth = {
  nonce?: string
  signature?: string
}

type ENSAccount = {
  name?: string
}

export interface Web3State {
  activatingConnector?: ConnectorName
  address?: string
  auth: Auth
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
   * Signed authentication message.
   */
  auth: {
    nonce: undefined,
    signature: undefined,
  },
  /**
   * Wallet's ENS name if available.
   */
  ens: {
    name: undefined,
  },
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
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload
    },
    setNonce: (state, action: PayloadAction<string | undefined>) => {
      state.auth.nonce = action.payload
    },
    setSignature: (state, action: PayloadAction<string | undefined>) => {
      state.auth.signature = action.payload
    },
    setEns: (state, action: PayloadAction<ENSAccount>) => {
      state.ens = action.payload
    },
    resetWeb3: (state) => {
      state.address = undefined
      state.auth = {
        nonce: undefined,
        signature: undefined,
      }
      state.ens = {
        name: undefined,
      }
    },
  },
})

export const {
  setActivatingConnector,
  setAddress,
  setAuth,
  setEns,
  setSignature,
  resetWeb3,
} = web3Slice.actions

export const selectActivatingConnector = (state: RootState) =>
  state.web3.activatingConnector

export const selectAddress = (state: RootState) => state.web3.address

export const selectAuth = (state: RootState) => state.web3.auth

export const selectEns = (state: RootState) => state.web3.ens

export default web3Slice.reducer
