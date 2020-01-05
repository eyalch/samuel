import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import App from './App'
import './api/axios'
import * as serviceWorker from './serviceWorker'
import Providers from './Providers'

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })

const app = (
  <Providers>
    <App />
  </Providers>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
