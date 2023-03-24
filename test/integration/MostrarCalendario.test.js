const axios = require('axios');



// prueba integracion HU mostrar Calendario
//hace redirect a /calendar/añoActual/mesActual y muestra calendario mes actual devuelve 200 OK
test('https://apperfectday.herokuapp.com responds with 200 OK', async () => {
  const response = await axios.get('https://apperfectday.herokuapp.com/')
  expect(response.status).toBe(200)
})


// prueba integracion HU mostrar Calendario
//con /calendar/2000/12 muestra calendario de 12 y 2000 devuelve 200 OK
/*test('https://apperfectday.herokuapp.com/calendar/2000/12 responds with 200 OK', async () => {
  const response = await axios.get(
    'https://apperfectday.herokuapp.com/calendar/3/2023'
  )
  expect(response.status).toBe(200)
})*/


// prueba integracion HU mostrar Calendario
//con /calendar/2000/12k campo mes no es valido debe devolver error
test('https://apperfectday.herokuapp.com/calendar/2000/12k responds with 404 Error', async () => {
  const response = await axios.get(
    'https://apperfectday.herokuapp.com/calendar/3/2023'
  )
  expect(response.status).toBe(404)
})

