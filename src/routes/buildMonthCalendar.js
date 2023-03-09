const { DateTime } = require('luxon')
/**
 *
 * @param {{activities:{ from: Date; to: Date; title: string; }[]; year: number; month: number}} options
 */
function buildMonthCalendar(options) {
  const { activities, year, month } = options

  /** @type {{date: DateTime; activities: string[]}[]} */
  const days = []
  const dateTime = DateTime.fromObject({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  // Dias del mes previo
  for (let i = dateTime.weekday - 1; i > 0; i--) {
    days.push({
      date: dateTime.minus({ days: i }),
      activities: [],
    })
  }
  // Días del mes
  let dateTimeAux = dateTime
  while (dateTimeAux.month == month) {
    days.push({
      date: dateTimeAux,
      activities: [],
    })
    dateTimeAux = dateTimeAux.plus({ days: 1 })
  }
  // Dias del mes posterior
  const endWeekday = dateTimeAux.weekday
  const daysToCreate = (7 - endWeekday + 1) % 7
  for (let i = 0; i < daysToCreate; i++) {
    days.push({
      date: dateTimeAux.plus({ days: i }),
      activities: [],
    })
  }
  // Añadir actividades
  // - Asigno las actividades a cada día del rango
  /** @type {Record<string, string[]} */
  const map = {}
  activities.forEach((d) => {
    const { title } = d
    const from = DateTime.fromJSDate(d.from).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    const to = DateTime.fromJSDate(d.to).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    /** @type {(datetime: DateTime) => void} */
    const setTitle = (datetime) => {
      const iso = datetime.toISO()
      if (!map[iso]) {
        map[iso] = [title]
      } else {
        map[iso].push(title)
      }
    }
    if (to.diff(from, 'days').days == 0) {
      setTitle(from)
      return
    }
    let dateTimeAux = from
    while (to.diff(dateTimeAux, 'days').days > 0) {
      setTitle(dateTimeAux)
      dateTimeAux = dateTimeAux.plus({ days: 1 })
    }
    setTitle(to)
  })
  // - Añado las actividades a cada día del calendario
  days.forEach((d) => {
    const iso = d.date.toISO()
    if (map[iso]) {
      d.activities.push(...map[iso])
    }
  })
  const now = DateTime.now().toUTC().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
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
  }))
}


module.exports = buildMonthCalendar
