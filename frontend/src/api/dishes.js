import axios from "axios"

export const getDishes = async () => {
  const res = await axios.get("dishes")
  return res.data
}

export const orderDish = async (dishId) => {
  const res = await axios.post(`dishes/${dishId}/order`)
  return res.data
}

export const cancelOrder = async (dishId) => {
  const res = await axios.delete(`dishes/${dishId}/order`)
  return res.data
}
