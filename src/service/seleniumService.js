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
var listofJson;
// https://stackoverflow.com/questions/32196788/webdriverjs-driver-manage-logs-getbrowser-returns-empty-array
var pref = new webdriver.logging.Preferences();
var endofJSON=0;
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
        let { duration, ...waitUntilConfig } = ele.waitUntilElement;
        browserMain.wait(until.elementLocated(waitUntilConfig, duration || 10000)).then(el => {
          resolve();
        }).catch(err => {
          resolve();
        })
      });
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 1000)
      );
    }

    if (ele.waitUntilApi) {
      var temp = ele.waitUntilApi['api']
      var re = new RegExp(temp, 'g');
      var count = (listofJson.match(re) || []).length;
      await new Promise(resolve => {
        if (count % 2 == 0 && count > 1) {
          resolve();
        } else {
          setTimeout(() => {
            resolve();
          }, 2000)
        }
      })
      count = 0;
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
      }
    }

    if (ele.event == "click") {
      try {
        await browserMain.findElement({ xpath: ele.xpath }).click();
      } catch (error) {
      }
    }

    if (ele.event == "link") {
      try {
        await browserMain.navigate().to(ele.value);
      } catch (error) {
      }
    }
    if(i==(XPathValArr.length-1)){
      endofJSON=1;
    }
  }
}

module.exports.runFlow = ({ browser, XPathValArr, startUrl, flow }) => {
  browser = browser || browserMain;
  let url = startUrl || defaultUrl;
  var err_message = ""
  browser.manage().window().maximize();
  return browser
    .get(url)
    .then(async () => {
      var timestamp = Date.now()

      x = setInterval(get_browser_logs, 500);
      y = setInterval(get_driver_logs, 500)

      await actions({ XPathValArr });
      if(endofJSON==1){
        setTimeout(() => {
          clearInterval(x);
          clearInterval(y);
          
          if (err_message !== "" && typeof error_code !== "undefined") {
            fs.appendFileSync(browser_log_path, listofJson + "\n" + error_code)
            fs.appendFileSync(driver_log_path, "\n" + err_message + "\nFlow Incomplete");
            console.log("Errors in Browser Logs. " + error_code)
            console.log("\nErrors in Driver Logs. \nFlow Incomplete")
          }
    
          //Errors in Driver:
          else if (err_message !== "" && typeof error_code == "undefined") {
            fs.appendFileSync(driver_log_path, "\n" + err_message + "\nFlow Incomplete\n----");
            console.log("\nFlow Incomplete. Errors in Driver Logs.")
            fs.appendFileSync(browser_log_path, listofJson + "\nNo Browser error, but Flow Incomplete.")
    
          }
    
          //Errors in Browser:
          else if (err_message == "" && typeof error_code !== "undefined") {
            fs.appendFileSync(browser_log_path, listofJson + "\n" + error_code)
            fs.appendFileSync(driver_log_path, "\nNo Driver error, but Flow Incomplete.");
            console.log("Flow Incomplete. Errors in Browser Logs. " + error_code)
          }
          else if (err_message == "" && typeof error_code == "undefined"){
            fs.appendFileSync(browser_log_path, listofJson + "\nFlow Complete")
            fs.appendFileSync(driver_log_path, "\nFlow Complete");
            console.log("\nNo Errors. Flow Complete")
          }

        },1000)
      
      }

      function get_driver_logs() {
        browser.manage().logs().get('driver').then(function (driver_logs) {
          driver_log_path = logs_loc + '\\' + flow + '_' + timestamp + '_Driver_log.log';
          fs.appendFileSync(driver_log_path, JSON.stringify(driver_logs, 4, 4));
          for (var temp in driver_logs) {
            if (JSON.stringify(driver_logs[temp]).indexOf("ERROR") > -1) {
              err_message += driver_logs[temp]['message']
            }
          }
        });
      }

      function get_browser_logs() {
        browser.manage().logs().get('performance').then(function (browser_logs) {
          var key = 'message'
          browser_log_path = logs_loc + '\\' + flow + '_' + timestamp + '_Browser_log.log';
          for (var idx in browser_logs) {
            var item = browser_logs[idx];
            if (JSON.stringify(item).indexOf('XHR') > -1) {
              for (key in item) {
                var value = item[key];
                if (JSON.stringify(value).indexOf("message") > -1) {
                  var object = JSON.parse(value);
                  var message = object['message']
                  listofJson += "\n\n" + JSON.stringify(message);
                }
                var error_status = '\\\"status\\\":400';
                if (JSON.stringify(value).indexOf(error_status) > -1) {
                  var obj = JSON.parse(value);
                  error_code = obj['message']['params']['response']['headers']["x-exception-code"];
                  error_code = "Error: status 400 : " + JSON.stringify(error_code);
                }
              }
            }
          }
        });
      }

      return browser;
    })
    .catch(err => {
    });
};
