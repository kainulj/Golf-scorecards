import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
Moment.locale('fi')
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ScorecardList = (props) => {

  return (
    <Table bordered striped responsive="sm">
      <thead>
        <tr>
          <th>Date</th>
          <th>Course</th>
          <th>Strokes +/-</th>
          <th>Adjusted score</th>
          <th>Score differential</th>
        </tr>
      </thead>
      <tbody>
        {props.scorecards
          .map(sc => (
            <tr key={sc.id}>
              <td><Link to={`/tuloskortit/${sc.id}`}>{new Intl.DateTimeFormat('fi-FI').format(new Date(sc.date))}</Link></td>
              <td>{sc.course.name}</td>
              <td>{sc.score}</td>
              <td>{sc.adjscore}</td>
              <td>{Number(Math.round(parseFloat(sc.scorediff + 'e' + 2)) + 'e-' + 2).toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}


export default ScorecardList

ScorecardList.propTypes = {
  scorecards: PropTypes.array
}