console.log('sum module loaded');

// export function calculateSum(a, b) {
//   return a + b;
// }

// export var x = 50;

function calculateSum(a, b) {
  return a + b;
}

function sumAny(...args) {
  if (args.length === 0) {
    throw new Error("At least one number is required for summation.");
  }
  let result = 0;
  for (const num of args) {
    if (typeof num !== 'number') {
      throw new Error("All arguments must be numbers.");
    }
    result += num;
  }
  return result;
}

var x = 50;

module.exports = {
    x,
  calculateSum,
  sumAny
};