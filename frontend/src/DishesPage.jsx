import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDishes } from './DishesProvider'
import DishList from './DishList'
import Snackbar from './Snackbar'
import { TimeLeft } from './TimeLeft'

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
  } = useDishes()

  useEffect(() => {
    fetchDishes().then(() => setLoading(false))
  }, [fetchDishes])

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
        open={timeIsUpError}
        onClose={hideTimeIsUpError}
        messageId="time-is-up-message"
        icon={TimerOffIcon}
        message="לא נותר זמן לביצוע הזמנה!"
      />
    </>
  )
}

export default DishesPage
