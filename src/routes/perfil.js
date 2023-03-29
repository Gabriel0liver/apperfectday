const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { loginRequired } = require("../controllers/auth");
const { DateTime } = require("luxon");

//mostrar perfil
router.get("/", loginRequired, (req, res) => {
  User.findById(req.session["userId"]).then((user) => {
    res.render("profile", {
      user: {
        name: user.name,
        email: user.email,
        horario_libre: user.horario_libre.map((h) => ({
          inicio: DateTime.fromJSDate(h.inicio).toFormat("HH:mm"),
          fin: DateTime.fromJSDate(h.fin).toFormat("HH:mm"),
        })),
      },
    });
  });
});

//editar perfil
router.post("/", loginRequired, (req, res) => {
  const { body } = req;
  const nombre = body["nombre"];
  const email = body["email"];
  const horario = [];
  for (let i = 1; i <= 7; i++) {
    let splitted = body[`horaInicio${i}`].split(":");
    const inicio = DateTime.now().set({
      hour: Number(splitted[0]),
      minute: Number(splitted[1]),
      second: 0,
      millisecond: 0,
    });
    splitted = body[`horaFin${i}`].split(":");
    let fin = DateTime.now().set({
      hour: Number(splitted[0]),
      minute: Number(splitted[1]),
      second: 0,
      millisecond: 0,
    });
    if (fin < inicio) {
      fin = fin.set({ hour: inicio.hour, minute: inicio.minute });
    }
    horario.push({
      inicio: inicio.toJSDate(),
      fin: fin.toJSDate(),
    });
  }
  User.findByIdAndUpdate(req.session.userId, {
    name: nombre,
    email: email,
    horario_libre: horario,
  })
    .then((user) => {
      res.redirect("/perfil");
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/perfil");
    });
});

module.exports = router;
