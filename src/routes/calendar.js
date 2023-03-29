const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName } = require("../common/utils");
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

module.exports = router;
