import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showWrongCredentialsError, setShowWrongCredentialsError] = useState(
    false
  )

  const checkIsAuthenticated = () =>
    localStorage.getItem(ACCESS_TOKEN_KEY) !== null

  const authenticate = async (email, password) => {
    // Hide the error
    setShowWrongCredentialsError(false)

    try {
      const { data } = await axios.post('token', { email, password })

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

      setShowAuthDialog(false)
    } catch ({ response }) {
      if (response.data.code === 'authentication_failed') {
        setShowWrongCredentialsError(true)
      }
    }
  }

  const value = {
    showAuthDialog,
    setShowAuthDialog,
    checkIsAuthenticated,
    authenticate,
    showWrongCredentialsError,
    hideWrongCredentialsError: () => setShowWrongCredentialsError(false),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

let refreshTokenPromise = null

export const refreshToken = async () => {
  // If we've already sent a request to refresh the token then there's no need
  // to send another one, so we just return the initial promise
  if (refreshTokenPromise) return refreshTokenPromise

  // Remove the invalid access token
  localStorage.removeItem(ACCESS_TOKEN_KEY)

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  refreshTokenPromise = axios
    .post('token/refresh', { refresh: refreshToken })
    .then(({ data }) => {
      // Update both tokens
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
    })
    .catch(err => {
      // If the refresh token is invalid, we remove it
      if (err.response.data.code === 'token_not_valid') {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      }
      throw err
    })
    .finally(() => {
      refreshTokenPromise = null
    })

  return refreshTokenPromise
}
