const courseRouter = require('express').Router()
const Course = require('../models/course')

courseRouter.get('/', async (request, response) =>  {
  const courses = await Course.find({})
  response.json(courses.map(course => course.toJSON()))
})

courseRouter.post('/', async (request, response) => {
  const course = new Course(request.body)

  const postedCourse = await course.save()

  response.json(postedCourse.toJSON())
})

courseRouter.delete('/:id', async (request, response) => {
  await Course.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

courseRouter.put('/:id', async (request, response) => {
  const updatedCourse =
    await Course.findByIdAndUpdate(request.params.id, request.body, { new: true })

  response.json(updatedCourse.toJSON())
})


module.exports = courseRouter