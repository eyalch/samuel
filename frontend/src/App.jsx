import Auth from "features/auth/Auth"
import { checkForExpiredToken } from "features/auth/authSlice"
import HealthStatementPage from "features/corona/HealthStatementPage"
import DishesPage from "features/dishes/DishesPage"
import NetworkErrorSnackbar from "features/network/NetworkErrorSnackbar"
import { fetchPreferences } from "features/preferences/preferencesSlice"
import Layout from "layout/Layout"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Route, Switch } from "react-router-dom"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPreferences())
    dispatch(checkForExpiredToken())
  }, [dispatch])

  return (
    <Layout>
      <Switch>
        <Route path="/corona">
          <HealthStatementPage />
        </Route>
        <Route path="/">
          <DishesPage />
        </Route>
      </Switch>

      <Auth />

      <NetworkErrorSnackbar />
    </Layout>
  )
}

export default App
