import React from 'react'
import styled from 'styled-components'

import Dish from './Dish'

const StyledDishes = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: ${p => p.theme.spacing(2)}px;
  margin-top: ${p => p.theme.spacing(3)}px;

  ${p => p.theme.breakpoints.up('sm')} {
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 360px);
    grid-gap: ${p => p.theme.spacing(4)}px;
  }
`

const DishList = ({ dishes }) => (
  <StyledDishes>
    {dishes.map(dish => (
      <Dish key={dish.id} dish={dish} />
    ))}
  </StyledDishes>
)

export default DishList
