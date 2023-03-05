'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const actividadSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  inicio: {
    type: Date,
    required: true
  },
  fin: {
    type: Date,
    required: true
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;