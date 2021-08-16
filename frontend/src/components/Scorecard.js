import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ResponsiveContainer, LineChart, YAxis, XAxis, Line, Tooltip, ReferenceLine } from 'recharts'
import { Table, Button } from 'react-bootstrap'

import { removeScorecard } from '../reducers/scorecardReducer'
import ScorecardForm from './ScorecardForm'
import { playingHcp, countStrokes } from '../utilities/scorecard'

const Scorecard = (props) => {


  const history = useHistory()

  const [editing, setEditing] = useState(false)

  const match = useRouteMatch('/scorecards/:id')

  const [scorecard, setScorecard] = useState(match ? props.scorecards.find(sc => sc.id === match.params.id) : null)

  const calculateStrokes = () => {
    const course = scorecard.course
    const coursehcp = playingHcp(scorecard.hcp, course.slope, course.cr, course.pars)
    return scorecard.adjscores.map((adjs, i) => {
      return countStrokes(course.hcps[i], course.pars[i], coursehcp, scorecard.scores[i])
    }).map((sum => s => sum += s)(0))
      .map((s, i) => { return { hole: i+1, strokes: s }})
  }

  const [strokes, setStrokes] = useState(calculateStrokes())

  const remove = () => {
    if(window.confirm('Are you sure you want to remove the scorecard?')){
      props.removeScorecard(scorecard.id)
      history.push('/')
    }
  }

  useEffect(() => {
    setScorecard(props.scorecards.find(sc => sc.id === match.params.id))
  }, [props.scorecards])

  useEffect(() => {
    setStrokes(calculateStrokes())
  }, [scorecard.scores])

  const edit = () => {
    setEditing(!editing)
  }

  if(!scorecard) {
    return null
  }

  if(editing){
    return <ScorecardForm
      scores={scorecard.scores}
      course={scorecard.course}
      editing={true}
      setEditing={setEditing}
      date={scorecard.date}
      id={scorecard.id}
    />
  }

  return (
    <div>
      <h2>
        {new Intl.DateTimeFormat('fi-FI').format(new Date(scorecard.date))}
      </h2>
      <h2>{scorecard.course.name}</h2>
      <p>Strokes +/-: {scorecard.score}</p>
      <p>Adjusted score: {scorecard.adjscore}</p>
      <p>
        Scoredifferential: {
          Number(
            Math.round(parseFloat(scorecard.scorediff + 'e' + 2)) + 'e-' + 2
          ).toFixed(2)
        }
      </p>
      <Button onClick={edit}>Edit</Button>
      <Button onClick={remove}>Remove</Button>
      <Table bordered striped responsive="sm">
        <tbody>
          <tr>
            <td>Hoile</td>
            {Array.from({ length: scorecard.scores.length }).map((_, i) => (
              <td key={i}>{i+1}</td>
            ))}
          </tr>
          <tr>
            <td>Par</td>
            {scorecard.course.pars.map((par, i) => (
              <td key={i}>{par}</td>
            ))}
          </tr>
          <tr>
            <td>Score</td>
            {scorecard.scores.map((score, i) => (
              <td key={i}>{score}</td>
            ))}
          </tr>
          <tr>
            <td>Adjusted score</td>
            {scorecard.adjscores.map((adjscore, i) => (
              <td key={i}>{adjscore}</td>
            ))}
          </tr>
        </tbody>
      </Table>
      <ResponsiveContainer width="80%" height={400}>
        <LineChart data={strokes}>
          <XAxis dataKey="hole" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="strokes" stroke="#8884d8" fill="#8884d8" />
          <ReferenceLine y={0} stroke="black" strokeDasharray="5 5"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    scorecards: state.scorecards
  }
}

const mapDispatchToProps = {
  removeScorecard
}

export default connect(mapStateToProps, mapDispatchToProps)(Scorecard)

Scorecard.propTypes = {
  scorecards: PropTypes.array,
  removeScorecard: PropTypes.func
}