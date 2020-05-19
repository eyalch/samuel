import { createSlice } from "@reduxjs/toolkit"
import * as api from "api"
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
  canDismissAuthDialog: true,
  showLogoutDialog: false,
  message: null,
  authenticated: false,
  initialAuthentication: true,
  user: null,
  loadingUserInfo: true,
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

    setShowAuthDialog(state, { payload }) {
      if (typeof payload === "boolean") {
        state.showAuthDialog = payload
        state.canDismissAuthDialog = true
      } else if (typeof payload === "object") {
        state.showAuthDialog = payload.show
        state.canDismissAuthDialog =
          payload.canDismiss !== undefined ? payload.canDismiss : true
      }
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
      state.loadingUserInfo = false
    },

    setLoadingUserInfo(state, { payload: loading }) {
      state.loadingUserInfo = loading
    },

    stateHealthSuccess(state) {
      state.user = { ...state.user, stated_health_today: true }
    },
  },
})

const {
  authenticateSuccess,
  checkForExpiredTokenEnd,
  fetchUserInfoSuccess,
  setLoadingUserInfo,
} = auth.actions

export const {
  setMessage,
  resetMessage,
  setShowAuthDialog,
  setShowLogoutDialog,
  setAuthenticated,
  stateHealthSuccess,
} = auth.actions

export default auth.reducer

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(resetMessage())
  try {
    const { data: tokens } = await api.auth.getToken(username, password)
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
  const { data: tokens } = await api.auth.refreshTokens(getRefreshToken())
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
  } else {
    dispatch(setLoadingUserInfo(false))
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
  const { data: userInfo } = await api.auth.getUserInfo()

  dispatch(fetchUserInfoSuccess(userInfo))
}
