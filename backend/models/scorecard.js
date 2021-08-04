const mongoose = require('mongoose')

const arrayLimit = (array) => {
  return array.length === 18
}

const schema = mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  player: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  hcp: {
    type: Number,
    required: true
  },
  coursehcp: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  adjscore: {
    type: Number,
    required: true
  },
  scorediff: {
    type: Number,
    required: true
  },
  scores: {
    type: [
      {
        type: String,
        required: true
      }
    ],
    validate: [arrayLimit, '{PATH}, scorecard must have 18 scores']
  },
  adjscores: {
    type: [
      {
        type: String,
        required: true
      }
    ],
    validate: [arrayLimit, '{PATH}, scorecard must have 18 adjusted scores']
  }
})



schema.set('toJSON', {
  transform: (doc, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
    return object
  }
})

const Scorecard = mongoose.model('Scorecard', schema)

module.exports = Scorecard