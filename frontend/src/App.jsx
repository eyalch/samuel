import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchPreferences } from 'features/preferences/preferencesSlice'
import { checkForExpiredToken } from 'features/auth/authSlice'

import Layout from 'layout/Layout'
import Auth from 'features/auth/Auth'
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

      <Auth />

      <NetworkErrorSnackbar />
    </Layout>
  )
}

export default App
