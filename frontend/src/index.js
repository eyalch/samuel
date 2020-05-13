import React from "react"
import ReactDOM from "react-dom"
import "./api/axios"
import App from "./App"
import "./myRollbar"
import Providers from "./Providers"
import * as serviceWorker from "./serviceWorker"

const app = (
  <Providers>
    <App />
  </Providers>
)

ReactDOM.render(app, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
