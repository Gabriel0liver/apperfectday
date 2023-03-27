"use strict";

const {groupActivitiesAndSubjects} = require('../../src/routes/buildMonthCalendar') ;
const options = {
    activities: [],
    subjects: [],
    year: 2012,
    month: 12,
  }
 const respuesta = { activitiesByDate: {}, subjectsByWeekDay: {} }

 
test("Agrupa las actividades por dia y las asignaturas por dia de la semana de mes diciembre y años 2012 ", () => { 
  expect(groupActivitiesAndSubjects(options)).toStrictEqual(respuesta)
 })