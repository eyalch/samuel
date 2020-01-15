import { createSlice } from '@reduxjs/toolkit'
import jwt from 'jsonwebtoken'

import * as api from 'api/auth'
import {
  updateTokens,
  removeRefreshToken,
  getAccessToken,
  isTokenExpired,
  getRefreshToken,
  removeAccessToken,
} from './authHelpers'
import { rollbar } from 'myRollbar'

const initialState = {
  showAuthDialog: false,
  credentialsError: false,
  authenticated: false,
  initialAuthentication: true,
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setShowAuthDialog(state, { payload: show }) {
      state.showAuthDialog = show
    },
    hideCredentialsError(state) {
      state.credentialsError = false
    },

    authenticateSuccess(state, { payload: tokens }) {
      updateTokens(tokens)
      state.authenticated = true
      state.showAuthDialog = false
    },
    authenticateFailure(state, { payload: res }) {
      if (res.code === 'authentication_failed') {
        state.credentialsError = true
      }
    },

    refreshTokenFailure(state) {
      state.showAuthDialog = true
    },

    setAuthenticated(state, { payload: authenticated }) {
      state.authenticated = authenticated
    },

    checkForExpiredTokenEnd(state) {
      state.initialAuthentication = false
    },
  },
})

const {
  authenticateSuccess,
  authenticateFailure,
  refreshTokenFailure,
  setAuthenticated,
  checkForExpiredTokenEnd,
} = auth.actions

export const { setShowAuthDialog, hideCredentialsError } = auth.actions

export default auth.reducer

export const authenticate = (email, password) => async dispatch => {
  dispatch(hideCredentialsError())
  try {
    const tokens = await api.getToken(email, password)
    dispatch(authenticateSuccess(tokens))

    setRollbarUserId(tokens.access)
  } catch (err) {
    dispatch(authenticateFailure(err.response.data))
  }
}

export const refreshToken = () => async dispatch => {
  try {
    const tokens = await api.getNewTokens(getRefreshToken())
    updateTokens(tokens)

    setRollbarUserId(tokens.access)
  } catch (err) {
    if (err.response.data.code === 'token_not_valid') {
      // Remove the invalid refresh token
      removeRefreshToken()
    }

    dispatch(refreshTokenFailure())
  }
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
