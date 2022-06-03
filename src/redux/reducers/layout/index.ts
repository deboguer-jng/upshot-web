import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

export interface AlertState {
  showAlert: boolean
  alertText: string
}
export enum DialogModals {
  SIGN_MESSAGE,
  TRANSACTION_FAILED,
  LISTING_EXPIRED,
}

export interface LayoutState {
  showSidebar: boolean
  showHelpModal: boolean
  showConnectModal: boolean
  dialogModalState: DialogModals | null
  alertState: AlertState
}

const initialState: LayoutState = {
  /**
   * Sidebar is visible.
   */
  showSidebar: false,
  showHelpModal: false,
  showConnectModal: false,
  dialogModalState: null,
  alertState: {
    showAlert: false,
    alertText: '',
  },
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload
    },
    setShowHelpModal: (state, action: PayloadAction<boolean>) => {
      state.showHelpModal = action.payload
    },
    setShowConnectModal: (state, action: PayloadAction<boolean>) => {
      state.showConnectModal = action.payload
    },
    setDialogModalState: (
      state,
      action: PayloadAction<DialogModals | null>
    ) => {
      state.dialogModalState = action.payload
    },
    setAlertState: (state, action: PayloadAction<AlertState>) => {
      state.alertState = action.payload
    },
  },
})

export const {
  setShowSidebar,
  setShowHelpModal,
  setShowConnectModal,
  setDialogModalState,
  setAlertState,
} = layoutSlice.actions

export const selectShowSidebar = (state: RootState) => state.layout.showSidebar

export const selectShowHelpModal = (state: RootState) =>
  state.layout.showHelpModal

export const selectShowConnectModal = (state: RootState) =>
  state.layout.showConnectModal

export const selectDialogModalState = (state: RootState) =>
  state.layout.dialogModalState

export const selectAlertState = (state: RootState) => state.layout.alertState

export default layoutSlice.reducer
