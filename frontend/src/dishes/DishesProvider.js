import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useAuth } from '../auth/AuthProvider'
import endpoints from '../api/endpoints'
import { GET, POST, DELETE } from '../api/httpHelpers'
import { usePreferences } from '../PreferencesProvider'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const [dishes, setDishes] = useState([])
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [hasTimeLeft, setHasTimeLeft] = useState(false)
  const [timeIsUpError, setTimeIsUpError] = useState(false)
  const [cancelOrderSuccess, setCancelOrderSuccess] = useState(false)

  const { checkIsAuthenticated, setShowAuthDialog } = useAuth()
  const { allow_orders_until } = usePreferences()

  const fetchDishes = useCallback(async () => {
    const res = await GET(endpoints.DISHES)
    const _dishes = await res.json()
    setDishes(_dishes)
  }, [])

  const orderDishOrAuthenticate = async dishId => {
    if (checkIsAuthenticated()) {
      const res = await POST(endpoints.ORDER_DISH(dishId))

      if (!res.ok) {
        const data = await res.json()

        if (data.code === 'time_is_up') setTimeIsUpError(true)

        return
      }

      setOrderSuccess(true)

      setDishes(prevDishes => {
        const updatedDishIndex = prevDishes.findIndex(
          dish => dish.id === dishId
        )
        const updatedDish = {
          ...prevDishes[updatedDishIndex],
          did_user_order_today: true,
        }
        return [
          ...prevDishes.slice(0, updatedDishIndex),
          updatedDish,
          ...prevDishes.slice(updatedDishIndex + 1),
        ]
      })
    } else {
      setShowAuthDialog(true)
    }
  }

  const cancelOrder = async dishId => {
    const res = await DELETE(endpoints.ORDER_DISH(dishId))

    if (!res.ok) {
      const data = await res.json()

      if (data.code === 'time_is_up') setTimeIsUpError(true)

      return
    }

    setCancelOrderSuccess(true)

    setDishes(prevDishes => {
      const updatedDishIndex = prevDishes.findIndex(dish => dish.id === dishId)
      const updatedDish = {
        ...prevDishes[updatedDishIndex],
        did_user_order_today: false,
      }
      return [
        ...prevDishes.slice(0, updatedDishIndex),
        updatedDish,
        ...prevDishes.slice(updatedDishIndex + 1),
      ]
    })
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
    cancelOrder,
    cancelOrderSuccess,
    hideCancelOrderSuccess: () => setCancelOrderSuccess(false),
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
