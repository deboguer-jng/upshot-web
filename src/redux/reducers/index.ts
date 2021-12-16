import { combineReducers } from '@reduxjs/toolkit'
import layout from 'redux/reducers/layout'
import user from 'redux/reducers/user'
import web3 from 'redux/reducers/web3'

/**
 * All redux reducers for the application.
 */
const rootReducer = combineReducers({
  user,
  web3,
  layout,
})

export default rootReducer
