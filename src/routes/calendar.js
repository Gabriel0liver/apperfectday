const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName } = require("../common/utils");
const buildMonthCalendar = require('./buildMonthCalendar')





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
