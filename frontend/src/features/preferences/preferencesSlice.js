import { createSlice } from "@reduxjs/toolkit"
import * as api from "api"

const preferences = createSlice({
  name: "preferences",
  initialState: {},
  reducers: {
    fetchPreferencesSuccess(state, { payload }) {
      Object.assign(state, payload) // `state = ...` didn't work
    },
  },
})

const { fetchPreferencesSuccess } = preferences.actions

export default preferences.reducer

export const fetchPreferences = () => async (dispatch) => {
  const { data } = await api.preferences.getPreferences()

  const preferencesObj = data.reduce(
    (acc, { key, value }) => ({ ...acc, [key]: value }),
    {}
  )

  dispatch(fetchPreferencesSuccess(preferencesObj))
}
