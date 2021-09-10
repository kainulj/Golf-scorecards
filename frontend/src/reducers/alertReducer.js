const initialState = {
  notification: null,
  alert: null
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.data.notification }
    case 'SET_ERRORMESSAGE':
      return {
        ...state,
        errorMessage: action.data.errorMessage }
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null }
    case 'CLEAR_ERRORMESSAGE':
      return {
        ...state,
        errorMessage: null }
    default:
      return state
  }
}

let timeOutNotification
let timeOutErrorMessage

export const setNotification = (notification) => {
  return dispatch => {
    // Clears the previous timeout to ensure that notification won't be cleared too early
    clearTimeout(timeOutNotification)
    dispatch ({
      type: 'SET_NOTIFICATION',
      data: { notification }
    })
    timeOutNotification = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, 3000)
  }
}

export const setErrorMessage = (errorMessage) => {
  return dispatch => {
    // Clears the previous timeout to ensure that error message won't be cleared too early
    clearTimeout(timeOutErrorMessage)
    dispatch ({
      type: 'SET_ERRORMESSAGE',
      data: { errorMessage }
    })
    timeOutErrorMessage = setTimeout(() => {
      dispatch({
        type: 'CLEAR_ERRORMESSAGE'
      })
    }, 3000)
  }
}

export default reducer