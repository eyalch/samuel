import React, { createContext, useCallback, useContext, useState } from 'react'
import { useAuth } from './AuthProvider'
import { GET, POST } from './httpHelpers'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const [dishes, setDishes] = useState([])

  const { isAuthenticated, setShowAuthDialog } = useAuth()

  const fetchDishes = useCallback(async () => {
    const res = await GET('/api/dishes/')
    const _dishes = await res.json()
    setDishes(_dishes)
  }, [])

  const orderDishOrAuthenticate = async dishId => {
    if (isAuthenticated()) {
      await POST(`/api/dishes/${dishId}/order/`)
      setDishes(prevDishes =>
        prevDishes.map(dish => ({
          ...dish,
          did_user_order_today: dish.id === dishId,
        }))
      )
    } else {
      setShowAuthDialog(true)
    }
  }

  const value = {
    dishes,
    fetchDishes,
    orderDish: orderDishOrAuthenticate,
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
