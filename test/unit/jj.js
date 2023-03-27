const buildMonthCalendar = require('../../src/routes/buildMonthCalendar')
console.log(
  buildMonthCalendar.buildDayCalendar({
   activities: [],
   year: 2000,
   month: 12,
   day: 7,
  subjects: []
  })
)