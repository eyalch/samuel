import React from 'react'
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

const TodayDishes = () => {
  const todayDishes = useSelector(todayDishesSelector)

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
