import Typography from '@material-ui/core/Typography'
import React from 'react'
import DishList from './DishList'
import { StyledDishesSection } from './TodayDishes'

const FutureDishes = ({ dishes }) => {
  const dishesPerDate = dishes.reduce(
    (result, dish) => ({
      ...result,
      [dish.date]: [...(result[dish.date] || []), dish],
    }),
    {}
  )

  return Object.entries(dishesPerDate).map(([date, dishesForDate]) => (
    <StyledDishesSection key={date}>
      <Typography variant="h4" component="h2" align="center">
        {new Date(date).toLocaleDateString('he', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        })}
      </Typography>
      <DishList dishes={dishesForDate} />
    </StyledDishesSection>
  ))
}

export default FutureDishes
