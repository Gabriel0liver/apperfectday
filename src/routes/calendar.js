const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName } = require("../common/utils");

/**
 *
 * @param {{activities:{ from: Date; to: Date; title: string; }[]; year: number; month: number}} options
 */
function buildMonthCalendar(options) {
  const { activities, year, month } = options;

  /** @type {{date: DateTime; activities: string[]}[]} */
  const days = [];
  const dateTime = DateTime.fromObject({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  // Dias del mes previo
  for (let i = dateTime.weekday - 1; i > 0; i--) {
    days.push({
      date: dateTime.minus({ days: i }),
      activities: [],
    });
  }
  // Días del mes
  let dateTimeAux = dateTime;
  while (dateTimeAux.month == month) {
    days.push({
      date: dateTimeAux,
      activities: [],
    });
    dateTimeAux = dateTimeAux.plus({ days: 1 });
  }
  // Dias del mes posterior
  const endWeekday = dateTimeAux.weekday;
  const daysToCreate = (7 - endWeekday + 1) % 7;
  for (let i = 0; i < daysToCreate; i++) {
    days.push({
      date: dateTimeAux.plus({ days: i }),
      activities: [],
    });
  }
  // Añadir actividades
  // - Asigno las actividades a cada día del rango
  /** @type {Record<string, string[]} */
  const map = {};
  activities.forEach((d) => {
    const { title } = d;
    const from = DateTime.fromJSDate(d.from).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const to = DateTime.fromJSDate(d.to).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    /** @type {(datetime: DateTime) => void} */
    const setTitle = (datetime) => {
      const iso = datetime.toISO();
      if (!map[iso]) {
        map[iso] = [title];
      } else {
        map[iso].push(title);
      }
    };
    if (to.diff(from, "days").days == 0) {
      setTitle(from);
      return;
    }
    let dateTimeAux = from;
    while (to.diff(dateTimeAux, "days").days > 0) {
      setTitle(dateTimeAux);
      dateTimeAux = dateTimeAux.plus({ days: 1 });
    }
    setTitle(to);
  });
  // - Añado las actividades a cada día del calendario
  days.forEach((d) => {
    const iso = d.date.toISO();
    if (map[iso]) {
      d.activities.push(...map[iso]);
    }
  });
  const now = DateTime.now().toUTC().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  // Mapeo los datos para la vista de calendario
  return days.map((d) => ({
    day: d.date.day,
    month: d.date.month,
    year: d.date.year,
    isThisMonth: month == d.date.month,
    isToday:
      now.year == d.date.year &&
      now.month == d.date.month &&
      now.day == d.date.day,
    activities: d.activities,
  }));
}

router.get("/:year/:month", (req, res) => {
  const { params } = req;
  const queryYear = params["year"];
  const queryMonth = params["month"];
  const now = new Date();
  let year = now.getFullYear(),
    month = now.getMonth() + 1;
  if (queryYear) {
    const n = Number(queryYear);
    if (!isNaN(n) && n >= 1970 && n <= 3000) {
      year = n;
      month = 1;
    }
  }
  if (queryMonth) {
    const n = Number(queryMonth);
    if (!isNaN(n) && n >= 1 && n <= 12) {
      month = n;
    }
  }
  res.render("calendar/calendar", {
    year,
    month,
    monthName: getMonthName(month),
    calendarDays: buildMonthCalendar({
      activities: [
        {
          from: DateTime.now().minus({ days: 3 }).toJSDate(),
          to: DateTime.now().plus({ days: 3 }).toJSDate(),
          title: "Prueba",
        },
      ],
      year,
      month,
    }),
  });
});

router.get("/:year/:month/:day", (req, res) => {
  const { params } = req;
  const queryYear = params.year;
  const queryMonth = params.month;
  const queryDay = params.day;
  const now = new Date();
  let year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate();
  if (queryYear) {
    const n = Number(queryYear);
    if (!isNaN(n) && n >= 1970 && n <= 3000) {
      year = n;
      month = 1;
      day = 1;
    }
  }
  if (queryMonth) {
    const n = Number(queryMonth);
    if (!isNaN(n) && n >= 1 && n <= 12) {
      month = n;
      day = 1;
    }
  }
  if (queryDay) {
    const n = Number(queryDay);
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
