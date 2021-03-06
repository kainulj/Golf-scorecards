import React, { useEffect, useState } from 'react'
import {
  Switch, Route, Link, Redirect, useHistory
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'

import { initScorecards } from './reducers/scorecardReducer'
import { initCourses } from './reducers/courseReducer'
import { logout } from './reducers/loginReducer'

import scorecardService from './services/scorecards'

import CourseList from './components/CourseList'
import Course from './components/Course'
import Scorecards from './components/Scorecards'
import Login from './components/Login'
import ScorecardForm from './components/ScorecardForm'
import Scorecard from './components/Scorecard'
import { Notification } from './components/Alerts'
import { setNotification } from './reducers/alertReducer'

function App() {

  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(state => state.login)
  const [loggedIn, setLoggedIn] = useState(user)

  // Sets the authentication token if a user is logged in
  useEffect(() => {
    if(user) {
      scorecardService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    dispatch(initCourses())
  }, [dispatch])

  useEffect(() => {
    dispatch(initScorecards())
  }, [dispatch, user])

  const handleLogout = () => {
    dispatch(logout(history))
    dispatch(setNotification('Logged out'))
    setLoggedIn(false)
  }

  const linkStyle = {
    padding: 10
  }

  return (
    <div>
      <div className="container">
        <Link style={linkStyle} to="/">Scorecards</Link>
        <Link style={linkStyle} to="/courses">Courses</Link>
        <Link style={linkStyle} to="/new-scorecard">New Scorecard</Link>
        {loggedIn
          ? <Button onClick={handleLogout}>Log Out</Button>
          : <Link style={linkStyle} to="/login">Login</Link>
        }
      </div>
      <Notification />
      <Switch>
        <Route path="/scorecards/:id">
          <Scorecard />
        </Route>
        <Route path="/courses/:id">
          <Course />
        </Route>
        <Route path='/courses'>
          <CourseList />
        </Route>
        <Route path='/new-scorecard'>
          <ScorecardForm />
        </Route>
        <Route path='/login'>
          {!loggedIn
            ? <Login setUser={setLoggedIn}/>
            : <Redirect to='/' />
          }
        </Route>
        <Route path='/'>
          <Scorecards />
        </Route>
      </Switch>
    </div>
  )
}

export default App
