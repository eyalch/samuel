import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Typography } from '@material-ui/core'

import DishList from './DishList'
import { getPrettyWeekday, getLocalDateISOString } from './dishesHelpers'
import { StyledDishesSection } from './TodayDishes'

const perDateReducer = (result, dish) => ({
  ...result,
  [dish.date]: [...(result[dish.date] || []), dish],
})

const selectFutureDishesPerDate = createSelector(
  state => state.dishes.dishes,
  state => state.dishes.hasTimeLeft,
  dishes => {
    const todayDate = getLocalDateISOString()
    const futureDishes = dishes.filter(dish => dish.date !== todayDate)
    return Object.entries(futureDishes.reduce(perDateReducer, {}))
  }
)

const FutureDishes = () => {
  const futureDishesPerDate = useSelector(selectFutureDishesPerDate)

  return futureDishesPerDate.map(([dateStr, dishesForDate]) => (
    <StyledDishesSection key={dateStr}>
      <Typography variant="h4" component="h2" align="center">
        מנות ל{getPrettyWeekday(dateStr)}
      </Typography>
      <DishList dishes={dishesForDate} />
    </StyledDishesSection>
  ))
}

export default FutureDishes
