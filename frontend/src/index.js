import React from 'react'
import ReactDOM from 'react-dom'
import Rollbar from 'rollbar'

import App from './App'
import './api/axios'
import * as serviceWorker from './serviceWorker'
import Providers from './Providers'

export const rollbar = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: { environment: process.env.NODE_ENV },
})

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
