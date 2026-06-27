console.log('sum module loaded');

// export function calculateSum(a, b) {
//   return a + b;
// }

// export var x = 50;

function calculateSum(a, b) {
  return a + b;
}

var x = 50;

module.exports = {
    x,
  calculateSum
};