import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownButton, Table, Button } from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import utils from '../utilities/scorecard'
import { createScorecard, editScorecard } from '../reducers/scorecardReducer'
import { setErrorMessage, setNotification } from '../reducers/alertReducer'
import { ErrorMessage } from './Alerts'

// Form to create a scorecard. Props are only used when the scorecard is edited
const ScorecardForm = (props) => {

  const history = useHistory()
  const dispatch = useDispatch()

  const courses = useSelector(state => state.courses)
  const scorecards = useSelector(state => state.scorecards)

  const [courseName, setCourseName] = useState('')
  const [hcp, setHcp] = useState(null)
  const [course, setCourse] = useState(null)
  const [strokes, setStrokes] = useState(Array(18).fill(''))
  const [adjscores, setAdjscores] = useState(Array(18).fill(''))
  const [scores, setScores] = useState(props.scores ? props.scores : Array(18).fill(''))
  const [date, setDate] = useState(props.date ? new Date(props.date) : new Date())
  const [playinghcp, setPlayinghcp] = useState(null)

  useEffect(() => {
    if(courses.length !== 0) {
      setCourseName(props.course ? props.course.name : courses[0].name)
    }
  }, [courses])

  useEffect(() => {
    setCourse(courses.find(c => c.name === courseName))
  }, [courseName])

  /*If there are previous scorecards, set the hcp to either
      1. hcp of the scorecard that is edited
      2. hcp of the latest scorecard
  */
  useEffect(() => {
    if(scorecards && scorecards.length !== 0) {
      setHcp(props.hcp ? props.hcp : scorecards[0].hcp)
    }
  }, [scorecards])

  // Update playing hcp after hcp or course changes
  useEffect(() => {
    if(hcp && course)
      setPlayinghcp(utils.playingHcp(hcp, course.slope, course.cr, course.pars))
  }, [hcp, course])

  // Update strokes +/- and adjusted scores after playing hcp changes
  useEffect(() => {
    if(playinghcp) {
      setStrokes(course.pars.map((par, i) => {
        return utils.countStrokes(course.hcps[i], par, playinghcp, scores[i])
      }))
      setAdjscores(course.pars.map((par, i) => {
        return utils.adjustedScore(course.hcps[i], par, playinghcp, scores[i])
      }))
    }
  }, [playinghcp])

  // If course aren't set yet return null
  if(!course) {
    return null
  }

  // Handles course changes
  const handleSelect = (event) => {
    setCourseName(event)
  }

  // When hcp is modified, update playing hcp
  const handlePlayinghcp = (event) => {
    const parsedHcp = parseFloat(event.target.value)
    if(parsedHcp && parsedHcp <= 54){
      setHcp(parsedHcp)
      const chcp = utils.playingHcp(parsedHcp, course.slope, course.cr, course.pars)
      setPlayinghcp(chcp)
    } else {
      setHcp(null)
      setPlayinghcp(null)
    }
  }

  // When score is entered, update adjusted score and strokes +/-
  const handleStrokes = (event) => {
    let newScores = [...scores]
    const score = event.target.value
    const hole = event.target.name
    newScores[hole] = score
    setScores(newScores)
    if(playinghcp){
      let newStrokes = [...strokes]
      let newAdjscores = [...adjscores]
      newStrokes[hole] = utils.countStrokes(course.hcps[hole], course.pars[hole], playinghcp, score)
      setStrokes(newStrokes)
      newAdjscores[hole] = utils.adjustedScore(course.hcps[hole], course.pars[hole], playinghcp, score)
      setAdjscores(newAdjscores)
    }
  }

  const playersPars = course.pars.map((par, i) => {
    return utils.playersPar(playinghcp, par, course.hcps[i])
  })

  // Handles creating a new scorecard when save button is pressed
  const create = (event) => {
    event.preventDefault()

    const [parsedScores, parsedStrokes, parsedAdjscores] =
      utils.parseScores(adjscores, strokes, scores, playinghcp, course.pars, course.hcps)

    if(!hcp){
      dispatch(setErrorMessage('Enter hcp'))
      return
    }
    const scorecard = {
      date,
      course: course.id,
      hcp,
      playinghcp,
      score: utils.reduceScores(parsedStrokes),
      adjscore: utils.reduceScores(parsedAdjscores),
      scorediff: utils.scoreDiff(utils.reduceScores(parsedAdjscores), course),
      scores: parsedScores,
      adjscores: parsedAdjscores
    }
    dispatch(createScorecard(scorecard))
    const dateString = new Intl.DateTimeFormat('fi-FI').format(new Date(date))
    dispatch(setNotification(`Scorecard ${dateString} ${course.name} created`))
    history.push('/')
  }

  // Handles editing an existing scorecard when save button is pressed
  const edit = (event) => {
    event.preventDefault()

    const [parsedScores, parsedStrokes, parsedAdjscores] =
      utils.parseScores(adjscores, strokes, scores, playinghcp, course.pars, course.hcps)

    if(!hcp){
      dispatch(setErrorMessage('Enter hcp'))
      return
    }
    const scorecard = {
      date,
      course: course.id,
      hcp,
      playinghcp,
      score: utils.reduceScores(parsedStrokes),
      adjscore: utils.reduceScores(parsedAdjscores),
      scorediff: utils.scoreDiff(utils.reduceScores(parsedAdjscores), course),
      scores: parsedScores,
      adjscores: parsedAdjscores
    }
    dispatch(editScorecard(props.id, scorecard))
    const dateString = new Intl.DateTimeFormat('fi-FI').format(new Date(date))
    dispatch(setNotification(`Scorecard ${dateString} ${course.name} edited`))
    props.setEditing(false)
  }

  const clear = () => {
    if(window.confirm('Are you sure you want to clear the scorecard?')){
      setScores(Array(course.pars.length).fill(''))
      setStrokes(Array(course.pars.length).fill(''))
      setAdjscores(Array(course.pars.length).fill(''))
    }
  }

  return (
    <div>
      <form onSubmit={props.editing ? edit : create} >
        <div>
          <h2>Create scorecard</h2>
          <ErrorMessage />
          <div className="input-group">
            Choose course:
            <DropdownButton id="dropdown-basic-button" title={courseName}>
              {courses.map(c => {
                return <Dropdown.Item key={c.id} eventKey={c.name} onSelect={handleSelect} locale="fi">
                  {c.name}
                </Dropdown.Item>
              })}
            </DropdownButton>
            &nbsp;
            Date: <DatePicker
              value={date}
              onChange={(value) => setDate(value)}
              locale="fi"
              dateFormat="d.M.Y"
            />
            &nbsp;
            HCP: <input name='hcp' defaultValue={hcp} onSelect={handlePlayinghcp}></input>
            &nbsp;
            Playing HCP: {playinghcp}
          </div>
          <div className="w-auto p-3">
            <Table bordered striped className="text-center" responsive="sm">
              <tbody>
                <tr>
                  <th>Hole</th>
                  {course.pars.map((_, i) => (
                    <th key={i}>{i+1}</th>
                  ))}
                </tr>
                <tr>
                  <th>Par</th>
                  {course.pars.map((par, i) => (
                    <td key={i}>{par}</td>
                  ))}
                </tr>
                <tr>
                  <th>HCP</th>
                  {course.hcps.map((hcp, i) => (
                    <td key={i}>{hcp}</td>
                  ))}
                </tr>
                <tr>
                  <th>Score</th>
                  {scores.map((s, i) => (
                    <td key={i}>
                      <input inputMode="numeric" style={{ width: '20px' }} name={i} onChange={handleStrokes} value={s}/>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Strokes +/-</th>
                  {strokes.map((s, i) => (
                    <td key={i}>{s}</td>
                  ))}
                </tr>
                <tr>
                  <th>Adjusted score</th>
                  {adjscores.map((a, i) => (
                    <td key={i}>{a}</td>
                  ))}
                </tr>
              </tbody>
            </Table>
            <div className="w-25 p-3">
              <Table bordered striped>
                <tbody>
                  <tr style={{ width: '30px' }}>
                    <td></td>
                    <th>Score differential</th>
                    <th>Strokes +/-</th>
                    <th>Adjusted score</th>
                  </tr>
                  <tr>
                    <th>Front 9</th>
                    <td>
                      {
                        utils.scoreDiff(
                          utils.reduceScores(adjscores.slice(0,9)) +
                          playersPars.slice(9).reduce((i, j) => i + j, 0) + 1,
                          course
                        )
                      }
                    </td>
                    <td>{utils.reduceScores(strokes.slice(0, 9))}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Back 9</th>
                    <td>
                      {
                        utils.scoreDiff(
                          utils.reduceScores(adjscores.slice(9)) +
                          playersPars.slice(0,9).reduce((i, j) => i + j, 0) + 1,
                          course
                        )
                      }
                    </td>
                    <td>{utils.reduceScores(strokes.slice(9))}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>
                      {
                        utils.scoreDiff(utils.reduceScores(adjscores), course)
                      }
                    </td>
                    <td>{utils.reduceScores(strokes)}</td>
                    <td>{utils.reduceScores(adjscores)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <Button className='ml-5' type="submit">Save</Button>
            <Button variant="danger" className='ml-2' onClick={clear}>Clear</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ScorecardForm

ScorecardForm.propTypes = {
  date: PropTypes.string,
  scores: PropTypes.array,
  course: PropTypes.object,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  id: PropTypes.string,
  hcp: PropTypes.string
}