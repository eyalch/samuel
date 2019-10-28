import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/styles'
import { create as createJss } from 'jss'
import rtl from 'jss-rtl'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  createGlobalStyle,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components'
import App from './App'
import * as serviceWorker from './serviceWorker'

const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    type: 'dark',
    primary: { main: '#fff' },
  },
  typography: {
    fontFamily: ['Heebo', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
      ', '
    ),
  },
})

// Since we can't use both `jss` and `injectFirst` on <StylesProvider>, we're
// mimicking the behavior of `injectFirst`. This is actually very similar to
// the source code of Material UI for handling `injectFirst`.
const head = document.head
const injectFirstNode = document.createElement('mui-inject-first')
head.insertBefore(injectFirstNode, head.firstChild)

const jss = createJss({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: injectFirstNode,
})

const GlobalStyles = createGlobalStyle`
  :root {
    direction: rtl;
  }
`

const app = (
  <ThemeProvider theme={theme}>
    <StyledThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <CssBaseline />
        <GlobalStyles />

        <App />
      </StylesProvider>
    </StyledThemeProvider>
  </ThemeProvider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
