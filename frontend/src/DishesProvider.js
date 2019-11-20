import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthProvider'
import endpoints from './endpoints'
import { GET, POST } from './httpHelpers'
import { usePreferences } from './PreferencesProvider'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const [dishes, setDishes] = useState([])
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [hasTimeLeft, setHasTimeLeft] = useState(false)
  const [timeIsUpError, setTimeIsUpError] = useState(false)

  const { isAuthenticated, setShowAuthDialog } = useAuth()
  const { allow_orders_until } = usePreferences()

  const fetchDishes = useCallback(async () => {
    const res = await GET(endpoints.DISHES)
    const _dishes = await res.json()
    setDishes(_dishes)
  }, [])

  const orderDishOrAuthenticate = async dishId => {
    if (isAuthenticated()) {
      const res = await POST(endpoints.ORDER_DISH(dishId))

      if (!res.ok) {
        const data = await res.json()

        if (data.code === 'orders_time_is_up') setTimeIsUpError(true)

        return
      }

      setOrderSuccess(true)
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

  const allowOrdersUntil = useMemo(() => {
    if (!allow_orders_until) return

    const endTime = new Date()
    endTime.setHours(...allow_orders_until.split(':'))
    return endTime
  }, [allow_orders_until])

  const value = {
    dishes,
    fetchDishes,
    orderDish: orderDishOrAuthenticate,
    orderSuccess,
    hideOrderSuccess: () => setOrderSuccess(false),
    allowOrdersUntil,
    hasTimeLeft,
    setHasTimeLeft,
    timeIsUpError,
    hideTimeIsUpError: () => setTimeIsUpError(false),
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
