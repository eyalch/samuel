import axios from "axios"
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from "features/auth/authHelpers"
import {
  messages,
  refreshToken,
  setMessage,
  setShowAuthDialog,
} from "features/auth/authSlice"
import { setError } from "features/network/networkSlice"
import { rollbar } from "myRollbar"
import store from "store"

axios.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers["Authorization"] = `Bearer ${token}`

  // Add a trailing slash
  if (config.url[config.url.length - 1] !== "/") config.url += "/"

  return config
})

let refreshTokenPromise = null

export const responseInterceptor = (err) => {
  // Handle network errors
  if (!err.response) {
    store.dispatch(setError(true))

    // Disable the error tracking for 100ms
    rollbar.configure({ enabled: false })
    setTimeout(() => rollbar.configure({ enabled: true }), 100)

    throw err
  }

  const { status, data, config } = err.response

  // If the token is invalid AND it's not a retry request (i.e the refresh
  // token is invalid), refresh the token(s) and retry the request
  if (status === 401 && data.code === "token_not_valid") {
    // If the refresh token is invalid then the user should re-authenticate
    if (config.__isRefreshingTokens) {
      // Remove the invalid refresh token
      removeRefreshToken()

      store.dispatch(setShowAuthDialog(true))
      store.dispatch(setMessage(messages.RE_LOGIN))

      throw err
    }

    // Remove the invalid access token
    removeAccessToken()

    if (!refreshTokenPromise) {
      refreshTokenPromise = store.dispatch(refreshToken()).finally(() => {
        refreshTokenPromise = null
      })
    }

    return refreshTokenPromise.then(() => {
      // Retry the request
      config.baseURL = ""
      return axios.request(config)
    })
  }

  throw err
}
axios.interceptors.response.use(null, responseInterceptor)
