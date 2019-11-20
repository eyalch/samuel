import React from 'react'
import styled from 'styled-components'
import Dish from './Dish'

const StyledDishes = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  justify-content: center;
  grid-gap: ${p => p.theme.spacing(2)}px;
  padding-bottom: ${p => p.theme.spacing(2)}px;

  ${p => p.theme.breakpoints.up('sm')} {
    grid-template-columns: repeat(auto-fill, 360px);
    grid-gap: ${p => p.theme.spacing(4)}px;
    padding-bottom: ${p => p.theme.spacing(4)}px;
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
