import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/styles'
import { create as createJss } from 'jss'
import rtl from 'jss-rtl'
import React from 'react'
import {
  createGlobalStyle,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components'

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

const withStyleProviders = App => (
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

export default withStyleProviders
