const scorecardRouter = require('express').Router()
const ObjectId = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')
const Scorecard = require('../models/scorecard')
const User = require('../models/user')
const Course = require('../models/course')

scorecardRouter.get('/', async (request, response) => {

  // If the user isn't logged in the request returns example data
  if (!request.token) {
    const exampleCards = await Scorecard.find({ player: { $exists: false } })
      .populate('course')

    response.json(exampleCards.map(scorecard => scorecard.toJSON()))
  } else {
    const token = jwt.verify(request.token, process.env.SECRET)
    const scorecards = await Scorecard.find({ player: ObjectId(token.id) })
      .populate('course')
      .populate('player')

    response.json(scorecards.map(scorecard => scorecard.toJSON()))
  }
})

// Post scorecard if user has not logged in, scorecard is added to the example data
const postWithoutAccount = async (request, response) => {
  const body = request.body
  const course = await Course.findById(body.course)

  // Posted scorecard doesn't have player field
  const scorecard = new Scorecard({
    date: body.date,
    course: course._id,
    hcp: body.hcp,
    playinghcp: body.playinghcp,
    score: body.score,
    adjscore: body.adjscore,
    scorediff: body.scorediff,
    scores: body.scores,
    adjscores: body.adjscores
  })

  const postedScorecard = await scorecard.save()
  await postedScorecard.populate('course').execPopulate()
  response.json(postedScorecard.toJSON())

}

// Post scorecard if user has logged in
const post = async (request, response) => {
  const token = jwt.verify(request.token, process.env.SECRET)
  if (!token.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const body = request.body
  const player = await User.findById(token.id)
  const course = await Course.findById(body.course)

  const scorecard = new Scorecard({
    date: body.date,
    course: course._id,
    player: player._id,
    hcp: body.hcp,
    playinghcp: body.playinghcp,
    score: body.score,
    adjscore: body.adjscore,
    scorediff: body.scorediff,
    scores: body.scores,
    adjscores: body.adjscores
  })

  const postedScorecard = await scorecard.save()
  await postedScorecard.populate('course').populate('player').execPopulate()
  response.json(postedScorecard.toJSON())
}

scorecardRouter.post('/', async (request, response) => {
  if (request.token) {
    post(request, response)
  } else {
    postWithoutAccount(request, response)
  }
})

scorecardRouter.delete('/:id', async (request, response) => {
  const scorecard = await Scorecard.findById(request.params.id)

  // Checks if the scorecard has player field. If the field is missing
  // anybody can remove it.
  if (scorecard.player) {
    if (request.token) {
      const token = jwt.verify(request.token, process.env.SECRET)
      if (!token.id) {
        return response.status(401).json({ error: 'invalid token' })
      }

      const user = await User.findById(token.id)

      if(user.id.toString() !== scorecard.player.toString()) {
        return response.status(401).json({ error: 'can only be removed by the player' })
      }
    } else {
      return response.status(401).json({ error: 'can only be removed by the player' })
    }
  }

  await Scorecard.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

scorecardRouter.put('/:id', async (request, response) => {
  const scorecard = await Scorecard.findById(request.params.id)

  // Checks if the scorecard has player field. If the field is missing
  // anybody can modify it.
  if (scorecard.player) {
    if (request.token) {
      const token = jwt.verify(request.token, process.env.SECRET)
      if (!token.id) {
        return response.status(401).json({ error: 'invalid token' })
      }

      const user = await User.findById(token.id)

      if(user.id.toString() !== scorecard.player.toString()) {
        return response.status(401).json({ error: 'can only be modified by the player' })
      }
    } else {
      return response.status(401).json({ error: 'can only be modified by the player' })
    }
  }

  const updatedScorecard =
    await Scorecard.findByIdAndUpdate(request.params.id, request.body, { new: true })
      .populate('course')
      .populate('player')

  response.json(updatedScorecard.toJSON())
})

module.exports = scorecardRouter