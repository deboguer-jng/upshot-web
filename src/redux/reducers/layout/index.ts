import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

export interface AlertState {
  showAlert: boolean
  alertText: string
}

export interface LayoutState {
  showSidebar: boolean
  showHelpModal: boolean
  alertState: AlertState
}

const initialState: LayoutState = {
  /**
   * Sidebar is visible.
   */
  showSidebar: false,
  showHelpModal: false,
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
    setAlertState: (state, action: PayloadAction<AlertState>) => {
      state.alertState = action.payload
    },
  },
})

export const { setShowSidebar, setShowHelpModal, setAlertState } =
  layoutSlice.actions

export const selectShowSidebar = (state: RootState) => state.layout.showSidebar

export const selectShowHelpModal = (state: RootState) =>
  state.layout.showHelpModal

export const selectAlertState = (state: RootState) => state.layout.alertState

export default layoutSlice.reducer
