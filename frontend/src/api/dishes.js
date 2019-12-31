import axios from 'axios'

export const getDishes = () => axios.get('dishes')

export const orderDish = dishId => axios.post(`dishes/${dishId}/order`)

export const cancelOrder = dishId => axios.delete(`dishes/${dishId}/order`)
