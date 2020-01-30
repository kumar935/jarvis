const fs = require("fs");

module.exports.getObjFromFlowJson = flow => {
  let rawdata = fs.readFileSync(__dirname + `/../simpleFlows/${flow}.json`);
  let flowData = JSON.parse(rawdata);
  return flowData;
};

module.exports.getFlowData = (flow) => {
  var args = process.argv.slice(2);
  flow = flow || args[0];
  let rawdata = fs.readFileSync(__dirname + `/../simpleFlows/${flow}.json`);
  return JSON.parse(rawdata);
};
