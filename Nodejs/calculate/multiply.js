function calculateMultiply(a, b) {
  return a * b;
}

function multiplyAny(...args) {
  if (!args.length) {
    throw new Error("At least one number is required for multiplication.");
  }
  let result = args[0];
  for (let i=1; i<args.length; i++) {
    const num = args[i];
    if (typeof num !== 'number') {
      throw new Error("All arguments must be numbers.");
    }
    result *= num;
  }
  return result;
}

module.exports = {
  calculateMultiply,
  multiplyAny
};