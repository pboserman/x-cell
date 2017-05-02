const getSumFromArray = function(...numArray) {
    return numArray.reduce((a, b) => a + b, 0);
};

module.exports = {
    getSumFromArray: getSumFromArray
};