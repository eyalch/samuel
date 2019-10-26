import React, { createContext, useContext } from 'react'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const value = {
    fetchDishes,
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)

const fetchDishes = async () => {
  const res = await fetch('/api/dishes')
  const dishes = await res.json()
  return dishes
}
