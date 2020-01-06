import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: false,
}

const network = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setError(state, { payload: error }) {
      state.error = error
    },
  },
})

export const { setError } = network.actions

export default network.reducer
