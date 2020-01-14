import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

import DishList from './DishList'
import OrderTimer from './OrderTimer'
import { todayDishesSelector } from './dishesSelectors'

export const StyledDishesSection = styled.section`
  padding-bottom: ${p => p.theme.spacing(5)}px;

  ${p => p.theme.breakpoints.up('sm')} {
    padding-bottom: ${p => p.theme.spacing(6)}px;
  }
`

const showTodayDishesSelector = createSelector(
  state => state.preferences.show_today_dishes_until,
  show_today_dishes_until => {
    const showDishesUntil = new Date()
    showDishesUntil.setHours(...show_today_dishes_until.split(':'))

    return new Date() < showDishesUntil
  }
)

const TodayDishes = () => {
  const todayDishes = useSelector(todayDishesSelector)
  const showTodayDishes = useSelector(showTodayDishesSelector)

  if (!showTodayDishes) return null

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
