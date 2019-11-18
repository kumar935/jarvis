# jarvis

node based selenium setup for running UI flows


### Prerequisites

##### Windows
- node, npm or yarn are needed for this. Follow further steps to install node.
- For windows install node from [here](https://nodejs.org/en/download/)

##### Mac or Linux
- install nvm using instructions from [here](https://github.com/nvm-sh/nvm)
- using nvm install node and npm, then install yarn from [here](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

##### Setting up
- clone this repository or download it from gitlab.
- go to the base directory of the project and run `npm install` or `yarn`
- if everything goes well, setup is done


### Usage

- before running a flow, check the flows inside the `src/flows` folder. Check the `serverUri` variable which contains the url to the web app where the flow will run. Make sure it is a valid url that is working on your system and you are logged in.
- to run a flow, for example `generic_flow` use the command: `npm run flow generic_flow`.
- to run a simple flow from json files for example `branchLogin` use: `npm run simpleFlow branchLogin`.


### Useful Links

- useful for By.js: https://stackoverflow.com/questions/36869816/what-is-by-js-locator-for-in-protractor-webdriverjs
- hover https://gist.github.com/umaar/9051143
- selenium webdriver doc: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html
- several ways to set text in the question itself and answer: https://stackoverflow.com/questions/25583641/set-value-of-input-instead-of-sendkeys-selenium-webdriver-nodejs


