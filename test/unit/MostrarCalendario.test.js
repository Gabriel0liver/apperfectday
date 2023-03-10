"use strict";

const buildMonthCalendar = require('../../src/routes/buildMonthCalendar') ;

//parametros para crear calendario para el mes de diciembre del año 2000
 const options = {
   activities: [
     {
       from: new Date('December 17, 2000 09:30:00'),
       to: new Date('December 17, 2000 10:30:00'),
       title:'Preparar entrega GPS'
     },
   ],
   year: 2000,
   month: 12,
 }
//calendario para el mes de diciembre del año 2000 con unica actividad 'Preparar entrega GPS' el dia 17 
 const respuesta = [
   {
     day: 27,
     month: 11,
     year: 2000,
     isThisMonth: false,
     isToday: false,
     activities: [],
   },
   {
     day: 28,
     month: 11,
     year: 2000,
     isThisMonth: false,
     isToday: false,
     activities: [],
   },
   {
     day: 29,
     month: 11,
     year: 2000,
     isThisMonth: false,
     isToday: false,
     activities: [],
   },
   {
     day: 30,
     month: 11,
     year: 2000,
     isThisMonth: false,
     isToday: false,
     activities: [],
   },
   {
     day: 1,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 2,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 3,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 4,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 5,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 6,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 7,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 8,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 9,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 10,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 11,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 12,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 13,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 14,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 15,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 16,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 17,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: ['Preparar entrega GPS'],
   },
   {
     day: 18,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 19,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 20,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 21,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 22,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 23,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 24,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 25,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 26,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 27,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 28,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 29,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 30,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
   {
     day: 31,
     month: 12,
     year: 2000,
     isThisMonth: true,
     isToday: false,
     activities: [],
   },
 ]



//Prueba unitaria  para la clase de la HU Mostrar calendario
//Options :parametros para crear calendario para el mes de diciembre del año 2000
//respuesta: calendario para el mes de diciembre del año 2000 con unica actividad 'Preparar entrega GPS' el dia 17
test("calendario para el mes de diciembre del año 2000 con unica actividad 'Preparar entrega GPS' el dia 17", () => { 
  expect(buildMonthCalendar(options)).toStrictEqual(respuesta)
 })