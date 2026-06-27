console.log('sum module loaded');

function calculateSum(a, b) {
  return a + b;
}

var x = 50;

module.exports = {
    x,
  calculateSum
};