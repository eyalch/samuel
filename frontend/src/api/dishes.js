import axios from "axios"

export const getDishes = () => axios.get("/api/dishes")

export const orderDish = (dishId) => axios.post(`/api/dishes/${dishId}/order`)

export const cancelOrder = (dishId) =>
  axios.delete(`/api/dishes/${dishId}/order`)
