import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'

import courseReducer from './reducers/courseReducer'
import scorecardReducer from './reducers/scorecardReducer'
import loginReducer from './reducers/loginReducer'
import { tokenExpiration } from './utilities/middleware'
import { loadState, saveState } from './utilities/localStorage'

const reducers = combineReducers({
  courses: courseReducer,
  scorecards: scorecardReducer,
  login: loginReducer
})

const persistedState = loadState()

const store = createStore(
  reducers,
  persistedState,
  applyMiddleware(thunk, tokenExpiration)
)

store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000))

export default store