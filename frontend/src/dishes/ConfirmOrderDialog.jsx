import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'

import { useDishes } from './DishesProvider'
import { getPrettyWeekday } from './helpers'

export default function ConfirmOrderDialog() {
  const {
    pendingDish,
    showConfirmOrderDialog,
    hideConfirmOrderDialog,
    orderPendingDish,
  } = useDishes()

  const prettyWeekday = pendingDish ? getPrettyWeekday(pendingDish.date) : ''

  return (
    <Dialog
      open={showConfirmOrderDialog}
      onClose={hideConfirmOrderDialog}
      aria-labelledby="confirm-second-order-dialog-title"
      aria-describedby="confirm-second-order-dialog-description">
      <DialogTitle id="confirm-second-order-dialog-title">
        להזמין מנה נוספת?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-second-order-dialog-description">
          כבר קיימת הזמנה ל{prettyWeekday}. להזמין מנה נוספת?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideConfirmOrderDialog} color="primary">
          לא
        </Button>
        <Button onClick={orderPendingDish} color="primary">
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}
