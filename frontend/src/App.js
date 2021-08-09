import './App.css'
import React from 'react'
import {
  Switch, Route, Link
} from 'react-router-dom'

const linkStyle = {
  padding: 10
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <Link style={linkStyle} to="/">Scorecards</Link>
        <Link style={linkStyle} to="/courses">Courses</Link>
        <Link style={linkStyle} to="/new-scorecards">New Scorecard</Link>
      </div>
      <Switch>
        <Route path='/new-scorecards'>
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
