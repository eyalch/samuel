import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

import { setShowLogoutDialog, logout } from './authSlice'

const LogoutDialog = () => {
  const { showLogoutDialog } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const hideDialog = useCallback(() => dispatch(setShowLogoutDialog(false)), [
    dispatch,
  ])

  return (
    <Dialog
      open={showLogoutDialog}
      onClose={hideDialog}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description">
      <DialogTitle id="logout-dialog-title">התנתקות</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          האם ברצונכם להתנתק?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog} color="primary">
          לא
        </Button>
        <Button
          onClick={() => {
            dispatch(logout())
            hideDialog()
          }}
          color="primary"
          variant="contained">
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutDialog
