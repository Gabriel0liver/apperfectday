const express = require("express");
const router = express.Router();
const Subject = require("../models/subject");
const Activity = require("../models/activity");
const { loginRequired } = require("../controllers/auth");
const { DateTime } = require("luxon");
const User = require("../models/User");

// mostrar una asignatura
router.get("/:asignaturaId", loginRequired, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const asignatura = await Subject.findById(req.params.asignaturaId);
  if (asignatura.user == req.session.userId) {
    res.render("subject", {
      user,
      asignatura: {
        id: asignatura._id,
        titulo: asignatura.titulo,
        horario: asignatura.horario.map((h) => ({
          dia: h.dia,
          inicio: DateTime.fromJSDate(h.inicio).toFormat("HH:mm"),
          fin: DateTime.fromJSDate(h.fin).toFormat("HH:mm"),
        })),
        creditos: asignatura.creditos,
        color: asignatura.color,
      },
    });
  } else {
    res.redirect("/");
  }
});

// modificar una asignatura
router.post("/:asignaturaId", loginRequired, async (req, res) => {
  const { body, session, params } = req;
  let failed = false;
  const horario = body.horario.map((h) => {
    let splitted = h.inicio.split(":");
    const inicio = DateTime.now().set({
      hour: Number(splitted[0]),
      minute: Number(splitted[1]),
      second: 0,
      millisecond: 0,
    });
    splitted = h.fin.split(":");
    const fin = DateTime.now().set({
      hour: Number(splitted[0]),
      minute: Number(splitted[1]),
      second: 0,
      millisecond: 0,
    });
    if (fin <= inicio) {
      failed = true;
    }
    return {
      dia: h.dia,
      inicio: inicio.toJSDate(),
      fin: fin.toJSDate(),
    };
  });
  if (failed) {
    res.status(409).json({});
    return;
  }
  try {
    await Subject.findByIdAndUpdate(params["asignaturaId"], {
      user: session["userId"],
      titulo: body.nombre,
      creditos: body.numCreditos,
      horario,
      color: "red",
    });
  } catch (ex) {
    res.status(409).json({});
    return;
  }
  res.status(200).json({});
});

// eliminar una asignatura
router.post("/:asignaturaId/remove", loginRequired, (req, res, next) => {
  Subject.findById(req.params.asignaturaId).then((asignatura) => {
    if (asignatura.user == req.session.userId) {
      Activity.deleteMany({ subject: asignatura._id }).then(() => {
        Subject.findByIdAndRemove(req.params.asignaturaId).then(() => {
          res.redirect("/calendar");
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
