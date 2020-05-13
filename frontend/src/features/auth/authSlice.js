import { createSlice } from "@reduxjs/toolkit"
import * as api from "api/auth"
import jwt from "jsonwebtoken"
import { rollbar } from "myRollbar"
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  removeAccessToken,
  removeRefreshToken,
  updateTokens,
} from "./authHelpers"

export const messages = {
  INVALID_CREDENTIALS: 1,
  RE_LOGIN: 2,
}

const initialState = {
  showAuthDialog: false,
  showLogoutDialog: false,
  message: null,
  authenticated: false,
  initialAuthentication: true,
  user: null,
}

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMessage(state, { payload: message }) {
      state.message = message
    },
    resetMessage(state) {
      state.message = null
    },

    setShowAuthDialog(state, { payload: show }) {
      state.showAuthDialog = show
    },

    setShowLogoutDialog(state, { payload: show }) {
      state.showLogoutDialog = show
    },

    authenticateSuccess(state) {
      state.authenticated = true
      state.showAuthDialog = false
    },

    setAuthenticated(state, { payload: authenticated }) {
      state.authenticated = authenticated

      if (!authenticated) {
        state.user = null
      }
    },

    checkForExpiredTokenEnd(state) {
      state.initialAuthentication = false
    },

    fetchUserInfoSuccess(state, { payload: userInfo }) {
      state.user = userInfo
    },
  },
})

const {
  authenticateSuccess,
  checkForExpiredTokenEnd,
  fetchUserInfoSuccess,
} = auth.actions

export const {
  setMessage,
  resetMessage,
  setShowAuthDialog,
  setShowLogoutDialog,
  setAuthenticated,
} = auth.actions

export default auth.reducer

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(resetMessage())
  try {
    const tokens = await api.getToken(username, password)
    updateTokens(tokens)
    dispatch(authenticateSuccess())

    setRollbarUserId(tokens.access)
  } catch (err) {
    const { status, data } = err.response

    if (status === 401 && data.code === "authentication_failed") {
      dispatch(setMessage(messages.INVALID_CREDENTIALS))
    }
  }
}

export const refreshToken = () => async () => {
  const tokens = await api.refreshTokens(getRefreshToken())
  updateTokens(tokens)

  setRollbarUserId(tokens.access)
}

export const checkForExpiredToken = () => async (dispatch) => {
  const token = getAccessToken()

  if (token) {
    if (isTokenExpired(token)) {
      removeAccessToken()

      await dispatch(refreshToken())
      dispatch(setAuthenticated(true))
    } else {
      dispatch(setAuthenticated(true))

      setRollbarUserId(token)
    }
  }

  dispatch(checkForExpiredTokenEnd())
}

const setRollbarUserId = (token) => {
  const { user_id } = jwt.decode(token)
  if (user_id) rollbar.configure({ payload: { person: { id: user_id } } })
}

export const logout = () => (dispatch) => {
  removeAccessToken()
  removeRefreshToken()

  dispatch(setAuthenticated(false))
}

export const fetchUserInfo = () => async (dispatch) => {
  const userInfo = await api.getUserInfo()

  dispatch(fetchUserInfoSuccess(userInfo))
}
