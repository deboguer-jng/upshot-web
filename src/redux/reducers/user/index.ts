import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

interface UserIdentity {
  id: string | null
  addresses: string[]
  username: string | null
  avatar: string | null
}

export interface UserState {
  identity: UserIdentity
}

const initialState: UserState = {
  /**
   * Global user values needed at an app-context.
   *
   * @notice We don't need to store the user's full bio
   * or other details that are only displayed in the
   * context of the profile page view.
   */
  identity: {
    id: null,
    addresses: [],
    username: null,
    avatar: null,
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIdentity: (state, action: PayloadAction<UserIdentity>) => {
      state.identity = action.payload
    },
  },
})

export const { setIdentity } = userSlice.actions

export const selectIdentity = (state: RootState) => state.user

export default userSlice.reducer
