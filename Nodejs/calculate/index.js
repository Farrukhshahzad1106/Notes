const {calculateSum} = require('./sum.js');
const {calculateMultiply} = require('./multiply.js');
const {substract} = require('./substract.js');
const {calculateQuotient} = require('./divide.js');


module.exports = {x, calculateSum, calculateMultiply, substract, calculateQuotient}; 
// exporting all the modules from this file so that we can import them in app.js file