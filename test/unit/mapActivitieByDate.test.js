"use strict";
const { DateTime } = require("luxon");
const {groupActivitiesAndSubjects} = require('../../src/routes/buildMonthCalendar') ;
const {mapActivitiesByDate} = require('../../src/routes/buildMonthCalendar') ;

const date = new DateTime(2023,3,28);

const actividades =[
  {_id:"examengps", titulo: "examen de gps", inicio: (2023,3,29,11,0),fin:(2023,3,29,13,0),color:"red",asignatura:"gestion de proyecto Software"},
  {_id:"examenbd", titulo: "examen de bd", inicio: (2024,3,30,11,0),fin:(2024,3,30,13,0),color:"yellow",asignatura:" base de dato"}
];

const asignaturas = [
{_id:"so", titulo:"sistema ooperativo", credito:6, color:"blue", horario:[{dia:1, inicio:(2023,3,27,18,0), fin:(2023,3,27,19,0)},{dia:2, inicio:(2023,3,28,18,0), fin:(2023,3,28,19,0)}]},
];

const year = 2023;

const month = 3

const { abd, sbw } = groupActivitiesAndSubjects({
  actividades,
  asignaturas,
  year,
  month,
}) ;

const options = {
  subjects: asignaturas,
  activitiesByDate: abd,
  subjectsByWeekDay: sbw,
  dateTime: date
  }


const respuesta = [

]

 
test("Agrupa las actividades por dia y las asignaturas por dia de la semana de mes diciembre y años 2012 ", () => { 
  expect(groupActivitiesAndSubjects(options)).toStrictEqual(respuesta)
 })