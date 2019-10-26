import React from 'react'
import styled from 'styled-components'
import Dish from './Dish'

const StyledDishes = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, max-content));
  grid-gap: ${p => p.theme.spacing(4)}px;
  justify-content: center;
  padding-bottom: ${p => p.theme.spacing(4)}px;
`

const DishList = ({ dishes }) => (
  <StyledDishes>
    {dishes.map(dish => (
      <Dish key={dish.id} dish={dish} />
    ))}
  </StyledDishes>
)

export default DishList
