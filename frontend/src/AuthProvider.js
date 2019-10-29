import React, { createContext, useContext, useState } from 'react'
import { POST } from './httpHelpers'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [wrongCredentialsError, setWrongCredentialsError] = useState(false)

  const isAuthenticated = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null

  const authenticate = async (email, password) => {
    // Reset the error (hide the snackbar)
    setWrongCredentialsError(false)

    const res = await POST('/api/token/', { email, password })
    const data = await res.json()

    if (res.ok) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

      setShowAuthDialog(false)
    } else if (data.code === 'authentication_failed') {
      setWrongCredentialsError(true)
    }
  }

  const value = {
    showAuthDialog,
    setShowAuthDialog,
    isAuthenticated,
    authenticate,
    wrongCredentialsError,
    setWrongCredentialsError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const refreshToken = async () => {
  // Remove the invalid access token
  localStorage.removeItem(ACCESS_TOKEN_KEY)

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  const res = await POST('/api/token/refresh/', { refresh: refreshToken })
  const data = await res.json()

  // Update both tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
}
