import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchPreferences } from 'features/preferences/preferencesSlice'
import { checkForExpiredToken } from 'features/auth/authSlice'

import Layout from 'layout/Layout'
import AuthDialog from 'features/auth/AuthDialog'
import DishesPage from 'features/dishes/DishesPage'
import NetworkErrorSnackbar from 'features/network/NetworkErrorSnackbar'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPreferences())
    dispatch(checkForExpiredToken())
  }, [dispatch])

  return (
    <Layout>
      <DishesPage />

      <AuthDialog />

      <NetworkErrorSnackbar />
    </Layout>
  )
}

export default App
