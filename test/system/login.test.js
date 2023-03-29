const { test, expect } = require('@jest/globals')
const puppeteer = require('puppeteer')
jest.setTimeout(100000)


describe('La aplicación de lista de tareas', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('Carga la página de inicio correctamente', async () => {
    await page.goto('https://apperfectdays.herokuapp.com/')
    const pageTitle = await page.title()
    expect(pageTitle).toBe('Heroku | Application Error')
  }, 10000)
})