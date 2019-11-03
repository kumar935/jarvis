const XPathValArr = [
  {
    "type": "text",
    "value": "284052306594",
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/INPUT[1]",
    "event": "input"
  },
  {
    "type": "text",
    "value": "Amx@1234",
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[2]",
    "event": "input"
  },
  {
    "type": "submit",
    "value": "",
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/BUTTON[1]",
    "event": "click"
  },
  {
    "waitUntil": 3000,
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]/A[1]/DIV[1]",
    "event": "click"
  },
  {
    "waitUntil": 800,
    "type": "text",
    "value": "test",
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/INPUT[2]",
    "event": "input"
  },
  {
    "type": "submit",
    "value": "",
    "xpath": "/html/body/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/BUTTON[2]",
    "event": "click"
  }
];

var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");
const serverUri = "https://appd3-kwt.amxremit.com/login";
var browser = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();

async function setSelectVal({ containerXPath, inputXPath, value }) {
  try {
    if (value) {
      let selectExt = await browser.findElement({ xpath: containerXPath });
      await selectExt.click();
      let selectInt = await browser.findElement({ xpath: inputXPath });
      await selectInt.sendKeys(value);
      await selectInt.sendKeys(Key.ENTER);
    }
  } catch (error) {
    console.error("error in setSelectVal: ", error);
  }
}

async function actions() {
  // giving the page a second to load
  await new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, 1000)
  );

  for (var i = 0; i < XPathValArr.length; i++) {


    let ele = XPathValArr[i];

    if(ele.waitUntil) {
      await new Promise(resolve => setTimeout(() => {resolve()}, ele.waitUntil));
    }

    //select
    if (ele.type == "select") {
      await setSelectVal(ele);
    }

    //text
    if (ele.type == "text") {
      try {
        await browser
          .findElement({ xpath: ele.xpath })
          .sendKeys(ele.value || "");
      } catch (error) {
        console.error("error in textInput set: ", error);
      }
    }

    if (ele.event == "click") {
      try {
        await browser
          .findElement({xpath: ele.xpath})
          .click();
      } catch (error) {
        console.error("error in click event: ", error);
      }
    }
 
  }

}

browser
  .get(serverUri)
  .then(actions)
  .catch(err => {
    console.error(err);
  });
