import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'
import { getPrettyWeekday } from './helpers'

const ConfirmOrderDialog = ({ open, dishDate, onClose, onAgree }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="confirm-second-order-dialog-title"
    aria-describedby="confirm-second-order-dialog-description">
    <DialogTitle id="confirm-second-order-dialog-title">
      להזמין מנה נוספת?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="confirm-second-order-dialog-description">
        כבר קיימת הזמנה ל{getPrettyWeekday(dishDate)}. להזמין מנה נוספת?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        לא
      </Button>
      <Button onClick={onAgree} color="primary">
        כן
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmOrderDialog
