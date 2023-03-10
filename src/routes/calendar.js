const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName } = require("../common/utils");
const buildMonthCalendar = require("./buildMonthCalendar");
router.get("/", (req, res) => {
  const now = new Date();
  let year = now.getFullYear(),
    month = now.getMonth() + 1;
  res.redirect(`/calendar/${year}/${month}`);
});
router.get("/:year", (req, res) => {
  const { params } = req;
  const paramYear = params["year"];
  const paramMonth = params["month"];
  let year, month;
  if (paramYear) {
    const n = Number(paramYear);
    if (!isNaN(n) && n >= 1970 && n <= 3000) {
      year = n;
    }
  }
  if (paramMonth) {
    const n = Number(paramMonth);
    if (!isNaN(n) && n >= 1 && n <= 12) {
      month = n;
    }
  }
  if (!year) {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    res.redirect(`/calendar/${year}/${month}`);
    return;
  }
  month = 1;
  res.redirect(`/calendar/${year}/${month}`);
});
router.get("/:year/:month", (req, res) => {
  const { params } = req;
  const paramYear = params["year"];
  const paramMonth = params["month"];
  let year, month;
  if (paramYear) {
    const n = Number(paramYear);
    if (!isNaN(n) && n >= 1970 && n <= 3000) {
      year = n;
    }
  }
  if (paramMonth) {
    const n = Number(paramMonth);
    if (!isNaN(n) && n >= 1 && n <= 12) {
      month = n;
    }
  }
  if (!year || !month) {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    res.redirect(`/calendar/${year}/${month}`);
    return;
  }
  res.render("calendar/calendar", {
    year,
    month,
    monthName: getMonthName(month),
    calendarDays: buildMonthCalendar({
      activities: [
        {
          _id: "1",
          titulo: "Actividad 1",
          inicio: DateTime.now().set({ hour: 10, minute: 30 }).toJSDate(),
          fin: DateTime.now().set({ hour: 13, minute: 30 }).toJSDate(),
          color: "blue",
        },
        {
          _id: "2",
          titulo: "Actividad 2",
          inicio: DateTime.now().set({ hour: 13, minute: 30 }).toJSDate(),
          fin: DateTime.now().set({ hour: 15, minute: 00 }).toJSDate(),
          asignatura: "1",
        },
        {
          _id: "3",
          titulo: "Actividad 3",
          inicio: DateTime.now().set({ hour: 09, minute: 00 }).toJSDate(),
          fin: DateTime.now().set({ hour: 10, minute: 00 }).toJSDate(),
        },
      ],
      subjects: [
        {
          _id: "1",
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
        },
      ],
      year,
      month,
    }),
  });
});

router.get("/:year/:month/:day", (req, res) => {
  const { params } = req;
  const paramYear = params.year;
  const paramMonth = params.month;
  const paramDay = params.day;
  const now = new Date();
  let year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate();
  if (paramYear) {
    const n = Number(paramYear);
    if (!isNaN(n) && n >= 1970 && n <= 3000) {
      year = n;
      month = 1;
      day = 1;
    }
  }
  if (paramMonth) {
    const n = Number(paramMonth);
    if (!isNaN(n) && n >= 1 && n <= 12) {
      month = n;
      day = 1;
    }
  }
  if (paramDay) {
    const n = Number(paramDay);
    if (!isNaN(n) && DateTime.fromObject({ year, month, day }).isValid) {
      day = n;
    }
  }
  res.render("calendar/calendar-day", {
    year,
    month,
    day,
    monthName: getMonthName(month),
    activities: ["Prueba"],
  });
});

module.exports = router;
