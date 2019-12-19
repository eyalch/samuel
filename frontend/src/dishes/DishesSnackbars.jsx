import React from 'react'
import { useSelector } from 'react-redux'
import BlockIcon from '@material-ui/icons/Block'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import TimerOffIcon from '@material-ui/icons/TimerOff'

import Snackbar from '../common/Snackbar'
import { messages, useDishes } from './DishesProvider'

const iconsMap = {
  [messages.ORDER_SUCCESS]: CheckCircleIcon,
  [messages.CANCEL_ORDER_SUCCESS]: CheckCircleIcon,
  [messages.TIME_IS_UP]: TimerOffIcon,
  [messages.MAX_ORDERS]: BlockIcon,
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
  const { message, resetMessage } = useDishes()

  const { max_orders_per_day } = useSelector(state => state.preferences)

  return (
    <Snackbar
      open={message !== null}
      onClose={resetMessage}
      messageId="dishes-message"
      icon={iconsMap[message]}
      message={getMessageText(message, max_orders_per_day)}
    />
  )
}
