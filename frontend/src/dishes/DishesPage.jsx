import CircularProgress from '@material-ui/core/CircularProgress'
import BlockIcon from '@material-ui/icons/Block'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../auth/AuthProvider'
import Snackbar from '../common/Snackbar'
import { usePreferences } from '../PreferencesProvider'
import { useDishes } from './DishesProvider'
import FutureDishes from './FutureDishes'
import { getLocalDateISOString } from './helpers'
import TodayDishes from './TodayDishes'

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const DishesPage = () => {
  const [loading, setLoading] = useState(true)

  const {
    dishes,
    fetchDishes,
    orderSuccess,
    hideOrderSuccess,
    allowOrdersUntil,
    timeIsUpError,
    hideTimeIsUpError,
    cancelOrderSuccess,
    hideCancelOrderSuccess,
    maxOrdersError,
    hideMaxOrdersError,
    hasTimeLeft,
  } = useDishes()

  const { checkIsAuthenticated } = useAuth()
  const { max_orders_per_day } = usePreferences()

  const isAuthenticated = checkIsAuthenticated()

  // Fetch dishes for the first time and when the user authenticates
  useEffect(() => {
    setLoading(true)
    fetchDishes().then(() => setLoading(false))
  }, [fetchDishes, isAuthenticated])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const todayDate = useMemo(() => getLocalDateISOString(), [hasTimeLeft])

  // Split the dishes into the arrays: dishes for today & future dishes
  const [todayDishes, futureDishes] = dishes.reduce(
    (result, dish) => {
      result[dish.date === todayDate ? 0 : 1].push(dish)
      return result
    },
    [[], []]
  )

  return (
    <>
      {loading || allowOrdersUntil === undefined ? (
        <StyledProgress color="inherit" />
      ) : (
        <>
          <TodayDishes dishes={todayDishes} />
          <FutureDishes dishes={futureDishes} />
        </>
      )}

      <Snackbar
        open={orderSuccess}
        onClose={hideOrderSuccess}
        messageId="order-success-message"
        icon={CheckCircleIcon}
        message="ההזמנה התקבלה!"
      />

      <Snackbar
        open={cancelOrderSuccess}
        onClose={hideCancelOrderSuccess}
        messageId="cancel-order-success-message"
        icon={CheckCircleIcon}
        message="ההזמנה בוטלה"
      />

      <Snackbar
        open={timeIsUpError}
        onClose={hideTimeIsUpError}
        messageId="time-is-up-message"
        icon={TimerOffIcon}
        message="לא נותר זמן לביצוע הזמנה!"
      />

      <Snackbar
        open={maxOrdersError}
        onClose={hideMaxOrdersError}
        messageId="max-orders-message"
        icon={BlockIcon}
        message={
          max_orders_per_day === 1
            ? 'ניתן להזמין מנה אחת ליום!'
            : `ניתן להזמין עד ${max_orders_per_day} מנות ליום!`
        }
      />
    </>
  )
}

export default DishesPage
