import './App.css'
import React, { useEffect } from 'react'
import {
  Switch, Route, Link
} from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { initScorecards } from './reducers/scorecardReducer'
import { initCourses } from './reducers/courseReducer'

const linkStyle = {
  padding: 10
}

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initCourses())
  }, [dispatch])

  useEffect(() => {
    dispatch(initScorecards())
  }, [dispatch])

  return (
    <div className="App">
      <div className="container">
        <Link style={linkStyle} to="/">Scorecards</Link>
        <Link style={linkStyle} to="/courses">Courses</Link>
        <Link style={linkStyle} to="/new-scorecards">New Scorecard</Link>
      </div>
      <Switch>
        <Route path='/new-scorecard'>
          New Scorecard
        </Route>
        <Route path='/courses'>
          Courses
        </Route>
        <Route path='/login'>
          Login
        </Route>
        <Route path='/'>
          Scorecards
        </Route>
      </Switch>
    </div>
  )
}

export default App
