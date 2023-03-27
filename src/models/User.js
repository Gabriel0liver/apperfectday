"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

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
  horario_libre:[
    {
      inicio: {
        type: Date,
        required: true,
      },
      fin: {
        type: Date,
        required: true,
      },
    },
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
