import React, { createContext, useContext, useState } from 'react'
import { POST } from './httpHelpers'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [wrongCredentialsError, setWrongCredentialsError] = useState(false)

  const isAuthenticated = () => localStorage.getItem('access_token') !== null

  const authenticate = async (email, password) => {
    // Reset the error (hide the snackbar)
    setWrongCredentialsError(false)

    const res = await POST('/api/token/', { email, password })
    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('access_token', data.access)
      //   localStorage.setItem('refresh_token', data.refresh)

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
