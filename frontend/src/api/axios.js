import axios from 'axios'

import store from 'store'
import { getAccessToken, removeAccessToken } from 'features/auth/authHelpers'
import { refreshToken } from 'features/auth/authSlice'
import { setError } from 'features/network/networkSlice'
import { rollbar } from 'myRollbar'

axios.defaults.baseURL = '/api/'

axios.interceptors.request.use(
  config => {
    const token = getAccessToken()
    if (token) config.headers['Authorization'] = `Bearer ${token}`

    // Add a trailing slash
    if (config.url[config.url.length - 1] !== '/') config.url += '/'

    return config
  },
  err => {
    throw err
  }
)

let refreshTokenPromise = null

axios.interceptors.response.use(
  res => res,
  async err => {
    // Handle network errors
    if (!err.response) {
      store.dispatch(setError(true))

      // Disable the error tracking for 100ms
      rollbar.configure({ enabled: false })
      setTimeout(() => rollbar.configure({ enabled: true }), 100)

      throw err
    }

    const { status, data, config } = err.response

    // If the token is invalid we refresh it and retry the request
    // (unless the refresh token is invalid)
    if (
      status === 401 &&
      data.code === 'token_not_valid' &&
      !config.url.includes('token/refresh')
    ) {
      // Remove the invalid access token
      removeAccessToken()

      if (!refreshTokenPromise) {
        refreshTokenPromise = store.dispatch(refreshToken()).then(() => {
          refreshTokenPromise = null
        })
      }

      return refreshTokenPromise.then(() => {
        // Retry the request if the token was successfully refreshed
        config.baseURL = ''
        return axios.request(config)
      })
    }

    throw err
  }
)
