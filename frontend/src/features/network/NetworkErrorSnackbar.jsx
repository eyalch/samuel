import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import SnackbarAlert from 'common/SnackbarAlert'
import { setError } from './networkSlice'

const NetworkErrorSnackbar = () => {
  const networkError = useSelector(state => state.network.error)
  const dispatch = useDispatch()

  return (
    <SnackbarAlert
      open={networkError}
      onClose={() => dispatch(setError(false))}
      messageId="network-error-message"
      message="שגיאת תקשורת!"
      severity="info"
    />
  )
}

export default NetworkErrorSnackbar
