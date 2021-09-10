require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('express-async-errors')
const cors = require('cors')

const courseRouter = require('./controllers/courses')
const scorecardRouter = require('./controllers/scorecards')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.tokenExtractor)

app.use('/api/courses', courseRouter)
app.use('/api/scorecards', scorecardRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

module.exports = app