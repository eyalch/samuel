import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Error from '@material-ui/icons/Error'

import Snackbar from 'common/Snackbar'
import { setError } from './networkSlice'

const NetworkErrorSnackbar = () => {
  const networkError = useSelector(state => state.network.error)
  const dispatch = useDispatch()

  return (
    <Snackbar
      open={networkError}
      onClose={() => dispatch(setError(false))}
      messageId="network-error-message"
      icon={Error}
      message="שגיאת תקשורת!"
    />
  )
}

export default NetworkErrorSnackbar
