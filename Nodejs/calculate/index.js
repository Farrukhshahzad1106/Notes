const {calculateSum} = require('./sum.js');
const {calculateMultiply} = require('./multiply.js');
const {substract} = require('./substract.js');
const {calculateQuotient, calculateRemainder} = require('./divide.js');


module.exports = { calculateSum, calculateMultiply, substract, calculateQuotient, calculateRemainder}; 
// exporting all the modules from this file so that we can import them in app.js file