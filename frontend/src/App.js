import React, { useEffect } from 'react'
import {
  Switch, Route, Link
} from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { initScorecards } from './reducers/scorecardReducer'
import { initCourses } from './reducers/courseReducer'

import CourseList from './components/CourseList'
import Course from './components/Course'
import Scorecards from './components/Scorecards'
import Login from './components/Login'

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
    <div>
      <div className="container">
        <Link style={linkStyle} to="/">Scorecards</Link>
        <Link style={linkStyle} to="/courses">Courses</Link>
        <Link style={linkStyle} to="/new-scorecards">New Scorecard</Link>
      </div>
      <Switch>
        <Route path="/kentat/:id">
          <Course />
        </Route>
        <Route path='/new-scorecard'>
          New Scorecard
        </Route>
        <Route path='/courses'>
          <CourseList />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/'>
          <Scorecards />
        </Route>
      </Switch>
    </div>
  )
}

export default App
