# jarvis

node based selenium setup for running UI flows


### Prerequisites

- node, npm and yarn are needed for this
- install nvm using instructions from [here](https://github.com/nvm-sh/nvm)
- using nvm install node and npm, then install yarn from [here](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
- clone this repository using or download it from gitlab
- go to the base directory of the project and run `yarn`
- if everything goes well, setup is done


### Usage

- before running a flow, check the flows inside the `src/flows` folder. Check the `serverUri` variable which contains the url to the web app where the flow will run. Make sure it is a valid url that is working on your system and you are logged in.
- to run a flow, for example `cust_reg` use the command: `yarn run flow cust_reg`.
