import { createSlice } from '@reduxjs/toolkit'
import jwt from 'jsonwebtoken'

import * as api from 'api/auth'
import {
  updateTokens,
  getAccessToken,
  isTokenExpired,
  getRefreshToken,
  removeAccessToken,
} from './authHelpers'
import { rollbar } from 'myRollbar'

export const messages = {
  INVALID_CREDENTIALS: 1,
  RE_LOGIN: 2,
}

const initialState = {
  showAuthDialog: false,
  message: null,
  authenticated: false,
  initialAuthentication: true,
}

const auth = createSlice({
  name: 'auth',
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

    authenticateSuccess(state) {
      state.authenticated = true
      state.showAuthDialog = false
    },

    setAuthenticated(state, { payload: authenticated }) {
      state.authenticated = authenticated
    },

    checkForExpiredTokenEnd(state) {
      state.initialAuthentication = false
    },
  },
})

const { authenticateSuccess, checkForExpiredTokenEnd } = auth.actions

export const {
  setMessage,
  resetMessage,
  setShowAuthDialog,
  setAuthenticated,
} = auth.actions

export default auth.reducer

export const authenticate = (username, password) => async dispatch => {
  dispatch(resetMessage())
  try {
    const tokens = await api.getToken(username, password)
    updateTokens(tokens)
    dispatch(authenticateSuccess())

    setRollbarUserId(tokens.access)
  } catch (err) {
    const { status, data } = err.response

    if (status === 401 && data.code === 'authentication_failed') {
      dispatch(setMessage(messages.INVALID_CREDENTIALS))
    }
  }
}

export const refreshToken = () => async () => {
  const tokens = await api.refreshTokens(getRefreshToken())
  updateTokens(tokens)

  setRollbarUserId(tokens.access)
}

export const checkForExpiredToken = () => async dispatch => {
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

const setRollbarUserId = token => {
  const { user_id } = jwt.decode(token)
  if (user_id) rollbar.configure({ payload: { person: { id: user_id } } })
}
