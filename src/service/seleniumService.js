var webdriver = require("selenium-webdriver");
var path = require("path");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
const { getFlowData } = require("../service/utils");
const { readCSV } = require("../utils/readCSV");
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");
const defaultUrl = "https://appd3-kwt.amxremit.com/login";
let token = `xoxb-253198866083-918230041412-AOB79C4XFtc2CTQbqtcTP6pB`;
let slackUrl = `https://slack.com/api/conversations.history?token=${token}&channel=C9AK11W2K&limit=50&pretty=1`;

var fs = require("fs");
var logs_loc = process.cwd() + "/logs";
const log = require("log-to-file");
var listofJson;
// https://stackoverflow.com/questions/32196788/webdriverjs-driver-manage-logs-getbrowser-returns-empty-array
var pref = new webdriver.logging.Preferences();
var endofJSON = 0;
var LOGS_UPDATE_INTERVAL = 1000;
var WRITE_BROWSER_LOGS = false;
var WRITE_DRIVER_LOGS = false;
pref.setLevel("browser", webdriver.logging.Level.ALL);
pref.setLevel("driver", webdriver.logging.Level.ALL);
pref.setLevel("performance", webdriver.logging.Level.ALL);

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
  } catch (error) {}
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
        browserMain
          .wait(until.elementLocated(waitUntilConfig, duration || 10000))
          .then(el => {
            resolve();
          })
          .catch(err => {
            resolve();
          });
      });
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 1000)
      );
    }

    if (ele.waitUntilApi) {
      var apiName = ele.waitUntilApi["api"];
      var re = new RegExp(apiName, "g");
      var count = (listofJson.match(re) || []).length;
      await new Promise(resolve => {
        if (count % 2 == 0 && count > 1) {
          resolve();
        } else {
          setTimeout(() => {
            resolve();
          }, 3000);
        }
      });
      count = 0;
    }

    //select
    if (ele.type == "select") {
      await setSelectVal(ele);
    }

    //otp
    if (ele.type == "otp") {
      try {
          await browserMain.wait(until.elementIsEnabled(browserMain.findElement({xpath: ele.xpath2})));
          await new Promise(resolve =>setTimeout(() => {resolve();}, 2000));
          var otp = await browserMain.findElement({xpath: ele.xpath1}).getAttribute('value');
          otp = otp.replace("-", "");
          console.log(otp);
          if(otp == ""){
            otp = "Invalid";
            console.log("otp-prefix not captured. Enter otp manually")
          }
          else{
            await new Promise(resolve =>setTimeout(() => {resolve();}, 1000));//wait for slack
            // let url = "https://slack.com/api/conversations.history?token=xoxb-253198866083-918230041412-I4LosIQcAy8NrNGERitOwKv0&channel=C9AK11W2K&limit=50&pretty=1";
            const fetch = require("node-fetch");
            let newOTP = "0";
            fetch(slackUrl)
                .then(resp => resp.json())
                .then(data => {{
                    var test = data['messages'];
                    // console.log(data);
                    for (var abc in test) {
                      if (JSON.stringify(test[abc]).indexOf(otp) > -1) {
                        var messages = test[abc]
                        var text = JSON.stringify(messages['attachments'][0]['text'],4,4)
                        newOTP = (text.substring(text.indexOf(otp) + otp.length+1, text.lastIndexOf(".\"")));
                        console.log("OTP captured: "+otp+"-"+newOTP)
                      }
                    }               
                    browserMain
                      .findElement({ xpath: ele.xpath2 })
                      .sendKeys(newOTP);
              }})}
      }catch(error){
        console.log(error);
      }
    }

    //text
    if (ele.type == "text") {
      try {
        await browserMain
          .findElement({ xpath: ele.xpath })
          .sendKeys(ele.value || "");
      } catch (error) {}
    }

    if (ele.event == "click") {
      try {
        await browserMain.findElement({ xpath: ele.xpath }).click();
      } catch (error) {}
    }

    if (ele.event == "link") {
      try {
        await browserMain.navigate().to(ele.value);
      } catch (error) {}
    }

    if (ele.type == "toastResults") {
      let eleLocator = { className: "custom-toast" };
      await browserMain.wait(until.elementLocated(eleLocator, 10000));
      // let toastContainer = await browserMain.findElement(eleLocator);
      // let titleDiv = await toastContainer.findElement({className: "title"});
      // let descDiv = await toastContainer.findElement({className: "desc"});
      // let title = await titleDiv.getAttribute("innerHTML");
      // let desc = await descDiv.getAttribute("innerHTML");
      let toastContainers = await browserMain.findElements(eleLocator);
      toastContainers.forEach(async t => {
        let titleDiv = await t.findElement({ className: "title" });
        let descDiv = await t.findElement({ className: "desc" });
        let title = await titleDiv.getAttribute("innerHTML");
        let desc = await descDiv.getAttribute("innerHTML");
        console.log("logging title, desc: ", title, desc);
      });
      console.log("logging toastContainer: ", titleDiv);
      console.log("logging title, desc: ", title, desc);
    }

    if (i == XPathValArr.length - 1) {
      endofJSON = 1;
    }
  }
}

const runFlow = async({ browser, XPathValArr, startUrl, flow }) => {
  browser = browser || browserMain;
  let url = startUrl || defaultUrl;
  var err_message = "";
  browser
    .manage()
    .window()
    .maximize();
//   browser
//     .get(url)
//     .then(async () => {
//       initLogs();
//       console.log("logging 1");
//       await actions({ XPathValArr });
//       console.log("logging 2");
//       printFinalLogs();
//       return browser;
//     })
//     .catch(err => {
//       console.log("logging err: ", err);
//     });
  
  try {
    await browser.get(url);
    initLogs();
    await actions({ XPathValArr });
    printFinalLogs();
    return browser;
  } catch (error) {
    
  }
}

module.exports.runSimpleFlow = async flowName => {
  let flowData = getFlowData(flowName);
  let { XPathValArr, startUrl } = flowData;
  return await runFlow({ XPathValArr, startUrl });
};

function getXPathValArrWithTestCase(XPathValArr, testCaseObj) {
  return XPathValArr.map(item => {
    if(item.id && testCaseObj[item.id]){
      item.value = testCaseObj[item.id];
    }
    return item;
  })
}

module.exports.runFlowWithTestCases = async (flowName, index = null) => {
  console.log(flowName);
  let flowData = getFlowData(flowName);
  let testCases = await readCSV(flowName);
  let testCasesCount = testCases.length;
  
  let { XPathValArr, startUrl } = flowData;

  if(index !== null){
    let newXPathValArr = getXPathValArrWithTestCase(XPathValArr, testCases[index]);
    return await runFlow({ XPathValArr: newXPathValArr, startUrl });
  }

  for(let testCaseIndex = 0; testCaseIndex < testCasesCount; testCaseIndex++){
    let newXPathValArr = getXPathValArrWithTestCase(XPathValArr, testCases[testCaseIndex]);
    await runFlow({ XPathValArr: newXPathValArr, startUrl });
  }

  return browserMain;

  // return await runFlow({ XPathValArr, startUrl });
};

function ensureDirectoryExistence(filePath) {
  // console.log(filePath);
  var dirname = path.dirname(filePath);
  // console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

module.exports.runFlow = runFlow;


var timestamp = Date.now();
function get_driver_logs() {
  browser
    .manage()
    .logs()
    .get("driver")
    .then(function(driver_logs) {
      driver_log_path =
        logs_loc + "/" + flow + "_" + timestamp + "_Driver_log.log";
      ensureDirectoryExistence(driver_log_path);
      // console.log("driver_log_path: ", driver_log_path);
      fs.appendFileSync(driver_log_path, JSON.stringify(driver_logs, 4, 4));
      for (var xyz in driver_logs) {
        if (JSON.stringify(driver_logs[xyz]).indexOf("ERROR") > -1) {
          err_message += driver_logs[xyz]["message"];
        }
      }
    });
}

function get_browser_logs() {
  browser
    .manage()
    .logs()
    .get("performance")
    .then(function(browser_logs) {
      var key = "message";
      browser_log_path =
        logs_loc + "/" + flow + "_" + timestamp + "_Browser_log.log";
      ensureDirectoryExistence(browser_log_path);
      // console.log("browser_log_path: ", browser_log_path);
      for (var idx in browser_logs) {
        var item = browser_logs[idx];
        if (JSON.stringify(item).indexOf("XHR") > -1) {
          for (key in item) {
            var value = item[key];
            if (JSON.stringify(value).indexOf("message") > -1) {
              var object = JSON.parse(value);
              var message = object["message"];

              var reducedMessage = {
                method: message.method,
                documentURL: message.params.documentURL,
                ...(message.params.request
                  ? {
                      requestUrl: message.params.request.url,
                      method: message.params.request.method,
                      postData: message.params.request.postData
                    }
                  : {}),
                ...(message.params.response
                  ? {
                      requestUrl: message.params.response.url,
                      status: message.params.response.status,
                      statusText: message.params.response.statusText
                    }
                  : {})
              };
              // console.log('logging JSON.stringify(reducedMessage: ', JSON.stringify(reducedMessage));
              listofJson += "\n\n" + JSON.stringify(reducedMessage, null, 4);
            }
            var error_status = '\\"status\\":400';
            if (JSON.stringify(value).indexOf(error_status) > -1) {
              var obj = JSON.parse(value);
              error_code =
                obj["message"]["params"]["response"]["headers"][
                  "x-exception-code"
                ];
              error_code = "Error: status 400 : " + JSON.stringify(error_code);
            }
          }
        }
      }
      fs.writeFileSync(browser_log_path, listofJson);
    });
}

function printFinalLogs() {
  if (endofJSON == 1 && (WRITE_BROWSER_LOGS || WRITE_DRIVER_LOGS)) {
    setTimeout(() => {
      clearInterval(x);
      clearInterval(y);

      //No Errors.
      if (err_message !== "" && typeof error_code !== "undefined") {
        fs.appendFileSync(browser_log_path, "\n" + error_code);
        fs.appendFileSync(
          driver_log_path,
          "\n" + err_message + "\nFlow Incomplete"
        );
        console.log("Errors in Browser Logs. " + error_code);
        console.log("\nErrors in Driver Logs. \nFlow Incomplete");
      }

      //Errors in Driver:
      else if (err_message !== "" && typeof error_code == "undefined") {
        fs.appendFileSync(
          driver_log_path,
          "\n" + err_message + "\nFlow Incomplete\n----"
        );
        console.log("\nFlow Incomplete. Errors in Driver Logs.");
        fs.appendFileSync(
          browser_log_path,
          "\nNo Browser error, but Flow Incomplete."
        );
      }

      //Errors in Browser:
      else if (err_message == "" && typeof error_code !== "undefined") {
        fs.appendFileSync(browser_log_path, "\n" + error_code);
        fs.appendFileSync(
          driver_log_path,
          "\nNo Driver error, but Flow Incomplete."
        );
        console.log("Flow Incomplete. Errors in Browser Logs. " + error_code);
      }

      //No Errors.
      else if (err_message == "" && typeof error_code == "undefined") {
        fs.appendFileSync(browser_log_path, "\nFlow Complete");
        fs.appendFileSync(driver_log_path, "\nFlow Complete");
        console.log("\nNo Errors. Flow Complete");
      }
    }, 3000);
  }
}


function initLogs(){
  if (WRITE_BROWSER_LOGS) {
    x = setInterval(get_browser_logs, LOGS_UPDATE_INTERVAL);
  }
  if (WRITE_DRIVER_LOGS) {
    y = setInterval(get_driver_logs, LOGS_UPDATE_INTERVAL);
  }
}