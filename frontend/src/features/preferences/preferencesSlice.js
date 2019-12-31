import { createSlice } from '@reduxjs/toolkit'

import * as api from 'api/preferences'

const preferences = createSlice({
  name: 'preferences',
  initialState: {},
  reducers: {
    fetchPreferencesSuccess(state, { payload }) {
      const preferencesObj = payload.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
      Object.assign(state, preferencesObj) // `state = ...` didn't work
    },
  },
})

const { fetchPreferencesSuccess } = preferences.actions

export default preferences.reducer

export const fetchPreferences = () => async dispatch => {
  const { data } = await api.getPreferences()
  dispatch(fetchPreferencesSuccess(data))
}
