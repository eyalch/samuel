import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthProvider'
import { GET } from './httpHelpers'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const { isAuthenticated, setShowAuthDialog } = useAuth()

  const orderDish = async dishId => {
    if (isAuthenticated()) {
      console.log(`Ordering dish #${dishId}`)
    } else {
      setShowAuthDialog(true)
    }
  }

  const value = {
    fetchDishes,
    orderDish,
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)

const fetchDishes = () => GET('/api/dishes/')
