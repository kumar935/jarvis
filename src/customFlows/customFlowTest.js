var test = require("selenium-webdriver/testing");
const { runSimpleFlow } = require("../service/seleniumService");
var { expect } = require("chai");
let driver;

describe("hooks", function() {
  after(function() {
    // runs after all tests in this block
    driver.quit();
  });
  // test cases
  it("Add Bene", async function() {
    this.timeout(60000 * 10);
    driver = await runSimpleFlow("addBeneTest");
    let titleDiv = await driver.findElement({ className: "title" });
    let title = await titleDiv.getAttribute("innerHTML");
    expect(title).equals("ERROR");
    driver.sleep();
  });
});
