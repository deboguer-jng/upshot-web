import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectorName } from 'constants/connectors'
import { RootState } from 'redux/store'

type ENSAccount = {
  name?: string
  avatar?: string
}

export interface Web3State {
  activatingConnector?: ConnectorName
  address?: string
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
   * Wallet's ENS name if available.
   */
  ens: {
    name: undefined,
    avatar: undefined,
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
    setEns: (state, action: PayloadAction<ENSAccount>) => {
      state.ens = action.payload
    },
  },
})

export const { setActivatingConnector, setAddress, setEns } = web3Slice.actions

export const selectActivatingConnector = (state: RootState) =>
  state.web3.activatingConnector

export const selectAddress = (state: RootState) => state.web3.address

export const selectEns = (state: RootState) => state.web3.ens

export default web3Slice.reducer