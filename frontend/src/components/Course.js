import React from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const Course = (props) => {

  const match = useRouteMatch('/kentat/:id')

  const course = match ? props.courses.find(c => c.id === match.params.id) : null

  if(!course){
    return null
  }

  const scorecards = match ? props.scorecards.filter(sc => sc.course.id === match.params.id) : []

  return (
    <div>
      <h2>{course.name}</h2>
      <p>CR: {course.cr}</p>
      <p>Slope: {course.slope}</p>
      <Table bordered striped>
        <tbody>
          <tr>
            <td>Hole</td>
            {Array.from({ length: course.pars.length }).map((_, i) => (
              <td key={i}>{i+1}</td>
            ))}
          </tr>
          <tr>
            <td>Par</td>
            {course.pars.map((par, i) => (
              <td key={i}>{par}</td>
            ))}
          </tr>
          <tr>
            <td>HCP</td>
            {course.hcps.map((hcp, i) => (
              <td key={i}>{hcp}</td>
            ))}
          </tr>
        </tbody>
      </Table>

      {/* Hide the table listing scorecards if there are no scorecards to show */}
      {scorecards.length !== 0 ?
        <div>
          <h3>Scorecards</h3>
          <Table bordered striped>
            <tbody>
              <tr>
                <th>Date</th>
                <th>Strokes +/-</th>
                <th>Adjusted score</th>
                <th>Score differential</th>
              </tr>
              {scorecards.map(sc => (
                <tr key={sc.id}>
                  <td><Link to={`/tuloskortit/${sc.id}`}>{new Intl.DateTimeFormat('fi-FI').format(new Date(sc.date))}</Link></td>
                  <td>{sc.score}</td>
                  <td>{sc.adjscore}</td>
                  <td>{Number(Math.round(parseFloat(sc.scorediff + 'e' + 2)) + 'e-' + 2).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        : <div></div>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    courses: state.courses,
    scorecards: state.scorecards
  }
}

export default connect(mapStateToProps)(Course)

Course.propTypes = {
  courses: PropTypes.array,
  scorecards: PropTypes.array
}