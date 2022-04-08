import { combineReducers } from '@reduxjs/toolkit'
import features from 'redux/reducers/features'
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
  features,
})

export default rootReducer
