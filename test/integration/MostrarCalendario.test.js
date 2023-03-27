const axios = require('axios');



// prueba integracion HU mostrar Calendario
//hace redirect a /calendar/añoActual/mesActual y muestra calendario mes actual devuelve 200 OK
test('https://apperfectday.herokuapp.com responds with 200 OK', async () => {
  const response = await axios.get('https://apperfectday.herokuapp.com/')
  expect(response.status).toBe(200)
})




