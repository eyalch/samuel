import SnackbarAlert from "common/SnackbarAlert"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { setError } from "./networkSlice"

const NetworkErrorSnackbar = () => {
  const networkError = useSelector((state) => state.network.error)
  const dispatch = useDispatch()

  return (
    <SnackbarAlert
      open={networkError}
      onClose={() => dispatch(setError(false))}
      messageId="network-error-message"
      message="שגיאת תקשורת!"
      severity="error"
    />
  )
}

export default NetworkErrorSnackbar
