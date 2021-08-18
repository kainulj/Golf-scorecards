import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { login } from '../reducers/loginReducer'
import { useDispatch } from 'react-redux'

const Login = (props) => {

  const history = useHistory()
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(login({
        username: event.target.username.value,
        password: event.target.password.value
      }))
      props.setUser(true)
      history.push('/')
    } catch (exception)  {
      console.error(exception)
    }
    event.target.username.value = ''
    event.target.password.value = ''
  }

  return (
    <div>
      <h2>Login</h2>
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
    </div>
  )
}

export default withRouter(Login)

Login.propTypes = {
  setUser: PropTypes.func
}