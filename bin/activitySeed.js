
require('dotenv').config();

const mongoose = require('mongoose');
const Activity = require('../src/models/activity');
const { DateTime } = require("luxon");

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  dbName: "apperfectday"
});

const activities = [
    {
      titulo: "Actividad 1",
      inicio: DateTime.now()
        .set({ day: 8, hour: 10, minute: 30 })
        .toJSDate(),
      fin: DateTime.now().set({ day: 8, hour: 13, minute: 30 }).toJSDate(),
      color: "blue",
    },
    {
      titulo: "Actividad 2",
      inicio: DateTime.now()
        .set({ day: 8, hour: 13, minute: 30 })
        .toJSDate(),
      fin: DateTime.now().set({ day: 8, hour: 15, minute: 00 }).toJSDate(),
      color: "green"
    },
    {
      titulo: "Actividad 3",
      inicio: DateTime.now()
        .set({ day: 8, hour: 09, minute: 00 })
        .toJSDate(),
      fin: DateTime.now().set({ day: 8, hour: 10, minute: 00 }).toJSDate(),
      color: "yellow"
    },
  ]

  Activity.create(activities)
  .then(() => {
    mongoose.connection.close();
  })
  .catch(error => {
    console.error(error);
  });