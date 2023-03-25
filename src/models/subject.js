"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const subjectSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  titulo: {
    type: String,
    required: true,
    unique: true,
  },
  horario: [
    {
      dia: {
        type: Number,
        required: true,
      },
      inicio: {
        type: Date,
        required: true,
      },
      fin: {
        type: Date,
        required: true,
      },
    },
  ],
  creditos: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
