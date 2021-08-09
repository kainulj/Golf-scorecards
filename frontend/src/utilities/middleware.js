import jwt from 'jsonwebtoken'

// eslint-disable-next-line no-unused-vars
export const tokenExpiration = store => next => action => {
  const token = window.localStorage.getItem('user') !== null ?
    JSON.parse(window.localStorage.getItem('user'))['token'] : null
  if(token && jwt.decode(token).exp < Date.now() / 1000){
    next(action)
    window.localStorage.clear()
  }
  next(action)
}