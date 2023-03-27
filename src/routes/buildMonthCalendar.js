const { DateTime } = require("luxon");
/**
 * @typedef {Object} Asignatura
 * @property {string} _id
 * @property {string} titulo
 * @property {number} creditos
 * @property {string} color
 * @property {HorarioAsignatura[]} horario
 */

/**
 * @typedef {Object} HorarioAsignatura
 * @property {number} dia
 * @property {Date} inicio
 * @property {Date} fin
 */

/**
 * @typedef {Object} Actividad
 * @property {string} _id
 * @property {string} titulo
 * @property {Date} inicio
 * @property {Date} fin
 * @property {string} color
 * @property {string} asignatura
 */

/**
 * @typedef {Record<number, HorarioAsignaturaYTituloYColor[]>} SubjectsByWeekDayMap
 */
/**
 * @typedef {HorarioAsignatura & { titulo: string; color: string; }} HorarioAsignaturaYTituloYColor
 */
/**
 * @typedef {Record<string, Actividad[]>} ActivitiesByDateMap
 */

/**
 * @typedef {{ title: string; from: string; to: string; color?: string; }} ActividadVista
 */

/**
 * Devuelve las actividades para el día de `dateTime`
 * @param {{
 *  subjects: Asignatura[];
 *  subjectsByWeekDay: SubjectsByWeekDayMap;
 *  activitiesByDate: ActivitiesByDateMap;
 *  dateTime: DateTime;
 * }} options
 */
function mapActivitiesByDate(options) {
  const { activitiesByDate, dateTime, subjectsByWeekDay, subjects } = options;
  // Añado las asignaturas como actividades
  /** @type {ActividadVista[]} */
  const activities = [];
  const weekDay = dateTime.weekday;
  if (subjectsByWeekDay[weekDay]) {
    const list = subjectsByWeekDay[weekDay].map((a) => ({
      title: a.titulo,
      from: DateTime.fromJSDate(a.inicio).toFormat("HH:mm"),
      to: DateTime.fromJSDate(a.fin).toFormat("HH:mm"),
      color: a.color,
    }));
    activities.push(...list);
  }
  // Añado las actividades
  const date = dateTime.toFormat("yyyy/MM/dd");
  if (activitiesByDate[date]) {
    const list = activitiesByDate[date].map((a) => {
      const color = a.asignatura
        ? subjects.find((s) => s._id == a.asignatura)?.color
        : a.color;
      return {
        title: a.titulo,
        from: DateTime.fromJSDate(a.inicio).toFormat("HH:mm"),
        to: DateTime.fromJSDate(a.fin).toFormat("HH:mm"),
        color,
      };
    });
    activities.push(...list.sort((a, b) => a.from.localeCompare(b.from)));
  }
  return activities;
}

/**
 * Agrupa las actividades por dia y las asignaturas por dia de la semana
 * @param {{
 *  activities: Actividad[];
 *  subjects: Asignatura[];
 *  year: number;
 *  month: number;
 * }} options
 */
function groupActivitiesAndSubjects(options) {
  const { activities, subjects, year, month } = options;
  // Agrupo las actividades por día del mes
  /** @type {ActivitiesByDateMap} */
  const activitiesByDate = {};
  activities.forEach((a) => {
    const { inicio } = a;
    const date = DateTime.fromJSDate(inicio);
    const activityYear = date.year;
    const activityMonth = date.month;
    if (activityYear != year || activityMonth != month) return;
    const activityDate = date.toFormat("yyyy/MM/dd");
    if (!activitiesByDate[activityDate]) {
      activitiesByDate[activityDate] = [];
    }
    activitiesByDate[activityDate].push(a);
  });
  // Agrupo las asignaturas por dia de la semana
  /** @type {HorarioAsignaturaYTituloYColor[]} */
  let subjectsList = [];
  subjects.forEach(({ titulo, horario, color }) => {
    const list = horario.map(({ dia, fin, inicio }) => ({
      titulo,
      dia,
      fin,
      inicio,
      color,
    }));
    subjectsList.push(...list);
  });
  subjectsList = subjectsList.sort((a, b) => {
    if (a.dia == b.dia) return a.inicio.valueOf() - b.inicio.valueOf();
    return a.dia - b.dia;
  });
  /** @type {SubjectsByWeekDayMap} */
  const subjectsByWeekDay = {};
  subjectsList.forEach((s) => {
    const { dia } = s;
    if (!subjectsByWeekDay[dia]) {
      subjectsByWeekDay[dia] = [];
    }
    subjectsByWeekDay[dia].push(s);
  });
  return {
    activitiesByDate,
    subjectsByWeekDay,
  };
}

/**
 *
 * @param {{
 *  activities: Actividad[];
 *  year: number;
 *  month: number;
 *  subjects: Asignatura[];
 * }} options
 */

function buildMonthCalendar(options) {
  const { activities, year, month, subjects } = options;
  /** @type {{date: DateTime; activities: ActividadVista[]}[]} */
  const days = [];
  const dateTimeDayOne = DateTime.fromObject({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const { activitiesByDate, subjectsByWeekDay } = groupActivitiesAndSubjects({
    activities,
    subjects,
    year,
    month,
  });
  // Dias del mes previo
  for (let i = dateTimeDayOne.weekday - 1; i > 0; i--) {
    days.push({
      date: dateTimeDayOne.minus({ days: i }),
      activities: [],
    });
  }
  // Días del mes
  let dateTime = dateTimeDayOne;
  while (dateTime.month == month) {
    days.push({
      date: dateTime,
      activities: mapActivitiesByDate({
        activitiesByDate,
        subjectsByWeekDay,
        subjects,
        dateTime,
      }),
    });
    dateTime = dateTime.plus({ days: 1 });
  }
  // Dias del mes posterior
  const daysToCreate = (7 - dateTime.weekday + 1) % 7;
  for (let i = 0; i < daysToCreate; i++) {
    days.push({
      date: dateTime.plus({ days: i }),
      activities: [],
    });
  }
  const now = DateTime.now().set({
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

/**
 *
 * @param {{
 *  activities: Actividad[];
 *  year: number;
 *  month: number;
 *  day: number;
 *  subjects: Asignatura[];
 * }} options
 */
function buildDayCalendar(options) {
  const { year, month, day, activities, subjects } = options;
  const dateTime = DateTime.fromObject({
    year,
    month,
    day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const { activitiesByDate, subjectsByWeekDay } = groupActivitiesAndSubjects({
    activities,
    subjects,
    year,
    month,
  });
  return mapActivitiesByDate({
    activitiesByDate,
    subjectsByWeekDay,
    subjects,
    dateTime,
  });
}

module.exports = {
  buildMonthCalendar,
  buildDayCalendar,
  groupActivitiesAndSubjects,
}
