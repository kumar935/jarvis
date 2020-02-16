# jarvis

node based selenium setup for running UI flows using JSON config

# Basic Idea

While using selenium, it's pretty tedious to go through the DOM and pick the xpath/id etc and write the selenium code to execute the flow. So one objective was to make this process easier in 2 ways:

- Record the steps done on UI using an injected js utility.
- Record it in a format that can be easily edited and is more readable. Something like this:

```json
{
  "type": "text",
  "value": "Some value",
  "label": "form-control",
  "xpath": "/html/body/DIV[1]/DIV[2]/DIV[2]/FORM[1]/DIV[1]/DIV[1]/INPUT[1]",
  "event": "input"
},
{
  "waitUntil": 200,  
  "type": "text",
  "value": "that was",
  "label": "form-control",
  "xpath": "/html/body/DIV[1]/DIV[2]/DIV[2]/FORM[1]/DIV[1]/DIV[2]/INPUT[1]",
  "event": "input"
},
{
  "waitForEle": {
    "id": "someIdToWaitForBeforeThisStepHappens"  
  },
  "type": "text",
  "value": "typed",
  "label": "form-control",
  "xpath": "/html/body/DIV[1]/DIV[2]/DIV[2]/FORM[1]/DIV[2]/DIV[1]/INPUT[1]",
  "event": "input"
}
```

##### How To Record

After setup is done, run the following command `yarn run record`. This will take you to an example bootstrap form where you will see the recording utility in the bottom left which was injected into the website using selenium itself.

- Click on record
- Fill out the fields
- Once done click stop
- The recorded JSON path config will be copied in your clipboard
- Create a new json file inside the `simpleFlows` folder in the project and paste it.
- To re run this flow run this command `yarn run simpleFlow {nameOfJsonFile}`

> There is already a saved flow for the bootstrap form you can simple run it using `yarn run simpleFlow bootstrapEx`.


### Prerequisites

##### Windows

- node, npm or yarn are needed for this. Follow further steps to install node.
- For windows install node from [here](https://nodejs.org/en/download/)

##### Mac or Linux

- install nvm using instructions from [here](https://github.com/nvm-sh/nvm)
- using nvm install node and npm, then install yarn from [here](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

##### Setting up

- clone this repository or download it from github.
- go to the base directory of the project and run `npm install` or `yarn`
- if everything goes well, setup is done

### Test Cases

The recorded flows can be used along with a testing library to write test cases like this:

```javascript

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


```

### Commands

- to record a flow from a website run `yarn run record {website url}` (Currently only works for single page applications)
- to run a simple flow from json files for example `branchLogin` use: `npm run simpleFlow branchLogin`. 
- to run a custom test case `yarn run mocha path/to/testcase.js`


### Useful Links

- useful for By.js: https://stackoverflow.com/questions/36869816/what-is-by-js-locator-for-in-protractor-webdriverjs
- hover https://gist.github.com/umaar/9051143
- selenium webdriver doc: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html
- several ways to set text in the question itself and answer: https://stackoverflow.com/questions/25583641/set-value-of-input-instead-of-sendkeys-selenium-webdriver-nodejs
