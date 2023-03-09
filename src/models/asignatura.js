'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const asignaturaSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  horario:[
    {
      dia:{
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
    }
  ],
  creditos:{
    type: Number,
    required:true
  },
  color:{
    type: String,
    required: true
  }
});

const Asignatura = mongoose.model('Actividad', asignaturaSchema);

module.exports = Asignatura;