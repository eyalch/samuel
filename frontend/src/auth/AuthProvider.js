import axios from 'axios'
import jwt from 'jsonwebtoken'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const KEY_ACCESS_TOKEN = 'access_token'
const KEY_REFRESH_TOKEN = 'refresh_token'

export const getAccessToken = () => localStorage.getItem(KEY_ACCESS_TOKEN)

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showCredentialsError, setShowCredentialsError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialAuthentication, setIsInitialAuthentication] = useState(true)

  // Check if the token is expired
  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      setIsInitialAuthentication(false)
    } else if (isTokenExpired(token)) {
      refreshToken()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setIsInitialAuthentication(false))
    } else {
      setIsAuthenticated(true)
      setIsInitialAuthentication(false)
    }
  }, [])

  const authenticate = useCallback(async (email, password) => {
    // Hide the error
    setShowCredentialsError(false)

    try {
      const { data } = await axios.post('token', { email, password })

      localStorage.setItem(KEY_ACCESS_TOKEN, data.access)
      localStorage.setItem(KEY_REFRESH_TOKEN, data.refresh)

      setShowAuthDialog(false)
      setIsAuthenticated(true)
    } catch ({ response }) {
      if (response.data.code === 'authentication_failed') {
        setShowCredentialsError(true)
      }
    }
  }, [])

  const value = {
    showAuthDialog,
    setShowAuthDialog,
    isAuthenticated,
    setIsAuthenticated,
    authenticate,
    isInitialAuthentication,
    showCredentialsError,
    hideCredentialsError: () => setShowCredentialsError(false),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

let refreshTokenPromise = null

export const refreshToken = async () => {
  // If we've already sent a request to refresh the token then there's no need
  // to send another one, so we just return the initial promise
  if (refreshTokenPromise) return refreshTokenPromise

  // Remove the invalid access token
  localStorage.removeItem(KEY_ACCESS_TOKEN)

  const refreshToken = localStorage.getItem(KEY_REFRESH_TOKEN)

  refreshTokenPromise = axios.post('token/refresh', { refresh: refreshToken })

  try {
    const { data } = await refreshTokenPromise

    // Update both tokens
    localStorage.setItem(KEY_ACCESS_TOKEN, data.access)
    localStorage.setItem(KEY_REFRESH_TOKEN, data.refresh)
  } catch (err) {
    // If the refresh token is invalid, we remove it
    if (err.response.data.code === 'token_not_valid') {
      localStorage.removeItem(KEY_REFRESH_TOKEN)
    }
    throw err
  } finally {
    refreshTokenPromise = null
  }
}

const isTokenExpired = token => {
  const decoded = jwt.decode(token)
  return Date.now() >= decoded.exp * 1000
}
