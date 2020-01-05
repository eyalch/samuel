import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchPreferences } from 'features/preferences/preferencesSlice'
import { checkForExpiredToken } from 'features/auth/authSlice'

import AuthDialog from 'features/auth/AuthDialog'
import DishesPage from 'features/dishes/DishesPage'
import Layout from 'layout/Layout'

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
    </Layout>
  )
}

export default App
