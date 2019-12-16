import Typography from '@material-ui/core/Typography'
import React, { useMemo } from 'react'
import DishList from './DishList'
import { getPrettyWeekday } from './helpers'
import { StyledDishesSection } from './TodayDishes'

function reducer(result, dish) {
  return {
    ...result,
    [dish.date]: [...(result[dish.date] || []), dish],
  }
}

export default function FutureDishes({ dishes }) {
  const dishesPerDate = useMemo(
    () => Object.entries(dishes.reduce(reducer, {})),
    [dishes]
  )

  return dishesPerDate.map(([dateStr, dishesForDate]) => (
    <StyledDishesSection key={dateStr}>
      <Typography variant="h4" component="h2" align="center">
        מנות ל{getPrettyWeekday(dateStr)}
      </Typography>
      <DishList dishes={dishesForDate} />
    </StyledDishesSection>
  ))
}
