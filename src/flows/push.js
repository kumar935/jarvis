var webdriver = require("selenium-webdriver");
var { Builder, By, Key, until } = webdriver;
var chrome = require("selenium-webdriver/chrome");
var chromedriver = require("chromedriver");
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
require("geckodriver");
const serverUri = "http://localhost:5001/branch/app/push";
var browser = new webdriver.Builder()
  .usingServer()
  .withCapabilities({ browserName: "chrome" })
  .build();

async function actions() {
  let node = browser.findElement(By.name("Notification title"));
  let node2 = await browser.findElement({
    className: "btn btn-success pull-right"
  });
  let notifTitle = await browser.findElement({
    xpath: '/html/body/div/div/div/div[2]/section[2]/div/div[2]/div[1]/input'
  });//"/html/body/div[1]/div[1]/div[2]/div[2]/section[2]/div[1]/div[2]/div[1]/input[1]"
  let notifTxtArea = await browser.findElement({
    xpath: '/html/body/div/div/div/div[2]/section[2]/div/div[2]/div[2]/textarea'
  });
  let natSelectExt = await browser.findElement({
    xpath: '/html/body/div/div/div/div[2]/section[2]/div/div[2]/div[4]/div'
  });
  let natSelectTxtInput = await browser.findElement({
    xpath:
      "/html/body/div/div/div/div[2]/section[2]/div/div[2]/div[4]/div/div/div[1]/div[2]/div/input"
  });

  await notifTitle.sendKeys("asdf");
  await notifTxtArea.sendKeys("asdfasdf");
  await natSelectExt.click();
  await natSelectTxtInput.sendKeys("OTHERS");
  await natSelectTxtInput.sendKeys(Key.ENTER);

}

browser
  .get(serverUri)
  .then(actions)
  .catch(err => {
    console.error(err);
  });
