
const fs = require("fs");

module.exports.getObjFromFlowJson = flow => {
    let rawdata = fs.readFileSync(__dirname + `/../simpleFlows/${flow}.json`);
    let flowData = JSON.parse(rawdata);
    return flowData;
}



