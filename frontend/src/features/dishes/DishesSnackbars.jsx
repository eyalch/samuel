import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import SnackbarAlert from 'common/SnackbarAlert'
import { resetMessage, messages } from './dishesSlice'

export default function DishesSnackbars() {
  const { message } = useSelector(state => state.dishes)
  const { max_orders_per_day } = useSelector(state => state.preferences)
  const dispatch = useDispatch()

  return (
    <>
      <SnackbarAlert
        open={message === messages.ORDER_SUCCESS}
        onClose={() => dispatch(resetMessage())}
        messageId="order-success-message"
        message="ההזמנה התקבלה!"
        severity="success"
      />

      <SnackbarAlert
        open={message === messages.CANCEL_ORDER_SUCCESS}
        onClose={() => dispatch(resetMessage())}
        messageId="cancel-order-success-message"
        message="ההזמנה בוטלה"
        severity="success"
      />

      <SnackbarAlert
        open={message === messages.TIME_IS_UP}
        onClose={() => dispatch(resetMessage())}
        messageId="time-is-up-message"
        message="לא נותר זמן לביצוע הזמנה!"
        severity="error"
      />

      <SnackbarAlert
        open={message === messages.MAX_ORDERS_FOR_DAY}
        onClose={() => dispatch(resetMessage())}
        messageId="max-orders-for-day-message"
        message={
          max_orders_per_day === 1
            ? 'ניתן להזמין מנה אחת ליום!'
            : `ניתן להזמין עד ${max_orders_per_day} מנות ליום`
        }
        severity="warning"
      />

      <SnackbarAlert
        open={message === messages.NO_DISHES_LEFT}
        onClose={() => dispatch(resetMessage())}
        messageId="no-dishes-left-message"
        message="לא נותרו מנות"
        severity="error"
      />

      <SnackbarAlert
        open={message === messages.CANCEL_TIME_IS_UP}
        onClose={() => dispatch(resetMessage())}
        messageId="cancel-time-is-up-message"
        message="אין אפשרות לבטל הזמנה לאחר שנגמר הזמן"
        severity="error"
      />
    </>
  )
}
