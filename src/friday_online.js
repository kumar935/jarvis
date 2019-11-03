
function getPathTo(element) {
    // if (element.id!=='')
    //     return 'id("'+element.id+'")';
    if (element.tagName == "HTML") return "/html";
    if (element === document.body) return "/html/body";
  
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

paths = [];

document.addEventListener("keyup", ev => {
    let xpath = getPathTo(ev.target);
    let potentialNode = paths.find(p => p.xpath == xpath);
    if(potentialNode){
        potentialNode.value = ev.target.value;
        potentialNode.event = "input";
    } else {
        paths.push({
            type: ev.target.type,
            value: ev.target.value,
            label: ev.target.label,
            xpath: xpath
        })
    }
    console.log("paths: ", paths);
});

document.addEventListener("click", ev => {
    let xpath = getPathTo(ev.target);
    let potentialNode = paths.find(p => p.xpath == xpath);
    if(potentialNode){
        // potentialNode.value = ev.target.value;
    } else {
        paths.push({
            type: ev.target.type,
            value: ev.target.value,
            label: ev.target.label,
            xpath: xpath,
            event: "click"
        })
    }
    console.log("paths: ", paths);
});