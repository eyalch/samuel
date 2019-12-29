import { createSlice } from '@reduxjs/toolkit'

import * as api from 'api/dishes'
import { setShowAuthDialog } from 'features/auth/authSlice'

export const messages = {
  ORDER_SUCCESS: 'ORDER_SUCCESS',
  CANCEL_ORDER_SUCCESS: 'CANCEL_ORDER_SUCCESS',
  TIME_IS_UP: 'TIME_IS_UP',
  MAX_ORDERS: 'MAX_ORDERS',
}

const ERR_TIME_IS_UP = 'time_is_up'
const ERR_MAX_ORDERS = 'max_orders'

const initialState = {
  dishes: [],
  loading: true,
  pendingDish: null,
  confirmOrderDialog: false,
  message: null,
  hasTimeLeft: false,
}

// Find how many orders the user has made for a given date
const getOrdersCountForDate = (dishes, date) => {
  return dishes
    .filter(dish => dish.date === date)
    .reduce((count, dish) => count + dish.orders_count, 0)
}

const updateDish = (state, updatedDish) => {
  const dishIndex = state.dishes.findIndex(d => d.id === updatedDish.id)
  state.dishes[dishIndex] = updatedDish
}

const dishes = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    setMessage(state, { payload: message }) {
      state.message = message
    },
    resetMessage(state) {
      state.message = null
    },

    handleErrors(state, { payload: errorCode }) {
      state.message =
        {
          [ERR_TIME_IS_UP]: messages.TIME_IS_UP,
          [ERR_MAX_ORDERS]: messages.MAX_ORDERS,
        }[errorCode] || null
    },

    fetchDishesStart(state) {
      state.loading = true
    },
    fetchDishesEnd(state) {
      state.loading = false
    },
    fetchDishesSuccess(state, { payload: dishes }) {
      state.dishes = dishes
    },

    orderDishSuccess(state, { payload: updatedDish }) {
      updateDish(state, updatedDish)
      state.message = messages.ORDER_SUCCESS
    },

    setPendingDish(state, { payload: dish }) {
      state.pendingDish = dish
    },
    setConfirmPendingDish(state, { payload: dish }) {
      state.confirmOrderDialog = true
      state.pendingDish = dish
    },
    resetConfirmPendingDish(state) {
      state.pendingDish = null
      state.confirmOrderDialog = false
    },

    cancelOrderSuccess(state, { payload: updatedDish }) {
      updateDish(state, updatedDish)
      state.message = messages.CANCEL_ORDER_SUCCESS
    },

    setHasTimeLeft(state, { payload: hasTimeLeft }) {
      state.hasTimeLeft = hasTimeLeft
    },
  },
})

const {
  fetchDishesStart,
  fetchDishesEnd,
  fetchDishesSuccess,
  orderDishSuccess,
  setPendingDish,
  setConfirmPendingDish,
  setMessage,
  handleErrors,
  cancelOrderSuccess,
} = dishes.actions

export const {
  resetConfirmPendingDish,
  resetMessage,
  setHasTimeLeft,
} = dishes.actions

export default dishes.reducer

export const fetchDishes = () => async dispatch => {
  dispatch(fetchDishesStart())
  try {
    const res = await api.getDishes()
    dispatch(fetchDishesSuccess(res))
  } finally {
    dispatch(fetchDishesEnd())
  }
}

export const orderDish = dish => async (dispatch, getState) => {
  const {
    auth: { authenticated },
    dishes: { dishes, confirmOrderDialog },
    preferences: { max_orders_per_day },
  } = getState()

  if (!authenticated) {
    dispatch(setPendingDish(dish))
    dispatch(setShowAuthDialog(true))
    return
  }

  const ordersCountForDate = getOrdersCountForDate(dishes, dish.date)

  if (ordersCountForDate === max_orders_per_day) {
    dispatch(setMessage(messages.MAX_ORDERS))
    return
  }

  // Show a confirm dialog if the user has already made an order
  if (ordersCountForDate > 0 && !confirmOrderDialog) {
    dispatch(setConfirmPendingDish(dish))
    return
  } else if (confirmOrderDialog) {
    dispatch(resetConfirmPendingDish())
  }

  dispatch(resetMessage())

  try {
    const res = await api.orderDish(dish.id)
    dispatch(orderDishSuccess(res))
  } catch (res) {
    handleErrors(res.code)
  }
}

export const orderPendingDish = () => async (dispatch, getState) => {
  const { pendingDish } = getState().dishes

  if (!pendingDish) return

  dispatch(setPendingDish(null))

  dispatch(orderDish(pendingDish))
}

export const cancelOrder = dish => async dispatch => {
  dispatch(resetMessage())

  try {
    const res = await api.cancelOrder(dish.id)
    dispatch(cancelOrderSuccess(res))
  } catch (res) {
    handleErrors(res.code)
  }
}
