import { CircularProgress, Typography } from "@material-ui/core"
import { setShowAuthDialog } from "features/auth/authSlice"
import React, { useEffect } from "react"
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
