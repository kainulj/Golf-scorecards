import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { login } from '../reducers/loginReducer'
import { useDispatch } from 'react-redux'
import UserForm from './UserForm'

const Login = (props) => {

  const history = useHistory()
  const dispatch = useDispatch()

  const [creatingUser, setCreatingUser] = useState(false)

  const handleLogin = (event) => {
    event.preventDefault()
    try {
      dispatch(login({
        username: event.target.username.value,
        password: event.target.password.value
      }))
      window.localStorage.removeItem('scorecards')
      props.setUser(true)
      history.push('/')
    } catch (exception)  {
      console.error(exception)
    }
    event.target.username.value = ''
    event.target.password.value = ''
  }

  if(creatingUser) {
    return <UserForm
      setCreating={setCreatingUser}
      setUser={props.setUser}
    />
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
      <p></p>
      <Button variant="secondary" onClick={() => setCreatingUser(true)}>Create an account</Button>
    </div>
  )
}

export default withRouter(Login)

Login.propTypes = {
  setUser: PropTypes.func
}