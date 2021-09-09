import courseService from '../services/courses'

const initialState = []

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'INIT_COURSES':
      return action.data
    default:
      return state
  }
}

export const initCourses = () => {
  return async dispatch => {
    const courses = await courseService.getAll()
    dispatch({
      type: 'INIT_COURSES',
      data: courses
    })
  }
}

export default reducer