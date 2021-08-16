import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownButton, Table, Button, Alert } from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import { connect } from 'react-redux'
import utils from '../utilities/scorecard'
import { createScorecard, editScorecard } from '../reducers/scorecardReducer'
import { useHistory } from 'react-router-dom'

const ScorecardForm = (props) => {

  const history = useHistory()

  const [showAlert, setShowAlert] = useState(false)

  const [courseName, setCourseName] =
    useState(props.course ? props.course.name : props.courses[0].name)

  const [hcp, setHcp] =
    useState(props.scorecards.length !== 0 ? props.scorecards[0].hcp : '')

  const [course, setCourse] =
    useState(props.courses.find(c => c.name === courseName))
  const [strokes, setStrokes] = useState(Array(course.pars.length).fill(''))
  const [adjscores, setAdjscores] = useState(Array(course.pars.length).fill(''))
  const [scores, setScores] =
    useState(props.scores ? props.scores : (
      window.localStorage.getItem('score') ? JSON.parse(window.localStorage.getItem('score')) : Array(course.pars.length).fill(''))
    )
  const [date, setDate] = useState(props.date ? new Date(props.date) : new Date())

  const [coursehcp, setCoursehcp] =
    useState(hcp ? utils.playingHcp(hcp, course.slope, course.cr, course.pars) : null)

  useEffect(() => {
    setCourse(props.courses.find(c => c.name === courseName))
  }, [courseName])

  useEffect(() => {
    if(hcp)
      setCoursehcp(utils.playingHcp(hcp, course.slope, course.cr, course.pars))
  }, [course])

  useEffect(() => {
    if(hcp) {
      let newStrokes = course.pars.map((par, i) => {
        return utils.countStrokes(course.hcps[i], par, coursehcp, scores[i])
      })
      setStrokes(newStrokes)
      let newAdjscores = course.pars.map((par, i) => {
        return utils.adjustedScore(course.hcps[i], par, coursehcp, scores[i])
      })
      setAdjscores(newAdjscores)
    } else {
      setStrokes(Array(course.pars.length).fill(''))
      setAdjscores(Array(course.pars.length).fill(''))
    }
  }, [coursehcp])

  const handleSelect = (event) => {
    setCourseName(event)
  }

  const handleCoursehcp = (event) => {
    const parsedHcp = parseFloat(event.target.value)
    if(parsedHcp && parsedHcp <= 54){
      setHcp(parsedHcp)
      const chcp = utils.playingHcp(parsedHcp, course.slope, course.cr, course.pars)
      setCoursehcp(chcp)
    } else {
      setHcp(null)
      setCoursehcp(null)
    }
  }

  const handleStrokes = (event) => {
    let newScores = [...scores]
    const score = event.target.value
    const hole = event.target.name
    newScores[hole] = score
    window.localStorage.setItem('score', JSON.stringify(newScores))
    setScores(newScores)
    if(coursehcp){
      let newStrokes = [...strokes]
      let newAdjscores = [...adjscores]
      newStrokes[hole] = utils.countStrokes(course.hcps[hole], course.pars[hole], coursehcp, score)
      setStrokes(newStrokes)
      newAdjscores[hole] = utils.adjustedScore(course.hcps[hole], course.pars[hole], coursehcp, score)
      setAdjscores(newAdjscores)
    }
  }

  const playersPars = course.pars.map((par, i) => {
    return utils.playersPar(coursehcp, par, course.hcps[i])
  })

  const parseScores = () => {
    let newAdjscores = [...adjscores]
    let newStrokes = [...strokes]
    const editedScores = scores.map((s, i) => {
      if(strokes[i] === 2 || s === ''){
        newStrokes[i] = 2
        newAdjscores[i] = utils.playersPar(coursehcp, course.pars[i], course.hcps[i]) + 2
        return '-'
      } else {
        return s
      }
    })
    return [editedScores, newStrokes, newAdjscores]
  }

  const createScorecard = (event) => {
    event.preventDefault()
    const [parsedScores, parsedStrokes, parsedAdjscores] = parseScores()
    if(!hcp){
      setShowAlert(true)
      return
    }
    const scorecard = {
      date,
      course: course.id,
      hcp,
      coursehcp,
      score: utils.reduceScores(parsedStrokes),
      adjscore: utils.reduceScores(parsedAdjscores),
      scorediff: utils.scoreDiff(utils.reduceScores(parsedAdjscores), course),
      scores: parsedScores,
      adjscores: parsedAdjscores
    }
    props.createScorecard(scorecard)
    window.localStorage.removeItem('score')
    history.push('/')
  }

  const editScorecard = (event) => {
    event.preventDefault()
    const [parsedScores, parsedStrokes, parsedAdjscores] = parseScores()
    if(!hcp){
      setShowAlert(true)
      return
    }
    const scorecard = {
      date,
      course: course.id,
      hcp,
      coursehcp,
      score: utils.reduceScores(parsedStrokes),
      adjscore: utils.reduceScores(parsedAdjscores),
      scorediff: utils.scoreDiff(utils.reduceScores(parsedAdjscores), course),
      scores: parsedScores,
      adjscores: parsedAdjscores
    }
    props.editScorecard(props.id, scorecard)
    window.localStorage.removeItem('score')
    props.setEditing(false)
  }

  const clear = () => {
    if(window.confirm('Are you sure that you want to clear the scorecard?')){
      window.localStorage.removeItem('score')
      setScores(Array(course.pars.length).fill(''))
      setStrokes(Array(course.pars.length).fill(''))
      setAdjscores(Array(course.pars.length).fill(''))
    }
  }

  return (
    <div>
      <form onSubmit={props.editing ? editScorecard : createScorecard} >
        <div>
          <h2>Create scorecard</h2>
          <Alert show={showAlert} variant="warning">Enter hcp</Alert>
          <div className="input-group">
            Choose course:
            <DropdownButton id="dropdown-basic-button" title={courseName}>
              {props.courses.map(c => {
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
            HCP: <input name='hcp' defaultValue={hcp} onSelect={handleCoursehcp}></input>
            &nbsp;
            Playing HCP: {coursehcp}
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

const mapStateToProps = (state) => {
  return {
    courses: state.courses,
    scorecards: state.scorecards.sort((i, j) => i.date < j.date)
  }
}

const mapDispatchToProps = {
  createScorecard,
  editScorecard
}

export default connect(mapStateToProps, mapDispatchToProps)(ScorecardForm)

ScorecardForm.propTypes = {
  courses: PropTypes.array,
  scorecards: PropTypes.array,
  createScorecard: PropTypes.func,
  editScorecard: PropTypes.func,
  date: PropTypes.string,
  scores: PropTypes.array,
  course: PropTypes.object,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  id: PropTypes.string
}