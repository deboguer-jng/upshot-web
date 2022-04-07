import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

const initialState = {
  config: {},
  loading: false,
}

export const fetchFeatures = createAsyncThunk('app/features', async () => {
  const res = await fetch('/features.json').then((data) => data.json())
  return res
})

export const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeatures.pending, (state: RootState) => {
      state.loading = true
    })
    builder.addCase(
      fetchFeatures.fulfilled,
      (state: RootState, { payload }) => {
        state.loading = false
        state.config = payload
      }
    )
    builder.addCase(fetchFeatures.rejected, (state: RootState) => {
      state.loading = false
    })
  },
})

export const selectFeatures = (state: RootState) => state.features.config

export default featuresSlice.reducer
