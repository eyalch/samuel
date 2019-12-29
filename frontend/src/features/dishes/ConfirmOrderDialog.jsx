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

import { resetConfirmPendingDish, orderPendingDish } from './dishesSlice'
import { getPrettyWeekday } from './dishesHelpers'

const ConfirmOrderDialog = () => {
  const { confirmOrderDialog, pendingDish } = useSelector(state => state.dishes)
  const dispatch = useDispatch()

  const hideConfirmOrderDialog = useCallback(
    () => dispatch(resetConfirmPendingDish()),
    [dispatch]
  )

  const prettyWeekday = pendingDish ? getPrettyWeekday(pendingDish.date) : ''

  return (
    <Dialog
      open={confirmOrderDialog}
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
        <Button onClick={() => dispatch(orderPendingDish())} color="primary">
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmOrderDialog
