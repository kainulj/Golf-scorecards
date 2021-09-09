import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'

import courseReducer from './reducers/courseReducer'
import scorecardReducer from './reducers/scorecardReducer'
import loginReducer from './reducers/loginReducer'
import alertReducer from './reducers/alertReducer'
import { tokenExpiration } from './utilities/middleware'
import { loadState, saveState } from './utilities/localStorage'

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducers = combineReducers({
  courses: courseReducer,
  scorecards: scorecardReducer,
  login: loginReducer,
  alerts: alertReducer
})

const persistedState = loadState()

const store = createStore(
  reducers,
  persistedState,
  composeEnhancer(
    applyMiddleware(thunk, tokenExpiration)
  )
)

// Update store every second
store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000))

export default store