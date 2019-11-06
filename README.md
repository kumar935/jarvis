# jarvis

node based selenium setup for running UI flows


### Prerequisites

- node, npm and yarn are needed for this
- install nvm using instructions from [here](https://github.com/nvm-sh/nvm)
- using nvm install node and npm, then install yarn from [here](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
- clone this repository or download it from gitlab
- go to the base directory of the project and run `yarn`
- if everything goes well, setup is done


### Usage

- before running a flow, check the flows inside the `src/flows` folder. Check the `serverUri` variable which contains the url to the web app where the flow will run. Make sure it is a valid url that is working on your system and you are logged in.
- to run a flow, for example `cust_reg` use the command: `yarn run flow cust_reg`.


### PPT

- What is selenium and how it is used.
- Difficulties while using selenium: Dynaic UI elements, non native inputs usage etc
- Simplifying writing selenium flows: describe the array structure. (Also run it. We can show cust_reg from localhost:5001) 
- Tooling to create this array structure. npm runSimple xyz.json. (Show the recording thing and then run it for same localhost:5001)
- But this was from a local server using dummy APIs which are instantaneous. For an actual use case things there are complications, no friday on sso, can't get otp directly so talk about how we solved that in loginCustReg.json (show loginCustReg.js)
- waitUntil, waitUntilElement, npm run flow customFlow.

