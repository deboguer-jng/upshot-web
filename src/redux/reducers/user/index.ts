import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

export interface UserState {
  isBeta?: boolean
}

const initialState: UserState = {
  isBeta: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsBeta: (state, action: PayloadAction<boolean | undefined>) => {
      state.isBeta = action.payload
    },
  },
})

export const { setIsBeta } = userSlice.actions

export const selectIsBeta = (state: RootState) => state.user.isBeta

export default userSlice.reducer
