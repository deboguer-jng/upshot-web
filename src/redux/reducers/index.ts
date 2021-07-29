import { combineReducers } from '@reduxjs/toolkit'
import user from 'redux/reducers/user'

/**
 * All redux reducers for the application.
 */
const rootReducer = combineReducers({
  user,
})

export default rootReducer
