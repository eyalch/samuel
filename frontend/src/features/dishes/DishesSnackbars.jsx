import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Block from '@material-ui/icons/Block'
import CheckCircle from '@material-ui/icons/CheckCircle'
import TimerOff from '@material-ui/icons/TimerOff'

import Snackbar from 'common/Snackbar'
import { resetMessage, messages } from './dishesSlice'

const iconsMap = {
  [messages.ORDER_SUCCESS]: CheckCircle,
  [messages.CANCEL_ORDER_SUCCESS]: CheckCircle,
  [messages.TIME_IS_UP]: TimerOff,
  [messages.MAX_ORDERS_FOR_DAY]: Block,
  [messages.NO_DISHES_LEFT]: Block,
  [messages.CANCEL_TIME_IS_UP]: TimerOff,
}

const getMessageText = (message, maxOrders) =>
  ({
    [messages.ORDER_SUCCESS]: 'ההזמנה התקבלה!',
    [messages.CANCEL_ORDER_SUCCESS]: 'ההזמנה בוטלה',
    [messages.TIME_IS_UP]: 'לא נותר זמן לביצוע הזמנה!',
    [messages.MAX_ORDERS_FOR_DAY]:
      maxOrders === 1
        ? 'ניתן להזמין מנה אחת ליום!'
        : `ניתן להזמין עד ${maxOrders} מנות ליום`,
    [messages.NO_DISHES_LEFT]: 'לא נותרו מנות',
    [messages.CANCEL_TIME_IS_UP]: 'אין אפשרות לבטל הזמנה לאחר שנגמר הזמן',
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
