import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
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

const app = (
  <ThemeProvider theme={theme}>
    <StyledThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <CssBaseline />

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
