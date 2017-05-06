function isNumber(obj) {
  return obj!== undefined && typeof(obj) === 'number' && !isNaN(obj);
}

const getSumFromArray = function(...numArray) {
  return numArray.filter(isNumber).reduce((a, b) => a + b, 0);
};

module.exports = {
  getSumFromArray: getSumFromArray
};