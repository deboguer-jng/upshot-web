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
  transactions: string[]
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
  /**
   * Pending transaction hashes
   */
  transactions: [],
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
    addTransaction: (state, action: PayloadAction<string>) => {
      if (state.transactions?.includes(action.payload)) return

      state.transactions = [...(state.transactions ?? []), action.payload]
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions =
        state.transactions?.filter((hash) => hash !== action.payload) ?? []
    },
    resetTransactions: (state) => {
      state.transactions = []
    },
    resetWeb3: (state) => {
      state.address = undefined
      state.authToken = undefined
      state.chain = undefined
      state.ens = {
        name: undefined,
      }
      state.transactions = []
    },
  },
})

export const {
  setActivatingConnector,
  setAddress,
  setAuthToken,
  setEns,
  setChain,
  addTransaction,
  removeTransaction,
  resetWeb3,
} = web3Slice.actions

export const selectActivatingConnector = (state: RootState) =>
  state.web3.activatingConnector

export const selectAddress = (state: RootState) => state.web3.address

export const selectAuthToken = (state: RootState) => state.web3.authToken

export const selectEns = (state: RootState) => state.web3.ens

export const selectTransactions = (state: RootState) => state.web3.transactions

export default web3Slice.reducer
