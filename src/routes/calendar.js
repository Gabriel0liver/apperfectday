const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const { getMonthName } = require("../common/utils");
const buildMonthCalendar = require("./buildMonthCalendar");
const Activity = require("../models/activity");
const Subject = require("../models/subject");
const { loginRequired } = require("../controllers/auth");
const User = require('../models/User');

router.get('/', loginRequired, (req, res) => {
  const now = new Date()
  let year = now.getFullYear(),
    month = now.getMonth() + 1
  res.redirect(`/calendar/${year}/${month}`)
})

router.get("/:year",loginRequired, (req, res) => {
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

router.get("/:year/:month",loginRequired,async (req, res) => {
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
  const user = await User.findById(req.session.userId)

  Activity.find()
    .then(activities => {
      Subject.find()
        .then(subjects => {
          res.render("calendar/calendar", {
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
        })
    })
});

router.get("/:year/:month/:day",loginRequired, (req, res) => {
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
