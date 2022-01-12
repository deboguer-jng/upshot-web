import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

export interface LayoutState {
  showSidebar: boolean
}

const initialState: LayoutState = {
  /**
   * Sidebar is visible.
   */
  showSidebar: false,
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload
    },
  },
})

export const { setShowSidebar } = layoutSlice.actions

export const selectShowSidebar = (state: RootState) => state.layout.showSidebar

export default layoutSlice.reducer
