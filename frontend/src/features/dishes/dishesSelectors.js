import { createSelector } from "@reduxjs/toolkit"
import { getLocalDateISOString } from "./dishesHelpers"

export const todayDishesSelector = createSelector(
  (state) => state.dishes.dishes,
  (state) => state.dishes.hasTimeLeft,
  (dishes) => {
    const todayDate = getLocalDateISOString()
    return dishes.filter((dish) => dish.date === todayDate)
  }
)
