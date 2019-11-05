const { runFlow } = require("../service/seleniumService")

const XPathValArr = [
  {
    type: "text",
    value: "284052306594",
    xpath:
      "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/INPUT[1]",
    event: "input"
  },
  {
    type: "text",
    value: "Amx@1234",
    xpath:
      "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[2]",
    event: "input"
  },
  {
    type: "submit",
    value: "",
    xpath:
      "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/BUTTON[1]",
    event: "click"
  },
  {
    waitUntil: 3000,
    xpath:
      "/html/body/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]/A[1]/DIV[1]",
    event: "click"
  },
  {
    waitUntil: 800,
    type: "text",
    value: "test",
    xpath:
      "/html/body/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/INPUT[2]",
    event: "input"
  },
  {
    type: "submit",
    value: "",
    xpath: "/html/body/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/BUTTON[2]",
    event: "click"
  }
];

(async () => {

    let browser = await runFlow({XPathValArr});
    runFlow({browser, XPathValArr});

})()


