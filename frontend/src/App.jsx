import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchPreferences } from 'features/preferences/preferencesSlice'
import { checkTokenExpired } from 'features/auth/authSlice'

import AuthDialog from './features/auth/AuthDialog'
import DishesPage from './dishes/DishesPage'
import Layout from './layout/Layout'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPreferences())
    dispatch(checkTokenExpired())
  }, [dispatch])

  return (
    <Layout>
      <DishesPage />

      <AuthDialog />
    </Layout>
  )
}

export default App
