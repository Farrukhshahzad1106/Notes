const cart = ['Iphone', 'Macbook', 'Airpods'];
createOrder(cart)
.then(() => {})
.then(paymentInfo => showOrderSummary(paymentInfo))
.then(orderSummary => console.log(orderSummary))
.catch(err => console.log(err.message));

function createOrder(cart) {
    return new Promise((resolve, reject) => {
        if (!cart || cart.length === 0) {
            reject(new Error("Cart is empty. Cannot create order."));
        } else {
            const orderId = Math.floor(Math.random() * 1000);
            resolve(orderId);
        }
})}

function proceedToPayment(orderId) {
    return new Promise((resolve, reject) => {
        if (!orderId) {
            reject(new Error("Invalid order ID. Cannot proceed to payment."));
        } else {
            const paymentInfo = { orderId, status: 'Payment Successful' };
            resolve(paymentInfo);
        }
    });}

function showOrderSummary(paymentInfo) {
    return new Promise((resolve, reject) => {
        if (!paymentInfo || paymentInfo.status !== 'Payment Successful') {
            console.log('payment INfo in promise', paymentInfo);
            reject(new Error("Payment failed. Cannot show order summary."));   
        } else {
            const orderSummary = `Order ID: ${paymentInfo.orderId}, Status: ${paymentInfo.status}`;
            resolve(orderSummary);
        }
    })}


// The important rule is this:

// If you return a promise from a .then() callback, the next .then() waits for that promise.
// If you do not return anything, the next .then() receives undefined and the chain does not continue properly.

// One important note:
// .then(orderId => return proceedToPayment(orderId))
// is not valid JavaScript syntax. If you want to use return explicitly, you must write:
// .then(orderId => {
//   return proceedToPayment(orderId);
// })

// If the intermediate then block is empty in that scenario

// If a .then() block is empty, it still runs, but it does not pass any new value to the next step.
// createOrder(cart)
//   .then(orderId => {
//     // empty block
//   })
//   .then((data) => {
//     console.log("next step", data);
//   });

// the first .then() returns undefined by default,
// so the next .then() receives undefined, data in the second .then callback funciton is undefined
// and the chain continues, but with no useful data.
// So the main effect is:

// empty block = no value is returned,
// next .then() gets undefined,
// unless you explicitly return something.
// If you want the chain to keep the previous value, you can return it:

// Or simply:






// Here are the important points about where .catch() should be placed in a promise chain:

// .catch() is usually placed at the end of the chain.
// createOrder(cart)
//   .then(...)
//   .then(...)
//   .catch(err => console.log(err.message));

// It catches errors from any previous .then() in that chain.

// If one step fails, execution jumps to .catch().
// If you place .catch() in the middle, it will only catch errors before that point.
// createOrder(cart)
//   .then(...)
//   .catch(err => console.log(err.message)) // this catch block will catch errors from createOrder and the first .then() only
//   .then(...);   // this will still run


// A .catch() at the end is the safest pattern because it handles all failures in the chain.

// You can also use multiple .catch() blocks, but each one handles only the part of the chain before it.

// .catch() does not “stop” the chain permanently.
// If you handle the error and return a value, the chain can continue.
// createOrder(cart)
//   .then(orderId => proceedToPayment(orderId))
//   .catch(err => {
//     console.log(err.message);
//     return "fallback";
//   })
//   .then(value => console.log(value)); // the chain continues, it will treat as if the promise is resolved with the value "fallback"
//  If a .catch() handles the error and returns a value, the chain continues as if the previous step had resolved successfully.

// If an error occurs before .catch(), the error is caught.
// The .catch() returns a value, so the next .then() receives that value.
// In this case, the promise chain continues with a resolved value, not an error.

// return value inside .catch() makes the chain continue successfully.='
// It is effectively treated like a resolved promise with that returned value.



// PROMISE API's (Promise.all, Promise.race, Promise.allSettled, Promise.any) are used to handle multiple promises concurrently. 
// They allow you to wait for multiple asynchronous operations to complete and handle their results collectively.

// 1- Promise.all(): It takes an iterable (but we mostly pass an array of promises to it) of promises and returns a new promise that resolves when all the input promises have resolved, or rejects if any of the input promises reject. 
// The resolved value is an array of the resolved values from the input promises, in the same order as they were passed in.
// Promise.all() is useful when you want to wait for multiple asynchronous operations to complete before proceeding, and you need all of their results. If any promise fails, the entire operation fails.

//Promise.all() executes all the promises and waits for all of it to resolve or any of them to reject. 
// If any promise rejects, Promise.all() immediately rejects with that reason, and the other promises are ignored. If all promises resolve, it resolves with an array of their results.
// If all promises resolve we get an array of values in return in the same order as those passed through the iterable. Whwereas if any one of the promise rejects Promise.all() rejects and the value return is the value of the first rejected promise and the remaining promise whether resolved or rejected are ignored.
