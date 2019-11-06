const { runFlow } = require("../service/seleniumService");
const { getObjFromFlowJson } = require("../service/utils");
let loginBranchFlowData = getObjFromFlowJson("branchLogin");
let loginBranch = getObjFromFlowJson("custManReg");

(async () => {

  let browser = await runFlow({
    XPathValArr: loginBranchFlowData.XPathValArr,
    startUrl: loginBranchFlowData.startUrl
  });

  await runFlow({
    browser,
    XPathValArr: loginBranch.XPathValArr,
    startUrl: browser.getCurrentUrl()
  });

  browser.findElement({xpath: "/html/body/div/div/div[1]/header/nav/div[2]/ul/li[2]/a"}).click();

})();
