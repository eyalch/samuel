import React from "react"
import { Provider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import store from "./store"
import ThemeProviders from "./ThemeProviders"

const Providers = ({ children }) => (
  <Router>
    <Provider store={store}>
      <ThemeProviders>{children}</ThemeProviders>
    </Provider>
  </Router>
)

export default Providers
