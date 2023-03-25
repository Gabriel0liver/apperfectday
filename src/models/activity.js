"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const activitySchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  titulo: {
    type: String,
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
  color: {
    type: String,
    required: true,
  },
  asignatura: {
    type: ObjectId,
    required: false,
    ref: "Subject",
  },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
