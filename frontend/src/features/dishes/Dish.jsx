import React, { useState, useCallback } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from '@material-ui/core'
import DoneOutline from '@material-ui/icons/DoneOutline'

import { orderDish, cancelOrder } from './dishesSlice'
import { getLocalDateISOString } from './dishesHelpers'
import placeholderImage from './placeholder.png'

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
`
const StyledCardMedia = styled(CardMedia)`
  height: 240px;
  background-size: cover;

  &.placeholder {
    background-size: auto calc(100% - ${p => p.theme.spacing(4)}px);
  }
`
const StyledIndicatorsOverlay = styled.div`
  height: 100%;
  background-image: radial-gradient(
    circle at bottom left,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0)
  );
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: ${p => p.theme.spacing(1)}px;
`
const StyledCardActions = styled(CardActions)`
  margin-top: auto;
`
const StyledLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-around;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 ${p => p.theme.spacing(1)}px;
`

const isAllowedToOrderSelector = createSelector(
  state => state.dishes.hasTimeLeft,
  (_, dish) => dish,
  (hasTimeLeft, dish) => {
    // User should be able to make his first order as long as there are dishes left
    if (dish.orders_count === 0) return dish.has_dishes_left

    const isDishForToday = getLocalDateISOString() === dish.date
    return hasTimeLeft || !isDishForToday || dish.has_dishes_left
  }
)

const Dish = ({ dish }) => {
  const [loading, setLoading] = useState(false)

  // If there's time left to order today OR the dish is not for today,
  // then the user is allowed to order
  const isAllowedToOrder = useSelector(state =>
    isAllowedToOrderSelector(state, dish)
  )
  const dispatch = useDispatch()

  // A wrapper function for ordering & canceling.
  // It checks whether ordering (or canceling) is allowed and handles loading.
  const onAction = useCallback(
    async action => {
      if (!isAllowedToOrder) return

      setLoading(true)
      try {
        await dispatch(action(dish))
      } finally {
        setLoading(false)
      }
    },
    [dish, dispatch, isAllowedToOrder]
  )
  const onOrder = useCallback(() => onAction(orderDish), [onAction])
  const onCancel = useCallback(() => onAction(cancelOrder), [onAction])

  const isOrdered = dish.orders_count > 0

  return (
    <StyledCard component="li">
      <StyledCardMedia
        image={dish.image || placeholderImage}
        className={dish.image ? '' : 'placeholder'}
        data-testid="dish-image">
        {isOrdered && (
          <StyledIndicatorsOverlay>
            {// Show an icon for every order of the dish
            [...Array(dish.orders_count)].map((_, i) => (
              <DoneOutline
                key={i}
                style={{ fontSize: 56 }}
                data-testid="check-mark"
              />
            ))}
          </StyledIndicatorsOverlay>
        )}
      </StyledCardMedia>

      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {dish.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {dish.description}
        </Typography>
      </CardContent>

      {isAllowedToOrder && (
        <StyledCardActions>
          <Button
            color="primary"
            size="large"
            variant={isOrdered ? 'outlined' : 'contained'}
            onClick={onOrder}
            disabled={loading || !dish.has_dishes_left}>
            {isOrdered ? 'להזמנה נוספת' : 'להזמנה'}
          </Button>
          {isOrdered && (
            <Button
              color="primary"
              size="large"
              onClick={onCancel}
              disabled={loading}>
              ביטול
            </Button>
          )}
        </StyledCardActions>
      )}

      {loading && (
        <StyledLoadingOverlay>
          <CircularProgress size={72} />
        </StyledLoadingOverlay>
      )}
    </StyledCard>
  )
}

export default Dish
