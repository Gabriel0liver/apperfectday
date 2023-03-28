
require('dotenv').config();

const mongoose = require('mongoose');
const Subject = require('../src/models/subject');
const { DateTime } = require("luxon");
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  dbName: "apperfectday"
});

const subjects = [
    {
        user: new ObjectId('6421d1c2fdc3c230e34fa1a1'),
        titulo: "Asignatura 1",
        color: "red",
        creditos: 6,
        horario: [
          {
            dia: 1,
            inicio: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
            fin: DateTime.now().set({ hour: 14, minute: 0 }).toJSDate(),
          },
          {
            dia: 3,
            inicio: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
            fin: DateTime.now().set({ hour: 14, minute: 0 }).toJSDate(),
          },
          {
            dia: 5,
            inicio: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
            fin: DateTime.now().set({ hour: 14, minute: 0 }).toJSDate(),
          },
        ],
      }
];



Subject.create(subjects)
  .then(() => {
    mongoose.connection.close();
  })
  .catch(error => {
    console.error(error);
  });