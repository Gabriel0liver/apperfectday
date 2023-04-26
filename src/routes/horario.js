const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const Subject = require("../models/subject");
const User = require("../models/User");
const { loginRequired } = require("../controllers/auth");
const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addHours = function (hours) {
  var date = new Date(this.valueOf());
  date.setHours(date.getHours() + hours);
  return date;
};

router.post(
  "/create/:year/:month/:day",
  loginRequired,
  async (req, res, next) => {
    const user = await User.findById(req.session.userId);
    const subjectsList = await Subject.find({ user }); // habria que ordenar por creditos
    const activitiesList = await Activity.find({ user });

    if (user.generado) {
      res.status(409).json({});
      return;
    }

    const { params } = req;
    const paramMonth = params.month;
    const paramYear = params.year;
    const paramDay = params.day;
    let horario = user.horario_libre;
    let diasbloques = [[], [], [], [], [], [], []];

    let monday = DateTime.fromObject({
      year: paramYear,
      month: paramMonth,
      day: paramDay,
    });
    monday = monday.minus({ days: monday.weekday - 1 });

    //adaptar el horario al de esa semana
    for (i in horario) {
      let dia = monday.plus({ days: i }).toJSDate();
      let hourinicio = horario[i].inicio.getHours() - 2;
      let minuteinicio = horario[i].inicio.getMinutes();
      let hourfin = horario[i].fin.getHours() - 2;
      let minutefin = horario[i].fin.getMinutes();
      horario[i].inicio = dia.setHours(hourinicio);
      horario[i].inicio = horario[i].inicio.setMinutes(minuteinicio);
      horario[i].fin = dia.setHours(hourfin);
      horario[i].fin = horario[i].fin.setMinutes(minutefin);
    }

    //dividir los dias en bloques
    for (i in horario) {
      activitiesList.forEach((activity) => {
        if (
          activity.inicio < horario[i].fin &&
          activity.fin > horario[i].inicio
        ) {
          if (activity.inicio <= horario[i].inicio) {
            horario[i].inicio = activity.fin;
          } else if (activity.fin >= horario[i].fin) {
            horario[i].fin = activity.inicio;
          } else {
            diasbloques[i].push({
              inicio: horario[i].inicio,
              fin: activity.inicio,
            });
            horario[i].inicio = activity.fin;
          }
        }
      });
      if (horario[i].inicio < horario[i].fin) {
        diasbloques[i].push({
          inicio: horario[i].inicio,
          fin: horario[i].fin,
        });
      }
    }

    //se iteran las asignaturas hasta que no quepan mas o todos los creditos han sido encajados
    subjectsList.forEach(async ({ creditos, _id, titulo }) => {
      let c = creditos;

      let dia = 0;
      let cabe = 0;

      while (c > 0 && cabe < 2) {
        let listabloques = diasbloques[dia];

        let encajao = false;
        for (let i = 0; i < listabloques.length && !encajao; i++) {
          //se iteran los bloques del dia en cuestion
          if (listabloques[i].inicio.addHours(1) <= listabloques[i].fin) {
            //la asignatura cabe en el bloque
            await Activity.create({
              //se crea la asignatura
              user: user._id,
              titulo: "Estudiar " + titulo,
              inicio: listabloques[i].inicio,
              fin: listabloques[i].inicio.addHours(1),
              color: "yellow",
              asignatura: _id,
            });
            listabloques[i].inicio = listabloques[i].inicio.addHours(1); //se reduce el bloque
            c--; //se resta credito
          }
        }

        if (dia == 6) {
          dia = 0;
          cabe++;
        } else {
          dia++;
        }
      }
      //añadir response
      res.redirect("/");
    });
  }
);

module.exports = router;
