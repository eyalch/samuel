import axios from 'axios'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useAuth } from '../auth/AuthProvider'
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

  const { isAuthenticated, setShowAuthDialog } = useAuth()
  const { allow_orders_until, max_orders_per_day } = usePreferences()

  const hideAllSnackbars = () => {
    setOrderSuccess(false)
    setTimeIsUpError(false)
    setCancelOrderSuccess(false)
    setMaxOrdersError(false)
  }

  const handleErrors = errorCode => {
    if (errorCode === ERR_TIME_IS_UP) setTimeIsUpError(true)
    else if (errorCode === ERR_MAX_ORDERS) setMaxOrdersError(true)
  }

  const fetchDishes = useCallback(async () => {
    const { data } = await axios.get('dishes')
    setDishes(data)
  }, [])

  const updateDish = updatedDish =>
    setDishes(prevDishes => {
      const dishIndex = prevDishes.findIndex(dish => dish.id === updatedDish.id)
      return [
        ...prevDishes.slice(0, dishIndex),
        updatedDish,
        ...prevDishes.slice(dishIndex + 1),
      ]
    })

  // Find how many orders the user has made for a given date
  const getOrdersCountForDate = useCallback(
    date =>
      dishes
        .filter(dish => dish.date === date)
        .reduce((count, dish) => count + dish.orders_count, 0),
    [dishes]
  )

  const orderDishOrAuthenticate = async dish => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    if (getOrdersCountForDate(dish.date) === max_orders_per_day) {
      setMaxOrdersError(true)
      return
    }

    hideAllSnackbars()

    try {
      const { data } = await axios.post(`dishes/${dish.id}/order`)

      setOrderSuccess(true)
      updateDish(data)
    } catch ({ response }) {
      handleErrors(response.data.code)
    }
  }

  const cancelOrder = async dish => {
    hideAllSnackbars()

    try {
      const { data } = await axios.delete(`dishes/${dish.id}/order`)

      setCancelOrderSuccess(true)
      updateDish(data)
    } catch ({ response }) {
      handleErrors(response.data.code)
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
    cancelOrder,
    cancelOrderSuccess,
    hideCancelOrderSuccess: () => setCancelOrderSuccess(false),
    maxOrdersError,
    hideMaxOrdersError: () => setMaxOrdersError(false),
    didOrderForDate: date => getOrdersCountForDate(date) > 0,
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
