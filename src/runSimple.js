const fs = require("fs");
const { runFlow } = require("./service/seleniumService");
var args = process.argv.slice(2);

let flow = args[0];

// var cp = require('child_process');
// cp.fork(__dirname + `/flows/${flow}.js`)

let rawdata = fs.readFileSync(__dirname + `/simpleFlows/${flow}.json`);
let flowData = JSON.parse(rawdata);
let {XPathValArr, startUrl} = flowData;

runFlow({ XPathValArr, startUrl ,flow});
