var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");
const defaultUrl = "https://appd3-kwt.amxremit.com/login";
var fs = require("fs");
var logs_loc = process.cwd() + "\\logs"
const log = require('log-to-file');

// https://stackoverflow.com/questions/32196788/webdriverjs-driver-manage-logs-getbrowser-returns-empty-array
var pref = new webdriver.logging.Preferences();

pref.setLevel('browser', webdriver.logging.Level.ALL); 
pref.setLevel('driver', webdriver.logging.Level.ALL); 
pref.setLevel('performance', webdriver.logging.Level.ALL); 

var browserMain = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .setLoggingPrefs(pref)
  .build();

async function setSelectVal({ containerXPath, xpath, value }) {
  try {
    if (value) {
      let selectExt = await browserMain.findElement({ xpath: containerXPath });
      await selectExt.click();
      let selectInt = await browserMain.findElement({ xpath: xpath });
      await selectInt.sendKeys(value);
      await selectInt.sendKeys(Key.DOWN);
      await selectInt.sendKeys(Key.ENTER);
    }
  } catch (error) {
    console.error("error in setSelectVal: ", error);
  }
}

async function actions({ XPathValArr }) {
  // giving the page a second to load
  await new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, 1000)
  );

  for (var i = 0; i < XPathValArr.length; i++) {
    let ele = XPathValArr[i];

    if (ele.waitUntil) {
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, ele.waitUntil)
      );
    }

    if (ele.waitUntilElement) {
      await new Promise(resolve => {
        let {duration, ...waitUntilConfig } = ele.waitUntilElement;
        browserMain.wait(until.elementLocated(waitUntilConfig, duration || 10000)).then(el => {
          resolve();
        }).catch(err => {
          resolve();
          console.error('error in waitUntilElement: ', err);
        })
      });
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 1000)
      );
    }

    //select
    if (ele.type == "select") {
      await setSelectVal(ele);
    }

    //text
    if (ele.type == "text") {
      try {
        await browserMain
          .findElement({ xpath: ele.xpath })
          .sendKeys(ele.value || "");
      } catch (error) {
        console.error("error in textInput set: ", error);
      }
    }

    if (ele.event == "click") {
      try {
        await browserMain.findElement({ xpath: ele.xpath }).click();
      } catch (error) {
        console.error("error in click event: ", error);
        console.error(
          "additional info label: ",
          ele.label,
          " value: ",
          ele.value,
          " event: ",
          ele.event
        );
      }
    }

    if(ele.event == "link") {
      try {
        await browserMain.navigate().to(ele.value);
      } catch (error) {
        console.error('error in link event: ', error);
      }
    }
  }
}

module.exports.runFlow = ({ browser, XPathValArr, startUrl }) => {
  browser = browser || browserMain;
  let url = startUrl || defaultUrl;

  browser.manage().window().maximize();
  return browser
    .get(url)
    .then(async () => {
      try {
        // browser.executeScript(`window.localStorage.setItem("debugConfig", '{"remoteJsUrl":"http://localhost:5001","dummyApi":false}')`);  
      } catch (error) {
        console.error('error in setting loc storage: ', error);
      }

      await actions({ XPathValArr });
      fs.readdir(process.cwd()+'\\logs', (err, files) => {
        log_files = files.length;
      });
      browser.manage().logs().get('driver').then(function(logs){
        var count = 1
        var i;
        for(i = 0; i < log_files; i++){
          if (fs.existsSync(logs_loc+'\\Driver_log'+count+'.log')) {
          count++;
          }
        }
        log(JSON.stringify(logs,4,4), logs_loc+'\\Driver_log'+count+'.log');

        for(var temp in logs){
          if(JSON.stringify(logs[temp]).indexOf("ERROR") > -1){
            var err_message = logs[temp]['message']
            console.log(err_message)
          }}
      });
      browser.manage().logs().get('performance').then(function(logs){
        var objectValue = JSON.parse(JSON.stringify(logs,4,4));
        var key = 'message'
        var listOfObjects = [];

        for(var idx in objectValue) {
          var item = objectValue[idx];
          if(JSON.stringify(item).indexOf('XHR') > -1){
            for(key in item) {
              var value = item[key];
              listOfObjects.push(value);
              var error_status = '\\\"status\\\":400';
              if(JSON.stringify(value).indexOf(error_status) > -1){
                var obj = JSON.parse(value);
                var error_code = obj['message']['params']['response']['headers']["x-exception-code"];
                console.log("Error: status 400 : ", error_code)
              }
        }}}
        var index = 1
        var i;
        for(i = 0; i < log_files; i++){
          if (fs.existsSync(logs_loc+'\\Browser_log'+index+'.log')) {
            index++;
            }
        }
        log(JSON.stringify(listOfObjects,4,4), logs_loc+'\\Browser_log'+index+'.log');
      });
      return browser;
    })
    .catch(err => {
      console.error(err);
    });
};
