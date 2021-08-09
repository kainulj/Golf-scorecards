import jwt from 'jsonwebtoken'


export const isTokenExpired = () => {
  const token = window.localStorage.getItem('state') !== null ?
    JSON.parse(window.localStorage.getItem('state')).login['token'] : null

  if(!token || jwt.decode(token).exp < Date.now() / 1000){
    return true
  }
  return false
}
