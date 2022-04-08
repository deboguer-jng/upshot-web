import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

const initialState = {
  config: {},
  loading: false,
}

const featureConfigURL = process.env.NEXT_PUBLIC_FEATURES_URL

export const fetchFeatures = createAsyncThunk('app/features', async () => {
  if (!featureConfigURL) {
    console.warn('Using default feature set.')
    return
  }

  const res = await fetch(featureConfigURL).then((data) => data.json())
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
