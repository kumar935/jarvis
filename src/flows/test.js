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

async function reactStuff() {
  let node = browser.findElement(By.name("Notification title"));
  let node2 = await browser.findElement({
    className: "btn btn-success pull-right"
  });
  let notifTitle = await browser.findElement({
    xpath: '//*[@id="app"]/div/div/div[1]/section[2]/div/div[2]/div[1]/input'
  });
  let notifTxtArea = await browser.findElement({
    xpath: '//*[@id="app"]/div/div/div[1]/section[2]/div/div[2]/div[2]/textarea'
  });
  let natSelectExt = await browser.findElement({
    xpath: '//*[@id="app"]/div/div/div[1]/section[2]/div/div[2]/div[4]/div'
  });
  let natSelectTxtInput = await browser.findElement({
    xpath:
      "/html/body/div/div/div/div[1]/section[2]/div/div[2]/div[4]/div/div[1]/div[1]/div/div/input"
  });

  await notifTitle.sendKeys("asdf");
  await notifTxtArea.sendKeys("asdfasdf");
  await natSelectExt.click();
  await natSelectTxtInput.sendKeys("OTHERS");
  await natSelectTxtInput.sendKeys(Key.ENTER);
  console.log("logging node2: ", node2);
  // node2.click();

  // console.log("logging node: ", node2);
  // node2.click();
  // let txt = node2.getText();
  // console.log('logging txt: ', txt);
  // ReactTestUtils.Simulate.change(ReactDom.findDOMNode(node), {target: {value: "bruh"}});
  // ReactTestUtils.Simulate.click(ReactDom.findDOMNode(node2));
}

browser
  .get(serverUri)
  .then(logTitle)
  .then(reactStuff)
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
