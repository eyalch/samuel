import axios from 'axios'
import { getAccessToken, refreshToken } from './auth/AuthProvider'

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

export const setupAuthInterceptor = (setIsAuthenticated, showAuthDialog) =>
  axios.interceptors.response.use(
    res => res,
    async err => {
      const { status, data, config } = err.response

      // If the token is invalid we refresh it and retry the request
      // (unless the refresh token is invalid)
      if (
        status === 401 &&
        data.code === 'token_not_valid' &&
        !config.url.includes('token/refresh')
      ) {
        try {
          // Try to refresh the token
          await refreshToken()

          setIsAuthenticated(true)

          // Retry the request if the token was successfully refreshed
          config.baseURL = ''
          return axios.request(config)
        } catch (err) {
          setIsAuthenticated(false)
          showAuthDialog()
        }
      }

      throw err
    }
  )
