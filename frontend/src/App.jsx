import axios from 'axios'
import React, { useEffect } from 'react'
import AuthDialog from './auth/AuthDialog'
import { useAuth } from './auth/AuthProvider'
import { setupAuthInterceptor } from './axios'
import DishesPage from './dishes/DishesPage'
import Layout from './layout/Layout'
import { usePreferences } from './PreferencesProvider'
import withProviders from './withProviders'

export default withProviders(function App() {
  const { fetchPreferences } = usePreferences()
  const { setIsAuthenticated, setShowAuthDialog } = useAuth()

  useEffect(() => {
    const interceptor = setupAuthInterceptor(setIsAuthenticated, () =>
      setShowAuthDialog(true)
    )

    fetchPreferences()

    return () => axios.interceptors.response.eject(interceptor)
  }, [fetchPreferences, setIsAuthenticated, setShowAuthDialog])

  return (
    <Layout>
      <DishesPage />

      <AuthDialog />
    </Layout>
  )
})
