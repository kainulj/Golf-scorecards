import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.alerts.notification)

  if(!notification){
    return null
  }

  return (
    <div className="message">
      <p>{notification}</p>
    </div>
  )
}

const ErrorMessage = () => {
  const notification = useSelector(state => state.alerts.errorMessage)

  if(!notification){
    return null
  }

  return (
    <div className="error">
      <p>{notification}</p>
    </div>
  )
}

export {
  Notification,
  ErrorMessage
}