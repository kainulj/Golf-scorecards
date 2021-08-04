const mongoose = require('mongoose')

const arrayLimit = async (array) => {
  return await array.length === 18
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cr: {
    type: Number,
    required: true
  },
  slope: {
    type: Number,
    required: true
  },
  pars: {
    type: [
      {
        type: Number,
        required: true
      }
    ],
    validate: [arrayLimit, '{PATH}, course must have 18 pars']
  },
  hcps: {
    type: [
      {
        type: Number,
        required: true
      }
    ],
    validate: [arrayLimit, '{PATH}, course must have 18 hcps']
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

const Course = mongoose.model('Course', schema)

module.exports = Course