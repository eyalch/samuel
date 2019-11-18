import React, { createContext, useContext, useState } from 'react'
import endpoints from './endpoints'
import { POST } from './httpHelpers'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showWrongCredentialsError, setShowWrongCredentialsError] = useState(
    false
  )

  const isAuthenticated = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null

  const authenticate = async (email, password) => {
    // Hide the error
    setShowWrongCredentialsError(false)

    const res = await POST(endpoints.TOKEN, { email, password })
    const data = await res.json()

    if (res.ok) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

      setShowAuthDialog(false)
    } else if (data.code === 'authentication_failed') {
      setShowWrongCredentialsError(true)
    }
  }

  const value = {
    showAuthDialog,
    setShowAuthDialog,
    isAuthenticated,
    authenticate,
    showWrongCredentialsError,
    hideWrongCredentialsError: () => setShowWrongCredentialsError(false),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const refreshToken = async () => {
  // Remove the invalid access token
  localStorage.removeItem(ACCESS_TOKEN_KEY)

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  const res = await POST(endpoints.REFRESH_TOKEN, { refresh: refreshToken })
  const data = await res.json()

  // If the refresh token is invalid, we remove it
  if (data.code === 'token_not_valid') {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    return false
  }

  // Update both tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

  return true
}
