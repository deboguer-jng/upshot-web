import { combineReducers } from '@reduxjs/toolkit'
import user from 'redux/reducers/user'
import web3 from 'redux/reducers/web3'

/**
 * All redux reducers for the application.
 */
const rootReducer = combineReducers({
  user,
  web3,
})

export default rootReducer
