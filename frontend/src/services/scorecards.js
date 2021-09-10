import axios from 'axios'
const baseUrl = '/api/scorecards'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const removeToken = () => {
  token = null
}

const getAll = () => {
  const auth = {
    headers: { Authorization: token }
  }
  const request = axios.get(baseUrl, auth)
  return request.then(response => response.data)
}

const create = async newScorecard => {
  const auth = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newScorecard, auth)
  return response.data
}

const remove = async (id) => {
  const auth = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${id}`, auth)
}

const edit = async (id, editedScorecad) => {
  const auth = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, editedScorecad, auth)
  return response.data
}

const service = {
  setToken,
  removeToken,
  getAll,
  create,
  remove,
  edit
}

export default service