const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName, getColors } = require("../common/utils");
const {
  buildMonthCalendar,
  buildDayCalendar,
} = require("./buildMonthCalendar");
const Activity = require("../models/activity");
const Subject = require("../models/subject");
const { loginRequired } = require("../controllers/auth");
const User = require("../models/User");

router.get("/", loginRequired, (req, res) => {
  const now = DateTime.now();
  let year = now.year,
    month = now.month;
  res.redirect(`/calendar/${year}/${month}`);
});

router.get("/:year", loginRequired, (req, res) => {
  const { params } = req;
  const paramYear = params["year"];
  let year, month;
  const n = Number(paramYear);
  if (!isNaN(n) && n >= 1970 && n <= 3000) {
    year = n;
  }
  if (year) {
    month = 1;
    res.redirect(`/calendar/${year}/${month}`);
    return;
  }
  const now = DateTime.now();
  year = now.year;
  month = now.month;
  res.redirect(`/calendar/${year}/${month}`);
});

router.get("/:year/:month", loginRequired, async (req, res) => {
  const { params, session } = req;
  const paramYear = params["year"];
  const paramMonth = params["month"];
  let year, month;

  let n = Number(paramYear);
  if (!isNaN(n) && n >= 1970 && n <= 3000) {
    year = n;
  }
  n = Number(paramMonth);
  if (!isNaN(n) && n >= 1 && n <= 12) {
    month = n;
  }
  if (!year || !month) {
    const now = DateTime.now();
    year = now.year;
    month = now.month;
    res.redirect(`/calendar/${year}/${month}`);
    return;
  }
  const user = await User.findById(session["userId"]);
  const activities = await Activity.find({ user });
  const subjects = await Subject.find({ user });
  res.render("calendar", {
    user,
    year,
    month,
    monthName: getMonthName(month),
    calendarDays: buildMonthCalendar({
      activities,
      subjects,
      year,
      month,
    }),
    colors: getColors(),
  });
});

router.get("/:year/:month/:day", loginRequired, async (req, res) => {
  const { params, session } = req;
  const paramYear = params.year;
  const paramMonth = params.month;
  const paramDay = params.day;
  let year, month, day;
  if (paramYear) {
    const n = Number(paramYear);
    if (
      isNaN(n) ||
      !DateTime.fromObject({ year: n, month: 1, day: 1 }).isValid
    ) {
      res.status(400).json({
        error: "BAD REQUEST",
      });
      return;
    }
    year = n;
  }
  if (paramMonth) {
    const n = Number(paramMonth);
    if (isNaN(n) || !DateTime.fromObject({ year, month: n, day: 1 }).isValid) {
      res.status(400).json({
        error: "BAD REQUEST",
      });
      return;
    }
    month = n;
  }
  if (paramDay) {
    const n = Number(paramDay);
    if (isNaN(n) || !DateTime.fromObject({ year, month, day: n }).isValid) {
      res.status(400).json({
        error: "BAD REQUEST",
      });
      return;
    }
    day = n;
  }
  const user = await User.findById(session["userId"]);
  const activities = await Activity.find({ user });
  const subjects = await Subject.find({ user });
  res.status(200).json({
    year,
    month,
    day,
    monthName: getMonthName(month),
    activities: buildDayCalendar({
      year,
      month,
      day,
      activities,
      subjects,
    }),
  });
});

router.post("/createSubject", loginRequired, async (req, res) => {
  const { body, session } = req;
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
  const subject = new Subject({
    user: session["userId"],
    titulo: body.nombre,
    creditos: body.numCreditos,
    horario,
    color: "red",
  });
  try {
    await Subject.create(subject);
  } catch (ex) {
    console.log(ex);
    res.status(409).json({});
    return;
  }
  res.status(200).json({});
});

router.post("/createActivity", loginRequired, async (req, res) => {
  const { body, session } = req;
  console.log(body);
  // Validamos parámetro "fecha"
  const fecha = body.fecha;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({});
  }
  let splitted = fecha.split("-");
  const date = DateTime.fromObject({
    year: Number(splitted[0]),
    month: Number(splitted[1]),
    day: Number(splitted[2]),
  });
  if (!date.isValid) {
    return res.status(400).json({});
  }
  // Validamos parámetro "inicio"
  const inicio = body.horaInicio;
  if (!/\d{2}:\d{2}$/.test(inicio)) {
    return res.status(400).json({});
  }
  splitted = inicio.split(":");
  const dateStart = date.set({
    hour: Number(splitted[0]),
    minute: Number(splitted[1]),
  });
  // Validamos parámetro "fin"
  const fin = body.horaFin;
  if (!/\d{2}:\d{2}$/.test(fin)) {
    return res.status(400).json({});
  }
  splitted = fin.split(":");
  const dateEnd = date.set({
    hour: Number(splitted[0]),
    minute: Number(splitted[1]),
  });
  const activity = new Activity({
    user: session["userId"],
    titulo: body.nombre,
    inicio: dateStart.toJSDate(),
    fin: dateEnd.toJSDate(),
    color: body.color,
  });
  try {
    await activity.save();
  } catch (ex) {
    res.status(409).json({});
    return;
  }
  res.status(200).json({});
});

module.exports = router;
