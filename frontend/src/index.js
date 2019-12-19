import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import './api/axios'
import * as serviceWorker from './serviceWorker'
import store from './store'
import withStyleProviders from './withStyleProviders'
import { DishesProvider } from './dishes/DishesProvider'

const app = () => (
  <Provider store={store}>
    <DishesProvider>
      <App />
    </DishesProvider>
  </Provider>
)

ReactDOM.render(withStyleProviders(app), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
