import { getLocalDateISOString } from 'features/dishes/dishesHelpers'

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const todayISO = getLocalDateISOString(today)
const tomorrowISO = getLocalDateISOString(tomorrow)

export const dish = {
  id: 1,
  name: 'Dish Name',
  description: 'Dish description',
  date: todayISO,
  orders_count: 0,
  has_dishes_left: true,
  image:
    'https://cdn.pixabay.com/photo/2016/12/26/17/28/food-1932466_960_720.jpg',
}

export const dishForTomorrow = { ...dish, date: tomorrowISO }

export const dishesResponse = {
  data: [dish, dishForTomorrow],
}
