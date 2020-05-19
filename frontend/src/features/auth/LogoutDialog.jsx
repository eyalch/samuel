import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"
import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout, setShowLogoutDialog } from "./authSlice"

const LogoutDialog = () => {
  const { showLogoutDialog } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const hideDialog = useCallback(() => dispatch(setShowLogoutDialog(false)), [
    dispatch,
  ])

  return (
    <Dialog
      open={showLogoutDialog}
      onClose={hideDialog}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">התנתקות</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          האם ברצונכם להתנתק?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>לא</Button>
        <Button
          onClick={() => {
            dispatch(logout())
            hideDialog()
          }}
          variant="contained"
        >
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutDialog
