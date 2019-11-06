/**
 * Dependency Modules
 */

// useful for By.js: https://stackoverflow.com/questions/36869816/what-is-by-js-locator-for-in-protractor-webdriverjs
// hover https://gist.github.com/umaar/9051143
// selenium webdriver doc: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html

// several ways to set text in the question itself and answer: https://stackoverflow.com/questions/25583641/set-value-of-input-instead-of-sendkeys-selenium-webdriver-nodejs

var assert = require("assert").strict;
var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;

var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");

// Application Server
const serverUri = "http://localhost:5001/branch/app/push";
const appTitle = "Branch";
const DELAY = 10000;
/**
 * Config for Chrome browser
 * @type {webdriver}
 */
var browser = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();

/**
 * Config for Firefox browser (Comment Chrome config when you intent to test in Firefox)
 * @type {webdriver}
 */
/*
var browser = new webdriver.Builder()
	.usingServer()
	.withCapabilities({ browserName: "firefox" })
	.build();
 */

/**
 * Function to get the title and resolve it it promise.
 * @return {[type]} [description]
 */
function logTitle() {
  console.log("logTitle");
  return new Promise((resolve, reject) => {
    browser
      .getTitle()
      .then(function(title) {
        console.log("title", title);
        resolve(title);
      })
      .catch(err => {
        console.error("error in logTitle", err);
      });
  });
}

async function actions() {
  let notifTitleInput = await browser.findElement({
    xpath: "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[2]/SECTION[2]/DIV[1]/DIV[2]/DIV[1]/INPUT[1]"
  });
  let notifTxtArea = await browser.findElement({
    xpath: "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[2]/SECTION[2]/DIV[1]/DIV[2]/DIV[2]/TEXTAREA[1]"
  });
  let submitBtn = await browser.findElement({
    xpath:
    "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[2]/SECTION[2]/DIV[1]/DIV[3]/BUTTON[1]"
  });
  await notifTitleInput.sendKeys("test1");
  await notifTxtArea.sendKeys("test2");
  await submitBtn.click();
}

browser
  .get(serverUri)
  .then(logTitle)
  .then(actions)
  .then(title => {
    assert.strictEqual(title, appTitle);
    console.log("2nd then", title, appTitle);
    setTimeout(() => done(), DELAY - 1000);
    // done();
    // resolve();
  })
  .catch(err => {
    console.error(err);
    setTimeout(() => done(), DELAY - 1000);
    // done();
    // reject(err)
  });
