import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Block, CheckCircle, TimerOff } from '@material-ui/icons'

import Snackbar from 'common/Snackbar'
import { resetMessage, messages } from './dishesSlice'

const iconsMap = {
  [messages.ORDER_SUCCESS]: CheckCircle,
  [messages.CANCEL_ORDER_SUCCESS]: CheckCircle,
  [messages.TIME_IS_UP]: TimerOff,
  [messages.MAX_ORDERS]: Block,
}

const getMessageText = (message, maxOrders) =>
  ({
    [messages.ORDER_SUCCESS]: 'ההזמנה התקבלה!',
    [messages.CANCEL_ORDER_SUCCESS]: 'ההזמנה בוטלה',
    [messages.TIME_IS_UP]: 'לא נותר זמן לביצוע הזמנה!',
    [messages.MAX_ORDERS]:
      maxOrders === 1
        ? 'ניתן להזמין מנה אחת ליום!'
        : `ניתן להזמין עד ${maxOrders} מנות ליום!`,
  }[message])

export default function DishesSnackbars() {
  const { message } = useSelector(state => state.dishes)
  const { max_orders_per_day } = useSelector(state => state.preferences)
  const dispatch = useDispatch()

  return (
    <Snackbar
      open={message !== null}
      onClose={() => dispatch(resetMessage())}
      messageId="dishes-message"
      icon={iconsMap[message]}
      message={getMessageText(message, max_orders_per_day)}
    />
  )
}
