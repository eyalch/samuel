import { createSlice } from '@reduxjs/toolkit'

import { getToken, getNewTokens } from 'api/auth'
import {
  updateTokens,
  removeRefreshToken,
  getAccessToken,
  isTokenExpired,
  getRefreshToken,
  removeAccessToken,
} from './authHelpers'
import { wait } from 'wait'

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
    setShowAuthDialog(state, action) {
      state.showAuthDialog = action.payload
    },
    hideCredentialsError(state, action) {
      state.credentialsError = false
    },

    authenticateStart(state, action) {
      state.credentialsError = false
    },
    authenticateSuccess(state, action) {
      updateTokens(action.payload)
      state.authenticated = true
      state.showAuthDialog = false
    },
    authenticateFailure(state, action) {
      if (action.payload.code === 'authentication_failed') {
        state.credentialsError = true
      }
    },

    refreshTokenSuccess(state, action) {
      updateTokens(action.payload)
    },
    refreshTokenFailure(state, action) {
      if (action.payload.code === 'token_not_valid') {
        // Remove the invalid refresh token
        removeRefreshToken()
      }
      state.showAuthDialog = true
    },

    setAuthenticated(state, action) {
      state.authenticated = action.payload
    },

    checkTokenExpiredEnd(state, action) {
      state.initialAuthentication = false
    },
  },
})

const {
  authenticateStart,
  authenticateSuccess,
  authenticateFailure,
  refreshTokenSuccess,
  refreshTokenFailure,
  setAuthenticated,
  checkTokenExpiredEnd,
} = auth.actions

export const { setShowAuthDialog, hideCredentialsError } = auth.actions

export default auth.reducer

export const authenticate = (email, password) => async dispatch => {
  dispatch(authenticateStart())
  try {
    const { access, refresh } = await getToken(email, password)
    dispatch(authenticateSuccess({ access, refresh }))
  } catch (res) {
    dispatch(authenticateFailure(res))
  }
}

export const refreshToken = () => async dispatch => {
  try {
    const { access, refresh } = await getNewTokens(getRefreshToken())
    await wait(3000)
    dispatch(refreshTokenSuccess({ access, refresh }))
  } catch (res) {
    dispatch(refreshTokenFailure(res))
  }
}

export const checkTokenExpired = () => async dispatch => {
  const token = getAccessToken()

  if (token) {
    if (isTokenExpired(token)) {
      removeAccessToken()

      await dispatch(refreshToken())
      dispatch(setAuthenticated(true))
    } else {
      dispatch(setAuthenticated(true))
    }
  }

  dispatch(checkTokenExpiredEnd())
}
