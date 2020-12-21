
function compareComplexArray(x, y) {
  if (!(x instanceof Array) || !(y instanceof Array) || x.length !== y.length) {
    return false;
  }
  // 判断对象是否相等
  let compareObject = function (x, y) {
    // 指向同一内存时
    if (x === y) {
      return true;
    } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length != Object.keys(y).length) {
        return false;
      }
      for (var prop in x) {
        if (Object.prototype.hasOwnProperty.call(y, prop)) {
          if (!compareObject(x[prop], y[prop])) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  // 获取类型
  let getType = function (o) {
    var s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase();
  };
  let compare = function (m, n, type) {
    if (type === "object") {
      if (!compareObject(m, n)) {
        return true;
      }
    } else if (type === "array") {
      if (!compareComplexArray(m, n)) {
        return true;
      }
    } else {
      if (m !== n) {
        return true;
      }
    }
    return false;
  };
  const xLen = x.length,
    yLen = y.length,
    evenFlag = xLen % 2 === 0;
  for (let i = 0; i < xLen; i++) {
    const xElement = x[i],
      xType = getType(xElement);
    for (let j = yLen - 1; j >= 0; j--) {
      const yElement = y[j],
        yType = getType(yElement);
      if (xType !== getType(y[i]) || yType !== getType(x[j])) {
        return false;
      }
      let xFlag = compare(xElement, y[i], xType),
        yFlag = compare(yElement, x[j], yType);
      if (xFlag || yFlag) {
        return false;
      }
      if (evenFlag) {
        if (i >= (xLen / 2) - 1) {
          return true;
        }
      } else {
        if (i >= Math.floor(xLen / 2)) {
          return true;
        }
      }
    }
  }
}

module.exports = {
  compareComplexArray: compareComplexArray
}
