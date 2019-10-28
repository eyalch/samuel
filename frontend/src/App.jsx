import React from 'react'
import AuthDialog from './AuthDialog'
import { AuthProvider } from './AuthProvider'
import DishesPage from './DishesPage'
import { DishesProvider } from './DishesProvider'
import Layout from './Layout'

const App = () => (
  <AuthProvider>
    <Layout>
      <DishesProvider>
        <DishesPage />
      </DishesProvider>

      <AuthDialog />
    </Layout>
  </AuthProvider>
)

export default App
