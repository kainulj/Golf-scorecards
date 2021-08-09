import loginService from '../services/login'
import scorecardService from '../services/scorecards'

const reducer = (state = null, action) => {
  switch(action.type) {
    case 'LOG_IN':
      return action.data
    case 'LOG_OUT':
      return null
    default:
      return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    scorecardService.setToken(user.token)
    dispatch({
      type: 'LOG_IN',
      data: user
    })
  }
}

export const logout = (history) => {
  return dispatch => {
    dispatch({
      type: 'LOG_OUT'
    })
    window.localStorage.clear()
    history.push('/kirjaudu')
  }
}

export default reducer