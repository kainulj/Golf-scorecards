const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (doc, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
  }
})

const User = mongoose.model('User', schema)

module.exports = User