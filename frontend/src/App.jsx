import axios from 'axios'
import React, { useEffect } from 'react'
import AuthDialog from './auth/AuthDialog'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { setupAuthInterceptor } from './axios'
import DishesPage from './dishes/DishesPage'
import { DishesProvider } from './dishes/DishesProvider'
import Layout from './layout/Layout'
import { PreferencesProvider, usePreferences } from './PreferencesProvider'

const withProviders = App => () => (
  <PreferencesProvider>
    <AuthProvider>
      <DishesProvider>
        <App />
      </DishesProvider>
    </AuthProvider>
  </PreferencesProvider>
)

const App = withProviders(() => {
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

export default App
