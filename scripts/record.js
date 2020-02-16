var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
var args = process.argv.slice(2);
var urlArg = args[0];

let url = urlArg || "https://getbootstrap.com/docs/4.0/examples/checkout/";

var browser = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();

browser
  .get(url)
  .then(async () => {
    try {
      browser.executeScript(`
      (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.onload = function(){
            // remote script has loaded
        };
        script.src = 'https://doubular.s3.amazonaws.com/friday.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      }(document));
      `);
    } catch (error) {
      console.error("error in setting loc storage: ", error);
    }
    return browser;
  })
  .catch(err => {
    console.error(err);
  });
