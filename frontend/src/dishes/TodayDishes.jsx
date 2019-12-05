import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
import DishList from './DishList'
import TimeLeft from './TimeLeft'

export const StyledDishesSection = styled.section`
  padding-bottom: ${p => p.theme.spacing(5)}px;

  ${p => p.theme.breakpoints.up('sm')} {
    padding-bottom: ${p => p.theme.spacing(6)}px;
  }
`

const TodayDishes = ({ dishes }) => (
  <StyledDishesSection>
    {dishes.length ? (
      <>
        <TimeLeft />
        <DishList dishes={dishes} />
      </>
    ) : (
      <Typography variant="h4" component="p" align="center">
        אין מנות להיום
      </Typography>
    )}
  </StyledDishesSection>
)

export default TodayDishes
