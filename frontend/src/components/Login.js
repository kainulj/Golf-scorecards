import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { useHistory, withRouter } from 'react-router-dom'

import { login } from '../reducers/loginReducer'
import { connect } from 'react-redux'

const Login = (props) => {

  const history = useHistory()

  const login = async (event) => {
    event.preventDefault()
    try {
      await props.login({
        username: event.target.username.value,
        password: event.target.password.value
      })
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
      <Form onSubmit={login}>
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

const mapDispatchToProps = {
  login
}

export default connect(null, mapDispatchToProps)(withRouter(Login))

Login.propTypes = {
  login: PropTypes.func
}