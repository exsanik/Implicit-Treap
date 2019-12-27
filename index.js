let configArray = [];
const config = {
  container: "#root",
  rootOrientation: "NORTH",
  hideRootNode: true,
  siblingSeparation: 40,
  subTeeSeparation: 30,

  connectors: {
    type: "straight",
    style: {
      "arrow-end": "block-wide-long",
      "stroke-width": 2
    }
  },
  node: {
    HTMLclass: "implicitNode"
  }
};
const root = {};
configArray.push(config, root);

let treap = null;
let timeStamp;

function createTreant(arrayConfig) {
  return new Treant(arrayConfig);
}

function createRoot(id) {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", id);
  rootContainer.appendChild(rootEl);
}

function removeRoot(id) {
  rootContainer.removeChild(document.getElementById(id));
}

let currPos = -1;
let opType = "pause";
let interval;
createRoot("root");
let slideHtmlArr = [];

function stopInterval() {
  clearInterval(interval);
  opType = "pause";
}

function renderHtml(html, id) {
  if (id === slideHtmlArr.length - 1) {
    document.getElementsByClassName("controls")[0].style.display = "block";
  } else {
    document.getElementsByClassName("controls")[0].style.display = "none";
  }
  document.getElementById("root").innerHTML = html;
}

function saveSlideHtml() {
  for (let i = 0; i < timeStamp.length; ++i) {
    const stat = createTreant(timeStamp[i]);
    slideHtmlArr.push(document.getElementById("root").innerHTML);
  }
  document.getElementById("root").style.display = "block";
}

function playSlide() {
  opType = "play";
  interval = setInterval(() => {
    currPos++;
    renderHtml(slideHtmlArr[currPos], currPos);
    if (currPos >= slideHtmlArr.length - 1 || opType === "pause") {
      stopInterval();
    }
  }, 1000);
}

function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function fullFillDrops() {
  const nodeList = treap.print();
  const drops = document.querySelectorAll(".dropdown-menu");
  for (let i = 0; i < drops.length; ++i) {
    clearChildren(drops[i]);
  }
  for (let i = 0; i < nodeList.length; ++i) {
    nodeList[i].innerText = i.toString() + ": " + nodeList[i].innerText;
    drops[1].appendChild(nodeList[i]);
    for (let j = 0; j < drops.length; ++j) {
      if (j === 1) {
        continue;
      }
      const spanEl = document.createElement("span");
      spanEl.setAttribute("class", "dropdown-item");
      spanEl.innerText = i.toString();
      spanEl.onclick = el => {
        document.getElementById(`dropdownMenuButton${j}`).innerText =
          el.target.innerText;
      };
      drops[j].appendChild(spanEl);
    }
  }
}

function startBuild() {
  let counter = document.getElementById("arrCounter").innerText - 0;
  if (counter > 12 || counter < 1) {
    return;
  }
  let startArr = [];
  for (let i = 0; i < counter; ++i) {
    startArr.push(Math.floor(Math.random() * 10));
  }
  treap = new ImplicitTreap([config, root], ...startArr);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  document
    .querySelector(".container-fluid")
    .removeChild(document.getElementById("startBlock"));
  saveSlideHtml();
  playSlide();
  document.getElementById("step-desc").innerText = "Build step";
}

function startAdd() {
  const value = document.getElementById("add-inp").value - 0;
  const pos = document.getElementById("dropdownMenuButton0").innerText - 0;
  if (value > 999999 || value < -999999 || pos < 0) {
    return;
  }
  if (pos === "Pos") {
    pos = 0;
  }
  treap.add(pos, value);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  saveSlideHtml();
  playSlide();
  document.getElementById("step-desc").innerText = "Add step";
}

function startRemove() {
  let pos = document.getElementById("dropdownMenuButton").innerText;
  if (pos === "Choose node") {
    return;
  }
  pos = pos.match(/^[^\d]*(\d+)/)[0];
  if (pos < 0) {
    return;
  }

  treap.remove(pos);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  saveSlideHtml();
  playSlide();
  document.getElementById("step-desc").innerText = "Remove step";
  document.getElementById("dropdownMenuButton").innerText = "Choose node";
}

function startToFront() {
  let left = document.getElementById("dropdownMenuButton2").innerText - 0;
  let right = document.getElementById("dropdownMenuButton3").innerText - 0;
  if (left === NaN || right === NaN) {
    return;
  }

  treap.toFront(left, right);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  saveSlideHtml();
  playSlide();
  document.getElementById("step-desc").innerText = "To front step";
  document.getElementById("dropdownMenuButton2").innerText = "Left";
  document.getElementById("dropdownMenuButton3").innerText = "Right";
}

function startReverse() {
  let left = document.getElementById("dropdownMenuButton6").innerText - 0;
  let right = document.getElementById("dropdownMenuButton7").innerText - 0;
  if (left === NaN || right === NaN) {
    return;
  }

  treap.reverse(left, right);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  saveSlideHtml();
  playSlide();
  document.getElementById("step-desc").innerText = "Reverse step";
  document.getElementById("dropdownMenuButton6").innerText = "Left";
  document.getElementById("dropdownMenuButton7").innerText = "Right";
}

function startQuery() {
  let left = document.getElementById("dropdownMenuButton4").innerText - 0;
  let right = document.getElementById("dropdownMenuButton5").innerText - 0;
  if (left === NaN || right === NaN) {
    return;
  }

  let res = treap.query(left, right);
  timeStamp = treap.getTimeStamp();

  fullFillDrops();

  saveSlideHtml();
  playSlide();
  document.getElementById("labelQuery").innerText += " " + res;
  document.getElementById("step-desc").innerText = "Query step";
  document.getElementById("dropdownMenuButton4").innerText = "Left";
  document.getElementById("dropdownMenuButton5").innerText = "Right";
}

function playPause() {
  if (opType === "play") {
    stopInterval();
  } else if (opType === "pause") {
    if (currPos >= slideHtmlArr.length - 1) {
      currPos = -1;
    }
    playSlide();
  }
}

function stepForward() {
  if (currPos < slideHtmlArr.length - 1) {
    stopInterval();
    currPos++;
    renderHtml(slideHtmlArr[currPos], currPos);
  }
}

function stepBack() {
  stopInterval();
  if (currPos > 0) {
    currPos--;
    renderHtml(slideHtmlArr[currPos], currPos);
  } else if (currPos === 0) {
    currPos--;
    renderHtml("", currPos);
  }
}

function counterPlus() {
  let counter = document.getElementById("arrCounter").innerText - 0;
  if (counter < 12) {
    document.getElementById("arrCounter").innerText = ++counter;
  }
  if (counter === 12) {
    document
      .querySelectorAll(".counter-block button")[1]
      .setAttribute("disabled", "true");
  } else if (counter < 12) {
    document
      .querySelectorAll(".counter-block button")[0]
      .removeAttribute("disabled");
  }
}

function counterMinus() {
  let counter = document.getElementById("arrCounter").innerText - 0;
  if (counter > 1) {
    document.getElementById("arrCounter").innerText = --counter;
  }
  if (counter === 1) {
    document
      .querySelectorAll(".counter-block button")[0]
      .setAttribute("disabled", "true");
  } else if (counter > 1) {
    document
      .querySelectorAll(".counter-block button")[1]
      .removeAttribute("disabled");
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") {
    stepForward();
  }
  if (event.key === "ArrowLeft") {
    stepBack();
  }
  if (event.key === " ") {
    playPause();
  }
});

document.getElementById("add-inp").oninput = function() {
  if (this.value.length > 6) {
    this.value = this.value.slice(0, 6);
  }
};
