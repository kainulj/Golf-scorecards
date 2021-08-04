import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/courses'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newCourse => {
  const response = await axios.post(baseUrl, newCourse)
  return response.data
}

const service = {
  getAll,
  create
}

export default service