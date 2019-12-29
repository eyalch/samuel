import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

import DishList from './DishList'
import OrderTimer from './OrderTimer'
import { getLocalDateISOString } from './dishesHelpers'

export const StyledDishesSection = styled.section`
  padding-bottom: ${p => p.theme.spacing(5)}px;

  ${p => p.theme.breakpoints.up('sm')} {
    padding-bottom: ${p => p.theme.spacing(6)}px;
  }
`

const selectTodayDishes = createSelector(
  state => state.dishes.dishes,
  state => state.dishes.hasTimeLeft,
  dishes => {
    const todayDate = getLocalDateISOString()
    return dishes.filter(dish => dish.date === todayDate)
  }
)

const TodayDishes = () => {
  const todayDishes = useSelector(selectTodayDishes)

  return (
    <StyledDishesSection>
      {todayDishes.length ? (
        <>
          <OrderTimer />
          <DishList dishes={todayDishes} />
        </>
      ) : (
        <Typography variant="h4" component="p" align="center">
          אין מנות להיום
        </Typography>
      )}
    </StyledDishesSection>
  )
}

export default TodayDishes
