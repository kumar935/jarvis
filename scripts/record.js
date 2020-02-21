var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
var args = process.argv.slice(2);
var urlArg = args[0];
const fs = require('fs');
const path = require('path');
let url = urlArg || "https://getbootstrap.com/docs/4.0/examples/checkout/";

var browser = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();
var fridayStr = fs.readFileSync(path.resolve(__dirname, '../src/friday/friday.js'), 'utf8')
browser
  .get(url)
  .then(async () => {
    try {
      browser.executeScript(fridayStr);
    } catch (error) {
      console.error("error in setting loc storage: ", error);
    }
    return browser;
  })
  .catch(err => {
    console.error(err);
  });
