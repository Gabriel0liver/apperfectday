const express = require("express");
const { loginRequired } = require("../controllers/auth");
const router = express.Router();
const Activity = require("../models/activity");
const Subject = require("../models/subject");
const { DateTime } = require("luxon");
const User = require("../models/User");

router.get("/:idActividad", loginRequired, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const actividad = await Activity.findById(req.params.idActividad);
  if (!actividad) {
    res.redirect("/");
    return;
  }
  let asignatura = null;
  if (actividad.asignatura) {
    asignatura = await Subject.findById(actividad.asignatura);
  }
  if (actividad.user == req.session.userId) {
    res.render("activity", {
      user,
      actividad: {
        id: actividad._id,
        titulo: actividad.titulo,
        fecha: DateTime.fromJSDate(actividad.inicio).toFormat("yyyy-MM-dd"),
        inicio: DateTime.fromJSDate(actividad.inicio).toFormat("HH:mm"),
        fin: DateTime.fromJSDate(actividad.fin).toFormat("HH:mm"),
        color: actividad.color,
        asignatura,
      },
    });
  } else {
    res.redirect("/");
  }
});

// modificar una actividad
router.post("/:actividadId", loginRequired, async (req, res) => {
  const { body, session, params } = req;
  let splitted = body.fecha.split("-");
  const year = Number(splitted[0]),
    month = Number(splitted[1]),
    day = Number(splitted[2]);
  splitted = body.inicio.split(":");
  const inicio = DateTime.fromObject({
    year,
    month,
    day,
    hour: Number(splitted[0]),
    minute: Number(splitted[1]),
    second: 0,
    millisecond: 0,
  });
  splitted = body.fin.split(":");
  const fin = DateTime.fromObject({
    year,
    month,
    day,
    hour: Number(splitted[0]),
    minute: Number(splitted[1]),
    second: 0,
    millisecond: 0,
  });
  if (fin <= inicio) {
    res.status(409).json({});
    return;
  }
  try {
    await Activity.findByIdAndUpdate(params["actividadId"], {
      user: session["userId"],
      titulo: body.nombre,
      inicio: inicio.toJSDate(),
      fin: fin.toJSDate(),
      color: body.color,
    });
  } catch (ex) {
    res.status(409).json({});
    return;
  }
  res.status(200).json({});
});

// eliminar una actividad
router.post("/:actividadId/remove", loginRequired, (req, res, next) => {
  Activity.findById(req.params.actividadId).then((actividad) => {
    if (actividad && actividad.user == req.session.userId) {
      Activity.findByIdAndRemove(req.params.actividadId).then(() => {
        res.redirect("/calendar");
      });
    } else {
      res.redirect("/calendar");
    }
  });
});
module.exports = router;
