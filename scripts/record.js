var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");

let url = "https://www.google.com";

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
        script.src = 'https://cdnb-kwt.almullaexchange.com/envf/owa-branch/dist/main.bundle.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      }(document));
      `);
    } catch (error) {
      console.error("error in setting loc storage: ", error);
    }
    await actions({ XPathValArr });
    return browser;
  })
  .catch(err => {
    console.error(err);
  });
