import React from 'react'
import AuthDialog from './AuthDialog'
import { AuthProvider } from './AuthProvider'
import DishesPage from './DishesPage'
import { DishesProvider } from './DishesProvider'
import Layout from './Layout'
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
