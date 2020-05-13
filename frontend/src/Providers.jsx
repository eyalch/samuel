import React from "react"
import { Provider } from "react-redux"
import store from "./store"
import ThemeProviders from "./ThemeProviders"

const Providers = ({ children }) => (
  <Provider store={store}>
    <ThemeProviders>{children}</ThemeProviders>
  </Provider>
)

export default Providers
