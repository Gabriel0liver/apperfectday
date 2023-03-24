'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //array con todas las asignaturas del usuario
  subjects: [],
  //array con todas las actividades del del usuario
  activities: [],
})

const User = mongoose.model('User', UserSchema)

module.exports = User
