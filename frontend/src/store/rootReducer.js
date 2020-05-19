import authReducer from "features/auth/authSlice"
import dishesReducer from "features/dishes/dishesSlice"
import networkReducer from "features/network/networkSlice"
import preferencesReducer from "features/preferences/preferencesSlice"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
  dishes: dishesReducer,
  network: networkReducer,
})

export default rootReducer
