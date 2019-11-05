var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");
const defaultUrl = "https://appd3-kwt.amxremit.com/login";
var browserMain = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();

async function setSelectVal({ containerXPath, xpath, value }) {
  try {
    if (value) {
      let selectExt = await browserMain.findElement({ xpath: containerXPath });
      await selectExt.click();
      let selectInt = await browserMain.findElement({ xpath: xpath });
      await selectInt.sendKeys(value);
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
        console.error('additional info label: ', ele.label, " value: ", ele.value, " event: ", ele.event);
      }
    }
  }
}

module.exports.runFlow = ({browser, XPathValArr, startUrl}) => {
  browser = browser || browserMain;
  let url = startUrl || defaultUrl;
  return browser
    .get(url)
    .then(async () => {
        await actions({XPathValArr});
        return browser;
    })
    .catch(err => {
      console.error(err);
    });
  
}
