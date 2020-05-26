import { CircularProgress, Typography } from "@material-ui/core"
import { setShowAuthDialog } from "features/auth/authSlice"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import HealthStatementForm from "./HealthStatementForm"

const StyledTitle = styled(Typography).attrs({
  component: "h1",
  variant: "h4",
})`
  margin-bottom: ${(p) => p.theme.spacing(3)}px;
  text-align: center;
`
const StyledCircularProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const HealthStatementPage = () => {
  const { user, loadingUserInfo, authenticated } = useSelector(
    (state) => state.auth
  )

  const dispatch = useDispatch()

  // Show the authentication dialog if the user isn't authenticated
  useEffect(() => {
    if (loadingUserInfo || authenticated) return

    dispatch(setShowAuthDialog({ show: true, canDismiss: false }))
  }, [authenticated, dispatch, loadingUserInfo])

  return (
    <>
      <Helmet>
        <title>הצהרת בריאות | פובליסיס</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/publicis/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/publicis/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/publicis/favicon-16x16.png"
        />
        <link rel="manifest" href="/publicis/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/publicis/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/publicis/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content="/publicis/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      <StyledTitle>הצהרת בריאות</StyledTitle>

      {user ? (
        user.stated_health_today ? (
          <Typography component="h2" variant="h5" align="center">
            תודה על שיתוף הפעולה!
          </Typography>
        ) : (
          <HealthStatementForm />
        )
      ) : (
        <StyledCircularProgress />
      )}
    </>
  )
}

export default HealthStatementPage
