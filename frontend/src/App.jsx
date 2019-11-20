import React from 'react'
import AuthDialog from './auth/AuthDialog'
import { AuthProvider } from './auth/AuthProvider'
import DishesPage from './dishes/DishesPage'
import { DishesProvider } from './dishes/DishesProvider'
import Layout from './layout/Layout'
import { PreferencesProvider } from './PreferencesProvider'

const App = () => (
  <PreferencesProvider>
    <AuthProvider>
      <Layout>
        <DishesProvider>
          <DishesPage />
        </DishesProvider>

        <AuthDialog />
      </Layout>
    </AuthProvider>
  </PreferencesProvider>
)

export default App
