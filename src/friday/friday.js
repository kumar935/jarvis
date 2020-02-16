(function() {
  document.body.innerHTML += `
  <div
    class="friday-container"
    id="friday-container"
    onload="fridayEventListeners"
    style="position: fixed; bottom: 0px; z-index: 1100; background: rgba(0, 0, 0, 0.68); font-family: sans-serif; left: 0;"
  >
    <div style="margin: 10px;" id="friday-fields">
      <h6 style="color: rgb(255, 255, 255); text-align: center;">
        Selenium Tools
      </h6>
      <textarea style="position: fixed; left: -5000px;"></textarea>
      <div
        class="checkbox"
        id="record-clicks"
        style="color: rgb(255, 255, 255); margin-top: 10px; font-size: 12px;"
      >
        <label
          ><input type="checkbox" name="recordClicks" id="recordClicks" />&nbsp;
          Record Clicks</label
        >
      </div>
      <br />
      <button id="friday-record">Record</button>
      &nbsp;&nbsp;
      <button id="friday-stop" disabled>
        Stop
      </button>
    </div>
  
    <span
      id="friday-open-close"
      style="color: white;
      padding: 5px 6px;
      background: black;
      float: right;
      position: absolute;
      right: -18px;
      bottom: -1px;
      cursor: pointer;
      font-size: 11px;"
    >
      X
    </span>
  </div>
  `;

  let startUrl;
  let recordedPaths = [];
  let recordClicks = false;
  let clipboardInput = null;
  let fridayContainer = document.getElementById("friday-container");
  let fridayFields = document.getElementById("friday-fields");
  let recordBtn = document.getElementById("friday-record");
  let stopBtn = document.getElementById("friday-stop");
  let recordClicksCheck = document.getElementById("record-clicks");
  let fridayOpenCloseBtn = document.getElementById("friday-open-close");

  // window.addEventListener("load", event => {
    //the event occurred
    // console.log('logging friday loaded');
    recordBtn.addEventListener("click", onClickRecord);
    stopBtn.addEventListener("click", onClickStop);
    recordClicksCheck.addEventListener("change", onChangeRecordClickCheck);
    fridayOpenCloseBtn.addEventListener("click", onClickFridayOpenClose);
    clipboardInput = document.querySelector(".friday-container textarea");
  // });


  function onClickFridayOpenClose(e) {
    if (fridayFields.style.display === "none") {
      fridayFields.style.display = "block";
      fridayOpenCloseBtn.innerHTML = "X";
    } else {
      fridayFields.style.display = "none";
      fridayOpenCloseBtn.innerHTML = ">";
    }
  }

  function getPathTo(element) {
    // if (element.id!=='')
    //     return 'id("'+element.id+'")';
    if (element.tagName == "HTML") return "/html";
    if (element === document.body) return "/html/body";
    if (!element.parentNode) return ""; //this could happen if dom instantly changed while calculating path. So this will return a wrong xPath, but good enough to determine if it was an anchor tag.

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === element)
        return (
          getPathTo(element.parentNode) +
          "/" +
          element.tagName +
          "[" +
          (ix + 1) +
          "]"
        );
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
  }

  function onClickRecord() {
    startUrl = window.location.href;
    recordBtn.setAttribute("disabled", true);
    stopBtn.removeAttribute("disabled");
    document.addEventListener("keyup", onDocKeyUp);
    document.addEventListener("click", onDocClick);
    document.addEventListener("change", onDocChange);
  }

  function onClickStop() {
    let finalObj = {
      startUrl: startUrl,
      XPathValArr: recordedPaths
    };
    recordBtn.removeAttribute("disabled");
    stopBtn.setAttribute("disabled", true);
    console.log("logging recordedPaths: ", finalObj);
    copyToClipboard(finalObj);
    document.removeEventListener("keyup", onDocKeyUp);
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("change", onDocChange);
  }

  function onChangeRecordClickCheck(e) {
    console.log("record clicks: ", e.target.checked);
    recordClicks = e.target.checked;
  }

  function onClickGetValueMap() {
    // let valueMap = {
    //   selectInputs: [],
    //   textInputs: {},
    //   dateInputs: {}
    // };
    let valueArr = [];
    //all the inputs ordered
    let allInputs = document.querySelectorAll(
      ".select-box, .ff-txt input[type='text'], .ff-date input[type='text']"
    );

    for (let i = 0; i < allInputs.length; i++) {
      let input = allInputs[i];
      //select
      if (input.className.indexOf("select-box") + 1) {
        let intSelect = getPathTo(
          input.querySelector("input[autocomplete='off']")
        );
        let valInput = input.querySelector("input[type='hidden']") || {};
        if (valInput.value) {
          valueArr.push({
            containerXPath: getPathTo(input.querySelector("div")),
            value: valInput.value,
            label: valInput.name,
            type: "select",
            inputXPath: intSelect
          });
        }
      }

      //text and date
      if (input.type == "text") {
        if (input.value) {
          valueArr.push({
            type: "textOrDate",
            inputXPath: getPathTo(input),
            label: input.name,
            value: input.value
          });
        }
      }
    }
    copyToClipboard(valueArr);
    console.log(valueArr);
  }

  function copyToClipboard(obj) {
    clipboardInput.value = JSON.stringify(obj, null, 1);
    clipboardInput.select();
    clipboardInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  function setInputValue({ name, id, value }) {
    let inputs;
    if (name) inputs = document.querySelectorAll(`[name="${name}"]`);
    if (id) inputs = document.querySelectorAll(`#${id}`);
    inputs.forEach(input => {
      let lastValue = input.value;
      input.value = value;
      let event = new Event("input", {
        bubbles: true
      });
      // hack React15
      event.simulated = true;
      // hack React16 内部定义了descriptor拦截value，此处重置状态
      let tracker = input._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      input.dispatchEvent(event);
    });
  }

  function onDocKeyUp(ev) {
    // if (!state.recording) return;

    let xpath = getPathTo(ev.target);
    let potentialNode = recordedPaths.find(p => p.xpath == xpath);
    let isReactSelect = false;
    if (ev.target.id.includes("react-select")) {
      // this means a react select input was used.
      if (ev.which === 13 || ev.which === 9) {
        // gotta ignore enter or tab keypress because after entering select value the input field's xpath changes
        isReactSelect = true; // ok turns out it's actually the xpath that i get from the target element after pressing ENTER which works. so i'm taking it.
      } else {
        return;
      }
    }

    if (potentialNode) {
      potentialNode.value = ev.target.value;
      potentialNode.event = "input";
    } else {
      let type = ev.target.type;
      let value = ev.target.value;
      let containerXPath = "";
      let label = ev.target.name || ev.target.className || ev.target.nodeName;
      if (isReactSelect) {
        let $selectInput = ev.target;
        type = "select";
        let $containerSelect = $selectInput.closest(".select-box");
        containerXPath = getPathTo($containerSelect);
        let valInput = $containerSelect.querySelector("input[type='hidden']");
        value = valInput.value;
        label = valInput.name;
      }
      recordedPaths.push({
        type,
        value,
        label,
        xpath,
        ...(containerXPath
          ? {
              containerXPath
            }
          : {})
      });
      // setState({
      //   recordedPaths
      // });
    }
    console.log("logging ev: ", ev);
    console.log("recordedpaths: ", recordedPaths);
  }

  function onDocClick(ev) {
    // if (!this.state.recording) return;
    if (!recordClicks) return;
    if (ev.target.id === "recordClicks") return;
    recordClickEvent(ev);
  }

  function recordUrlChangeEvent(ele) {
    let anchorEle = {};
    while (anchorEle.tagName !== "A") {
      anchorEle = ele.parentNode;
    }
    let anchorUrl = anchorEle.href;
    return anchorUrl;
    console.log("logging anchorUrl: ", anchorUrl);
  }

  function recordClickEvent(ev) {
    //   let { recordedPaths } = this.state;
    let xpath = getPathTo(ev.target);
    let potentialNode = recordedPaths.find(p => p.xpath == xpath);
    let event = "click";
    let value = ev.target.value;

    let xpathContainsAnchor = xpath.indexOf("/A") !== -1;
    if (xpathContainsAnchor) {
      event = "link";
      value = recordUrlChangeEvent(ev.target);
    }
    if (potentialNode) {
      // potentialNode.value = ev.target.value;
    } else {
      recordedPaths.push({
        type: ev.target.type,
        value,
        label:
          ev.target.label ||
          ev.target.name ||
          ev.target.className ||
          ev.target.nodeName,
        xpath: xpath,
        event
      });
      // this.setState({
      //   recordedPaths
      // });
    }
    console.log("recordedpaths: ", recordedPaths);
  }

  function recordNativeSelect(ev) {
    let xpath = getPathTo(ev.target);
    recordedPaths.push({
      type: "nativeSelect",
      value: ev.target.value,
      label:
        ev.target.label ||
        ev.target.name ||
        ev.target.className ||
        ev.target.nodeName,
      xpath: xpath,
      event: "change"
    });
    console.log("recordedpaths: ", recordedPaths);
  }

  function onDocChange(ev) {
    console.log("logging ev change: ", ev);
    if (ev.target.id === "recordClicks") return;
    if (ev.target.tagName === "SELECT") {
      recordNativeSelect(ev);
    }
    if (ev.target.type === "radio" || ev.target.type === "checkbox") {
      recordClickEvent(ev);
    }
  }
})();
