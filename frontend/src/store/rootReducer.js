import { combineReducers } from 'redux'

import authReducer from 'features/auth/authSlice'
import preferencesReducer from 'features/preferences/preferencesSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
})

export default rootReducer
