"use strict";

const {groupActivitiesAndSubjects} = require('../../src/routes/buildMonthCalendar') ;
const actividades =[
  {_id:"examengps", titulo: "examen de gps", inicio: (2023,3,29,11,0),fin:(2023,3,29,13,0),color:"red",asignatura:"gestion de proyecto Software"},
  {_id:"examenbd", titulo: "examen de bd", inicio: (2024,3,30,11,0),fin:(2024,3,30,13,0),color:"yellow",asignatura:" base de dato"}
];

const asignaturas = [
{_id:"so", titulo:"sistema ooperativo", credito:6, color:"blue", horario:[{dia:1, inicio:(2023,3,27,18,0), fin:(2023,3,27,19,0)},{dia:2, inicio:(2023,3,28,18,0), fin:(2023,3,28,19,0)}]},
]

const options = {
  activities: actividades,
  subjects: asignaturas,
  year: 2023,
  month: 3,
}

 const respuesta = {
  activitiesByDate: {},
  subjectsByWeekDay: { '1': [ [Object] ], '2': [ [Object] ] }
}

 
test("Agrupa las actividades por dia y las asignaturas por dia de la semana de mes mayo y años 2023 ", () => { 
  expect(groupActivitiesAndSubjects(options)).toStrictEqual(respuesta)
 })