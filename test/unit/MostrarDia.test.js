"use strict";

const {buildDayCalendar} = require('../../src/routes/buildMonthCalendar') ;

//parametros para crear calendario para el dia 31 de diciembre del año 2012
const options = {
    activities: [],
    year: 2012,
    month: 12,
    day:31,
    subjects: []
  }
//calendario para el mes de diciembre del año 2000 con unica actividad 'Preparar entrega GPS' el dia 17 
 const respuesta = [
   
 ]



//Prueba unitaria  para la clase de la HU Mostrar calendario
//Options :parametros para crear calendario para el dia 31 de diciembre del año 2012
//respuesta: calendario para el dia 31 de diciembre del año 2012 
test("calendario para el dia 31 de diciembre del año 2012 ", () => { 
  expect(buildDayCalendar(options)).toStrictEqual(respuesta)
 })