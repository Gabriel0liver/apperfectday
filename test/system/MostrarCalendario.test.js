const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
require('chromedriver')

describe('system test', () => {
  let driver;

  beforeAll(async () => {
    const options = new Options();
    options.headless();

    driver = await new Builder().forBrowser('chrome').build()
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should check response status', async () => {
    const url = 'https://apperfectday.herokuapp.com'
    const expectedStatus = 200;
await driver.get(url);
    // Execute an HTTP request and return the response status code
    const statusCode = await driver.executeAsyncScript(function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = function() {
        callback(xhr.status);
      };
      xhr.send();
    }, url);

    // Check that the response status code is the expected one
    expect(statusCode).toBe(expectedStatus);
  });
});