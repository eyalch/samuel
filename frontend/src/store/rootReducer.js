import { combineReducers } from 'redux'

import authReducer from 'features/auth/authSlice'
import preferencesReducer from 'features/preferences/preferencesSlice'
import dishesReducer from 'features/dishes/dishesSlice'
import networkReducer from 'features/network/networkSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
  dishes: dishesReducer,
  network: networkReducer,
})

export default rootReducer
