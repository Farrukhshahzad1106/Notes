const {calculateSum} = require('./sum.js');
const {calculateMultiply, multiplyAny} = require('./multiply.js');
const {substract} = require('./substract.js');
const {calculateQuotient, calculateRemainder} = require('./divide.js');


module.exports = { calculateSum, calculateMultiply, multiplyAny, substract, calculateQuotient, calculateRemainder}; 
// exporting all the modules from this file so that we can import them in app.js file