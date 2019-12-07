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

  const { checkIsAuthenticated, setShowAuthDialog } = useAuth()
  const { allow_orders_until } = usePreferences()

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

  const orderDishOrAuthenticate = async dishId => {
    // If the user isn't authenticated, open the authentication dialog
    if (!checkIsAuthenticated()) {
      setShowAuthDialog(true)
      return
    }

    hideAllSnackbars()

    try {
      const { data } = await axios.post(`dishes/${dishId}/order`)

      setOrderSuccess(true)
      updateDish(data)
    } catch ({ response }) {
      handleErrors(response.data.code)
    }
  }

  const cancelOrder = async dishId => {
    hideAllSnackbars()

    try {
      const { data } = await axios.delete(`dishes/${dishId}/order`)

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
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
