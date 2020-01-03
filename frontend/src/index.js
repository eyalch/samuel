import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'

import App from './App'
import './api/axios'
import * as serviceWorker from './serviceWorker'
import store from './store'
import StyleAndThemeProviders from './StyleAndThemeProviders'

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })

const app = (
  <Provider store={store}>
    <StyleAndThemeProviders>
      <App />
    </StyleAndThemeProviders>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
