import React from 'react'
import { Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import userService from '../services/users'
import { login } from '../reducers/loginReducer'
import { setNotification } from '../reducers/alertReducer'

const UserForm = (props) => {

  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await userService.create({
        username: event.target.username.value,
        password: event.target.password.value
      })
      dispatch(login({
        username: event.target.username.value,
        password: event.target.password.value
      }))
      props.setUser(true)
      dispatch(setNotification(`Hello ${event.target.username.value}`))
      history.push('/')
    } catch(exception) {
      console.log(exception)
    }
    event.target.username.value = ''
    event.target.password.value = ''
  }

  return (
    <div>
      <h2>Create User</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username"/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password"/>
        </Form.Group>
        <Button variant="primary" type="submit">Create</Button>
        <Button variant="danger" className='ml-2' onClick={() => props.setCreating(false)}>Cancel</Button>
      </Form>
    </div>
  )
}

export default UserForm

UserForm.propTypes = {
  setCreating: PropTypes.func,
  setUser: PropTypes.func
}