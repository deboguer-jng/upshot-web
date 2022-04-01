import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

export interface LayoutState {
  showSidebar: boolean
  showHelpModal: boolean
}

const initialState: LayoutState = {
  /**
   * Sidebar is visible.
   */
  showSidebar: false,
  showHelpModal: false,
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
  },
})

export const { setShowSidebar, setShowHelpModal } = layoutSlice.actions

export const selectShowSidebar = (state: RootState) => state.layout.showSidebar

export const selectShowHelpModal = (state: RootState) =>
  state.layout.showHelpModal

export default layoutSlice.reducer
