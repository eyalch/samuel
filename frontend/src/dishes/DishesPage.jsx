import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import BlockIcon from '@material-ui/icons/Block'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDishes } from './DishesProvider'
import DishList from './DishList'
import Snackbar from '../common/Snackbar'
import { TimeLeft } from './TimeLeft'
import { useAuth } from '../auth/AuthProvider'

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
  } = useDishes()

  const { checkIsAuthenticated } = useAuth()

  const isAuthenticated = checkIsAuthenticated()

  // Fetch dishes for the first time and when the user authenticates
  useEffect(() => {
    setLoading(true)
    fetchDishes().then(() => setLoading(false))
  }, [fetchDishes, isAuthenticated])

  return (
    <>
      {loading || allowOrdersUntil === undefined ? (
        <StyledProgress color="inherit" />
      ) : dishes.length ? (
        <>
          <TimeLeft />
          <DishList dishes={dishes} />
        </>
      ) : (
        <Typography variant="h4" component="p" align="center">
          אין מנות להיום
        </Typography>
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
        message="כבר ביצעת את הכמות המקסימלית של ההזמנות להיום"
      />
    </>
  )
}

export default DishesPage
