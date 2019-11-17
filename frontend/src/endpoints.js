const ep = path => `/api/${path}/`

export default {
  // Auth
  TOKEN: ep('token'),
  REFRESH_TOKEN: ep('token/refresh'),

  // Dishes
  DISHES: ep('dishes'),
  ORDER_DISH: dishId => ep(`dishes/${dishId}/order`),
}
