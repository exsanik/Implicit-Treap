"use strict";

function generateHtml(paramName, param, addText) {
  return `<span class = "${paramName}">${
    addText ? addText : ""
  } ${param}</span>`;
}

class Node {
  constructor(value) {
    this.prior = Math.floor(Math.random() * Math.floor(100));
    this.sum = value;
    this.reversed = false;
    this.sz = 1;
    this.val = value;
    this.left = this.right = null;
  }
}

class ImplicitTreap {
  constructor(...elements) {
    this.treap = null;
    this.configArray = elements[0];
    this.timeStamp = [];
    if (elements.length !== 0) {
      for (let i = 1; i < elements.length; ++i) {
        const newEl = new Node(elements[i]);

        this.generateObjConfig({ style: "newEl", node: newEl }, this.treap);

        this.treap = this._merge(this.treap, newEl);
        this.generateObjConfig(this.treap);
      }
    }
  }

  setConfigArray(configArray) {
    this.configArray = configArray;
  }

  _merge = (leftT, rightT) => {
    this._push(leftT);
    this._push(rightT);

    if (!leftT) {
      return rightT;
    }
    if (!rightT) {
      return leftT;
    }

    if (leftT.prior > rightT.prior) {
      leftT.right = this._merge(leftT.right, rightT);
      this._update(leftT);
      return leftT;
    } else {
      rightT.left = this._merge(leftT, rightT.left);
      this._update(rightT);
      return rightT;
    }
  };

  _split = (rootTreap, pos) => {
    this._push(rootTreap);
    if (!rootTreap) {
      return [null, null];
    }
    if (this._getSize(rootTreap.left) < pos) {
      const [tr1, tr2] = this._split(
        rootTreap.right,
        pos - this._getSize(rootTreap.left) - 1
      );
      rootTreap.right = tr1;
      this._update(rootTreap);
      return [rootTreap, tr2];
    } else {
      const [tr1, tr2] = this._split(rootTreap.left, pos);
      rootTreap.left = tr2;
      this._update(rootTreap);
      return [tr1, rootTreap];
    }
  };

  _update = rootTreap => {
    if (!rootTreap) {
      return;
    }
    rootTreap.sz =
      1 + this._getSize(rootTreap.left) + this._getSize(rootTreap.right);
    rootTreap.sum =
      rootTreap.val +
      this._getSum(rootTreap.left) +
      this._getSum(rootTreap.right);
  };

  getValue = (rootTreap, pos) => {
    const myidx = this._getSize(rootTreap.left);
    if (pos < myidx) {
      return this.getValue(rootTreap.left, pos);
    } else if (pos === myidx) {
      return rootTreap.val;
    } else {
      return this.getValue(rootTreap, pos - myidx - 1);
    }
  };

  _getSize = rootTreap => {
    if (!rootTreap) {
      return 0;
    }
    return rootTreap.sz;
  };

  _getSum = rootTreap => {
    if (!rootTreap) {
      return 0;
    }
    return rootTreap.sum;
  };

  _print = (rootTreap, nodeArr) => {
    this._push(rootTreap);
    if (!rootTreap) {
      return;
    }
    this._print(rootTreap.left, nodeArr);

    const spanEl = document.createElement("span");
    spanEl.setAttribute("class", "dropdown-item");
    const htmlText = `val: ${rootTreap.val}, prior: ${rootTreap.prior}, sz: ${rootTreap.sz}`;
    spanEl.innerText = htmlText;
    spanEl.onclick = el => {
      document.getElementById("dropdownMenuButton").innerText =
        el.target.innerText;
    };
    nodeArr.push(spanEl);

    this._print(rootTreap.right, nodeArr);
  };

  _push = rootTreap => {
    if (!rootTreap) {
      return;
    }
    if (!rootTreap.reversed) {
      return;
    }

    [rootTreap.left, rootTreap.right] = [rootTreap.right, rootTreap.left];

    rootTreap.reversed = false;
    if (rootTreap.left !== null) {
      rootTreap.left.reversed ^= true;
    }
    if (rootTreap.right !== null) {
      rootTreap.right.reversed ^= true;
    }
  };

  add = (pos, value) => {
    this.timeStamp = [];

    const [tr1, tr2] = this._split(this.treap, pos);
    this.generateObjConfig(tr1, tr2);

    const newNode = new Node(value);
    this.generateObjConfig(tr1, tr2, { style: "newEl", node: newNode });

    this.treap = this._merge(tr1, newNode);
    this.generateObjConfig(this.treap, tr2);

    this.treap = this._merge(this.treap, tr2);
    this.generateObjConfig(this.treap);
  };

  remove = pos => {
    this.timeStamp = [];
    let [tr1, tr2] = this._split(this.treap, pos);
    this.generateObjConfig(tr1, tr2);

    let [tr3, tr4] = this._split(tr2, 1);
    this.generateObjConfig(tr1, { style: "newEl", node: tr3 }, tr4);

    this.treap = this._merge(tr1, tr4);
    this.generateObjConfig(this.treap);
    tr3 = null;
  };

  toFront = (l, r) => {
    this.timeStamp = [];
    if (l > r) {
      [l, r] = [r, l];
    }
    const [tr1, tr2] = this._split(this.treap, r + 1);
    this.generateObjConfig(tr1, tr2);
    const [tr3, tr4] = this._split(tr1, l);
    this.generateObjConfig(tr2, tr3, tr4);

    this.treap = this._merge(tr4, tr3);
    this.generateObjConfig(tr2, this.treap);
    this.treap = this._merge(this.treap, tr2);
    this.generateObjConfig(this.treap);
  };

  reverse = (l, r) => {
    this.timeStamp = [];
    if (l > r) {
      [l, r] = [r, l];
    }

    let [tr1, tr2] = this._split(this.treap, l);
    this.generateObjConfig(tr1, tr2);
    let [tr3, tr4] = this._split(tr2, r - l + 1);
    tr2 = tr3;
    if (tr2) {
      tr2.reversed ^= true;
    }
    this.generateObjConfig(tr1, tr2, tr4);
    this.treap = this._merge(tr1, tr2);
    this.treap = this._merge(this.treap, tr4);
    this.print();
    this.generateObjConfig(this.treap);
  };

  query = (l, r) => {
    this.timeStamp = [];
    if (l > r) {
      [l, r] = [r, l];
    }

    let [tr1, tr2] = this._split(this.treap, l);
    this.generateObjConfig(tr1, tr2);
    let [tr3, tr4] = this._split(tr2, r - l + 1);
    this.generateObjConfig(tr1, { style: "newEl", node: tr3 }, tr4);
    const res = this._getSum(tr3);
    tr2 = tr3;
    this.treap = this._merge(tr1, tr2);
    this.generateObjConfig(this.treap, tr4);
    this.treap = this._merge(this.treap, tr4);
    this.generateObjConfig(this.treap);
    return res;
  };

  print = () => {
    const nodeArr = [];
    this._print(this.treap, nodeArr);
    return nodeArr;
  };

  generateObjConfig = (...elemArray) => {
    let newConfigArray = [...this.configArray];
    for (let i = 0; i < elemArray.length; ++i) {
      if (elemArray[i] === null) {
        continue;
      }
      if (elemArray[i].hasOwnProperty("style")) {
        newConfigArray = this._generateObjConfig(
          newConfigArray[1],
          newConfigArray,
          elemArray[i].node,
          elemArray[i].style
        );
      } else {
        newConfigArray = this._generateObjConfig(
          newConfigArray[1],
          newConfigArray,
          elemArray[i]
        );
      }
    }
    this.timeStamp.push(newConfigArray);
  };

  _generateObjConfig = (parent, configArray, child, addClass) => {
    if (child === null) {
      return configArray;
    }
    let obj = {};
    const nodeEntity =
      generateHtml("value", child.val, "val: ") +
      generateHtml("priority", child.prior, "y: ") +
      generateHtml("sum", child.sum) +
      generateHtml("reverse", "sum:") +
      generateHtml("size", child.sz, "sz: ");
    obj.innerHTML = `<div class = "nodeBlock ${
      addClass ? addClass : ""
    }">${nodeEntity}</div>`;
    obj.parent = parent;
    configArray.push(obj);
    const newParent = configArray[configArray.length - 1];
    if (child.left !== null) {
      this._generateObjConfig(newParent, configArray, child.left);
    }
    if (child.right !== null) {
      this._generateObjConfig(newParent, configArray, child.right);
    }
    return configArray;
  };

  getRoot = () => {
    return this.treap;
  };

  getTimeStamp = () => {
    return this.timeStamp;
  };
}
