
require('./xyz.js');
const {x, calculateSum} = require('./sum.js');



var name = "Namaste Nodejs";

var a = 1;
var b = 2;

console.log(name);
console.log(x);
console.log(calculateSum(a, b));
console.log(global);
console.log(this); // {}, this is not equal to  global object in this scenario whereas in case of browser this is equal to window object
console.log(globalThis); // This will also point to the global object.
console.log(globalThis === global); // true

// By the browser we are given a global object called window. If in browser console we log window or this, it will give us the window object.
//  window object is not given to us by v8 engine, it  is given by browser
// In nodejs the global object is called global. The global object is outside of v8 engine and it gives us a lot of features.
// v8 engine understands ecmascript standard, it doesn't understand global. It understands global when nodejs gives access of global to v8 engine.
// to access the global object window we can use the window, this(in global context), self, frame keywords.
// FOR UNIFORMITY across different scenarios 'globalThis' was decided to point to the global object 