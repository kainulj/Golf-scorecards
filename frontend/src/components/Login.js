import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { login } from '../reducers/loginReducer'
import { useDispatch } from 'react-redux'
import UserForm from './UserForm'
import { setErrorMessage, setNotification } from '../reducers/alertReducer'
import { ErrorMessage } from './Alerts'

const Login = (props) => {

  const history = useHistory()
  const dispatch = useDispatch()

  const [creatingUser, setCreatingUser] = useState(false)

  /* Sends the login information to the server after hte login-button is pressed.
    If the login is successful returns to the main page and shows a welcome message.
    If the login fails password field is cleared, and an error message is shown.
  */
  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login({
      username: event.target.username.value,
      password: event.target.password.value
    })).then(() => {
      props.setUser(true)
      dispatch(setNotification(`Hello ${event.target.username.value}`))
      event.target.username.value = ''
      history.push('/')
    }).catch(() => {
      dispatch(setErrorMessage('Wrong username or password'))
    })
    event.target.password.value = ''
  }

  // Display the userForm after create user -button is pressed
  if(creatingUser) {
    return <UserForm
      setCreating={setCreatingUser}
      setUser={props.setUser}
    />
  }

  return (
    <div>
      <h2>Login</h2>
      <ErrorMessage />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username"/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password"/>
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
      <p></p>
      <Button variant="secondary" onClick={() => setCreatingUser(true)}>Create an account</Button>
    </div>
  )
}

export default withRouter(Login)

Login.propTypes = {
  setUser: PropTypes.func
}