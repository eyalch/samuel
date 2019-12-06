import Typography from '@material-ui/core/Typography'
import React from 'react'
import DishList from './DishList'
import { getPrettyWeekday } from './helpers'
import { StyledDishesSection } from './TodayDishes'

const FutureDishes = ({ dishes }) => {
  const dishesPerDate = dishes.reduce(
    (result, dish) => ({
      ...result,
      [dish.date]: [...(result[dish.date] || []), dish],
    }),
    {}
  )

  return Object.entries(dishesPerDate).map(([dateStr, dishesForDate]) => (
    <StyledDishesSection key={dateStr}>
      <Typography variant="h4" component="h2" align="center">
        מנות ל{getPrettyWeekday(dateStr)}
      </Typography>
      <DishList dishes={dishesForDate} />
    </StyledDishesSection>
  ))
}

export default FutureDishes
