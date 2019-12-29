import axios from 'axios'

export async function getDishes() {
  const { data } = await axios.get('dishes')
  return data
}

export async function orderDish(dishId) {
  const { data } = await axios.post(`dishes/${dishId}/order`)
  return data
}

export async function cancelOrder(dishId) {
  const { data } = await axios.delete(`dishes/${dishId}/order`)
  return data
}
