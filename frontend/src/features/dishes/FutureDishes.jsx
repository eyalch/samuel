import { Typography } from "@material-ui/core"
import { createSelector } from "@reduxjs/toolkit"
import React from "react"
import { useSelector } from "react-redux"
import { getPrettyWeekday } from "./dishesHelpers"
import DishList from "./DishList"
import { StyledDishesSection } from "./TodayDishes"

const perDateReducer = (result, dish) => ({
  ...result,
  [dish.date]: [...(result[dish.date] || []), dish],
})

export const futureDishesPerDateSelector = createSelector(
  (state) => state.dishes.dishes,
  (state) => state.dishes.hasTimeLeft,
  (dishes) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const futureDishes = dishes.filter(
      (dish) => new Date(dish.date) >= tomorrow
    )
    return Object.entries(futureDishes.reduce(perDateReducer, {}))
  }
)

const FutureDishes = () => {
  const futureDishesPerDate = useSelector(futureDishesPerDateSelector)

  return futureDishesPerDate.map(([dateStr, dishesForDate]) => (
    <StyledDishesSection key={dateStr}>
      <Typography variant="h4" component="h2" align="center">
        מנות ל{getPrettyWeekday(new Date(dateStr))}
      </Typography>
      <DishList dishes={dishesForDate} />
    </StyledDishesSection>
  ))
}

export default FutureDishes
