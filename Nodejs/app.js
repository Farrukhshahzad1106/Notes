
require('./xyz.js');
 // we can also import the module like this but it is not a good practice to import the module like this because if we have many modules in the calculate folder then we have to write the path of each module which is not a good practice. So we can create an index.js file in the calculate folder and export all the modules from there and then we can import the index.js file in the app.js file. This way we can import all the modules from the calculate folder in one line.
// const {calculateMultiply} = require('./calculate/multiply.js');
// const {x, calculateSum} = require('./calculate/sum.js');
// const {substract} = require('./calculate/substract.js');

// const {x, calculateSum, calculateMultiply, substract} = require('./calculate/index.js');
const {x, calculateSum, calculateMultiply, substract, multiplyAny} = require('./calculate'); 
// if we don't specify the file name, it will look for index.js file in the folder and import the exported items from there
const data = require('./data.json'); // importing json file as a module
const util = require("node:util"); // importing nodejs built-in module called util
const fs = require("node:fs"); // importing nodejs built-in module called fs


// import {x, calculateSum} from './sum.js';



var name = "Namaste Nodejs, learning Backend development using Nodejs";

var a = 1;
var b = 7;
const c = 18;

console.log(name);
// console.log(x);
console.log(calculateSum(a, b));
console.log(calculateMultiply(a, b));
console.log(substract(a, b));
console.log(calculateSum(a, c));
console.log(calculateMultiply(a, a));
console.log(calculateMultiply(a, c));
console.log(substract(a, c));
console.log(multiplyAny(a, b, c));
console.log(JSON.stringify(data));
// console.log(global);
// console.log(this); // {}, this is not equal to  global object in this scenario whereas in case of browser this is equal to window object
// console.log(globalThis); // This will also point to the global object.
// console.log(globalThis === global); // true

// By the browser we are given a global object called window. If in browser console we log window or this, it will give us the window object.
//  window object is not given to us by v8 engine, it  is given by browser
// In nodejs the global object is called global. The global object is outside of v8 engine and it gives us a lot of features.
// v8 engine understands ecmascript standard, it doesn't understand global. It understands global when nodejs gives access of global to v8 engine.
// to access the global object window we can use the window, this(in global context), self, frame keywords.
// FOR UNIFORMITY across different scenarios 'globalThis' was decided to point to the global object 