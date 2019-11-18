import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDishes } from './DishesProvider'
import DishList from './DishList'
import Snackbar from './Snackbar'

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const DishesPage = () => {
  const [loading, setLoading] = useState(true)

  const { dishes, fetchDishes, orderSuccess, hideOrderSuccess } = useDishes()

  useEffect(() => {
    fetchDishes().then(() => setLoading(false))
  }, [fetchDishes])

  return (
    <div>
      {loading ? (
        <StyledProgress color="inherit" />
      ) : dishes.length ? (
        <DishList dishes={dishes} />
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
    </div>
  )
}

export default DishesPage
