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

const ERR_TIME_IS_UP = 'time_is_up'
const ERR_MAX_ORDERS = 'max_orders'

const DishesContext = createContext()

export const DishesProvider = ({ children }) => {
  const [dishes, setDishes] = useState([])
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [hasTimeLeft, setHasTimeLeft] = useState(false)
  const [timeIsUpError, setTimeIsUpError] = useState(false)
  const [cancelOrderSuccess, setCancelOrderSuccess] = useState(false)
  const [maxOrdersError, setMaxOrdersError] = useState(false)

  const { checkIsAuthenticated, setShowAuthDialog } = useAuth()
  const { allow_orders_until } = usePreferences()

  const hideAllSnackbars = () => {
    setOrderSuccess(false)
    setTimeIsUpError(false)
    setCancelOrderSuccess(false)
    setMaxOrdersError(false)
  }

  const fetchDishes = useCallback(async () => {
    const res = await GET(endpoints.DISHES)
    const _dishes = await res.json()
    setDishes(_dishes)
  }, [])

  const orderDishOrAuthenticate = async dishId => {
    if (checkIsAuthenticated()) {
      hideAllSnackbars()

      const res = await POST(endpoints.ORDER_DISH(dishId))

      if (!res.ok) {
        const data = await res.json()

        if (data.code === ERR_TIME_IS_UP) setTimeIsUpError(true)
        else if (data.code === ERR_MAX_ORDERS) setMaxOrdersError(true)

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
    hideAllSnackbars()

    const res = await DELETE(endpoints.ORDER_DISH(dishId))

    if (!res.ok) {
      const data = await res.json()

      if (data.code === ERR_TIME_IS_UP) setTimeIsUpError(true)

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
    maxOrdersError,
    hideMaxOrdersError: () => setMaxOrdersError(false),
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
