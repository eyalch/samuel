import { CssBaseline } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core/styles"
import { jssPreset, StylesProvider, ThemeProvider } from "@material-ui/styles"
import { create as createJss } from "jss"
import rtl from "jss-rtl"
import React, { useMemo } from "react"
import { useRouteMatch } from "react-router-dom"
import {
  createGlobalStyle,
  ThemeProvider as StyledThemeProvider,
} from "styled-components"

// Since we can't use both `jss` and `injectFirst` on <StylesProvider>, we're
// mimicking the behavior of `injectFirst`. This is actually very similar to
// the source code of Material UI for handling `injectFirst`.
const head = document.head
const injectFirstNode = document.createElement("mui-inject-first")
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

const StyleAndThemeProviders = ({ children }) => {
  const isCoronaPage = useRouteMatch("/corona")

  const theme = useMemo(
    () =>
      createMuiTheme({
        direction: "rtl",
        palette: {
          type: isCoronaPage ? "light" : "dark",
          primary: {
            main: isCoronaPage ? "#000" : "#fff",
          },
          success: {
            light: "#81c784",
            main: "#4caf50",
            dark: "#388e3c",
          },
          info: {
            light: "#64b5f6",
            main: "#2196f3",
            dark: "#1976d2",
          },
          warning: {
            light: "#ffb74d",
            main: "#ff9800",
            dark: "#f57c00",
          },
          error: {
            light: "#e57373",
            main: "#f44336",
            dark: "#d32f2f",
          },
        },
        typography: {
          fontFamily: "Rubik, sans-serif",
        },
        props: {
          MuiButton: {
            color: "primary",
          },
          MuiTextField: {
            margin: "normal",
            variant: "outlined",
          },
        },
      }),
    [isCoronaPage]
  )

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <CssBaseline />
          <GlobalStyles />

          {children}
        </StylesProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  )
}

export default StyleAndThemeProviders
