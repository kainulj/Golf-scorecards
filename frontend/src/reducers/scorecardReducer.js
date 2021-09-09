import scorecardService from '../services/scorecards'

const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'INIT_SCORECARDS':
      return action.data
    case 'CREATE_SCORECARD':
      return state.concat(action.data)
    case 'REMOVE_SCORECARD':
      return state.filter(s => s.id !== action.data.id)
    case 'EDIT_SCORECARD':
      return state.map(s => s.id !== action.data.id ? s : action.data)
    default:
      return state
  }
}

export const initScorecards = () => {
  return async dispatch => {
    const scorecards = await scorecardService.getAll()
    dispatch({
      type: 'INIT_SCORECARDS',
      data: scorecards
    })
  }
}

export const createScorecard = (newScorecard) => {
  return async dispatch => {
    const scorecard = await scorecardService.create(newScorecard)
    dispatch({
      type: 'CREATE_SCORECARD',
      data: scorecard
    })
  }
}

export const removeScorecard = (id) => {
  return async dispatch => {
    await scorecardService.remove(id)
    dispatch({
      type: 'REMOVE_SCORECARD',
      data: { id }
    })
  }
}

export const editScorecard = (id, editedScorecard) => {
  return async dispatch => {
    const updateDScorecard = await scorecardService.edit(id, editedScorecard)
    dispatch({
      type: 'EDIT_SCORECARD',
      data: updateDScorecard
    })
  }
}

export default reducer