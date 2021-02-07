const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 255 },
    username: { type: String, required: true, unique: true, maxlength: 255 },
    password: { type: String, required: true, maxlength: 1000 }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('User', schema)
