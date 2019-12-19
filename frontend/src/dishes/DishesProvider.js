import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { setShowAuthDialog } from 'features/auth/authSlice'

const ERR_TIME_IS_UP = 'time_is_up'
const ERR_MAX_ORDERS = 'max_orders'

export const messages = {
  ORDER_SUCCESS: 'ORDER_SUCCESS',
  CANCEL_ORDER_SUCCESS: 'CANCEL_ORDER_SUCCESS',
  TIME_IS_UP: 'TIME_IS_UP',
  MAX_ORDERS: 'MAX_ORDERS',
}

const DishesContext = createContext()

export function DishesProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [dishes, setDishes] = useState([])
  const [hasTimeLeft, setHasTimeLeft] = useState(false)
  const [showConfirmOrderDialog, setShowConfirmOrderDialog] = useState(false)
  const [pendingDish, setPendingDish] = useState(null)
  const [message, setMessage] = useState(null)

  const oldDishes = useRef(null)

  const { authenticated, initialAuthentication } = useSelector(
    state => state.auth
  )

  const { allow_orders_until, max_orders_per_day } = useSelector(
    state => state.preferences
  )

  const dispatch = useDispatch()

  const resetMessage = useCallback(() => setMessage(null), [])

  function handleErrors(errorCode) {
    if (errorCode === ERR_TIME_IS_UP) setMessage(messages.TIME_IS_UP)
    else if (errorCode === ERR_MAX_ORDERS) setMessage(messages.MAX_ORDERS)
  }

  const fetchDishes = useCallback(async () => {
    if (initialAuthentication) return

    setLoading(true)

    const { data } = await axios.get('dishes')
    setDishes(currentDishes => {
      // Store the current dishes
      oldDishes.current = currentDishes

      return data
    })

    setLoading(false)
  }, [initialAuthentication])

  function updateDish(updatedDish) {
    setDishes(prevDishes => {
      const dishIndex = prevDishes.findIndex(dish => dish.id === updatedDish.id)
      return [
        ...prevDishes.slice(0, dishIndex),
        updatedDish,
        ...prevDishes.slice(dishIndex + 1),
      ]
    })
  }

  // Find how many orders the user has made for a given date
  const getOrdersCountForDate = useCallback(
    date =>
      dishes
        .filter(dish => dish.date === date)
        .reduce((count, dish) => count + dish.orders_count, 0),
    [dishes]
  )

  const orderDish = useCallback(
    async dish => {
      if (!authenticated) {
        setPendingDish(dish)
        dispatch(setShowAuthDialog(true))
        return
      }

      resetMessage()

      const ordersCountForDate = getOrdersCountForDate(dish.date)

      if (ordersCountForDate === max_orders_per_day) {
        setMessage(messages.MAX_ORDERS)
        return
      }

      // Show a confirm dialog if the user has already made an order
      if (ordersCountForDate > 0 && !showConfirmOrderDialog) {
        setPendingDish(dish)
        setShowConfirmOrderDialog(true)
        return
      } else if (showConfirmOrderDialog) {
        setShowConfirmOrderDialog(false)
      }

      try {
        const { data } = await axios.post(`dishes/${dish.id}/order`)

        setMessage(messages.ORDER_SUCCESS)
        updateDish(data)
      } catch ({ response }) {
        handleErrors(response.data.code)
      }
    },
    [
      authenticated,
      resetMessage,
      getOrdersCountForDate,
      max_orders_per_day,
      showConfirmOrderDialog,
      dispatch,
    ]
  )

  const orderPendingDish = useCallback(() => {
    if (!pendingDish) return

    orderDish(pendingDish)
    setPendingDish(null)
  }, [orderDish, pendingDish])

  const cancelOrder = useCallback(
    async dish => {
      resetMessage()

      try {
        const { data } = await axios.delete(`dishes/${dish.id}/order`)

        setMessage(messages.CANCEL_ORDER_SUCCESS)
        updateDish(data)
      } catch ({ response }) {
        handleErrors(response.data.code)
      }
    },
    [resetMessage]
  )

  const allowOrdersUntil = useMemo(() => {
    if (!allow_orders_until) return

    const endTime = new Date()
    endTime.setHours(...allow_orders_until.split(':'))
    return endTime
  }, [allow_orders_until])

  const hideConfirmOrderDialog = useCallback(() => {
    setPendingDish(null)
    setShowConfirmOrderDialog(false)
  }, [])

  // Fetch dishes for the first time and when the user authenticates
  useEffect(() => {
    fetchDishes()
  }, [fetchDishes, authenticated])

  // Order the pending dish after the user is authenticated
  useEffect(() => {
    if (
      authenticated &&
      dishes !== oldDishes &&
      pendingDish &&
      !showConfirmOrderDialog
    ) {
      orderPendingDish()
    }
  }, [
    dishes,
    authenticated,
    orderPendingDish,
    pendingDish,
    showConfirmOrderDialog,
  ])

  // Refresh the dishes every 30 minutes
  useEffect(() => {
    const interval = setInterval(fetchDishes, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [fetchDishes])

  const value = {
    loading,
    dishes,
    orderDish,
    allowOrdersUntil,
    hasTimeLeft,
    setHasTimeLeft,
    cancelOrder,
    showConfirmOrderDialog,
    hideConfirmOrderDialog,
    message,
    resetMessage,
    pendingDish,
    orderPendingDish,
  }

  return (
    <DishesContext.Provider value={value}>{children}</DishesContext.Provider>
  )
}

export const useDishes = () => useContext(DishesContext)
