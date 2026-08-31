/*
  Previous notes preserved from this file

  const cart = ['Iphone', 'Macbook', 'Airpods'];
  createOrder(cart)
    .then(() => {})
    .then(paymentInfo => showOrderSummary(paymentInfo))
    .then(orderSummary => console.log(orderSummary))
    .catch(err => console.log(err.message));

  The important rule is this:
  - If you return a promise from a .then() callback, the next .then() waits for it.
  - If you do not return anything, the next .then() receives undefined.

  .then(orderId => return proceedToPayment(orderId)) is not valid JavaScript.
  To use return explicitly, write:

  .then(orderId => {
    return proceedToPayment(orderId);
  })

  If an intermediate .then() block is empty, it runs but returns undefined by
  default. The next .then() therefore receives undefined. Return the previous
  value explicitly if the chain needs to keep it.

  .catch() is usually placed at the end of a chain. It catches errors from all
  earlier links. If it appears in the middle, later .then() callbacks can still
  run when that catch handles the error and returns a value.

  createOrder(cart)
    .then(orderId => proceedToPayment(orderId))
    .catch(err => {
      console.log(err.message);
      return "fallback";
    })
    .then(value => console.log(value));

  Returning a value inside .catch() makes the chain continue successfully with
  that value.

  Promise APIs (Promise.all, Promise.race, Promise.allSettled, and Promise.any)
  handle multiple Promises concurrently. Promise.all() resolves with an array of
  results in input order when every Promise resolves, and rejects as soon as one
  Promise rejects.
*/

// Additional Promise chaining examples
// Every .then(), .catch(), and .finally() returns a NEW Promise.
// What a callback returns decides what the next link receives.

const cart = ["iPhone", "MacBook", "AirPods"];

createOrder(cart)
  .then(orderId => proceedToPayment(orderId)) // Return the Promise so the chain waits.
  .then(paymentInfo => showOrderSummary(paymentInfo))
  .then(orderSummary => console.log(orderSummary))
  .catch(error => console.error(error.message));

function createOrder(items) {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      reject(new Error("Cart is empty. Cannot create order."));
      return;
    }

    resolve(Math.floor(Math.random() * 1000));
  });
}

function proceedToPayment(orderId) {
  return new Promise((resolve, reject) => {
    if (!orderId) {
      reject(new Error("Invalid order ID. Cannot proceed to payment."));
      return;
    }

    resolve({ orderId, status: "Payment successful" });
  });
}

function showOrderSummary(paymentInfo) {
  return new Promise((resolve, reject) => {
    if (!paymentInfo || paymentInfo.status !== "Payment successful") {
      reject(new Error("Payment failed. Cannot show order summary."));
      return;
    }

    resolve(`Order ID: ${paymentInfo.orderId}, Status: ${paymentInfo.status}`);
  });
}

// 1. Returning a normal value
// The returned value becomes the value received by the next .then().
Promise.resolve(5)
  .then(value => value * 2)
  .then(value => console.log("Returned value:", value)); // 10

// 2. Returning a Promise
// The chain waits until the returned Promise resolves or rejects.
Promise.resolve(101)
  .then(orderId => {
    return proceedToPayment(orderId);
  })
  .then(paymentInfo => console.log("Payment:", paymentInfo));

// 3. No return statement
// A callback without return implicitly returns undefined.
Promise.resolve("hello")
  .then(message => {
    console.log(message);
    // No return here.
  })
  .then(value => console.log("No return gives:", value)); // undefined

// 4. Starting async work without returning it (a common mistake)
function saveUser(user) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Saved:", user.name);
      resolve(user);
    }, 500);
  });
}

// Promise.resolve() immediately fulfills with { name: "Farrukh" }.
// The first .then() receives that object as user and starts saveUser(user).
// However, saveUser() creates a Promise that takes 500ms, and this callback does
// not return it. A .then() callback with no return resolves its new Promise with
// undefined right away, so the next .then() does not wait for saving to finish.
Promise.resolve({ name: "Farrukh" })
  .then(user => {
    saveUser(user); // Incorrect: this Promise is not returned.
  })
  .then(() => console.log("Runs before saving is guaranteed to finish."));

// Here, returning saveUser(user) connects that 500ms Promise to the chain.
// The next .then() waits for it to fulfill before it is allowed to run.
Promise.resolve({ name: "Farrukh" })
  .then(user => {
    return saveUser(user); // Correct: the chain now waits.
  })
  .then(() => console.log("Runs after saving finishes."));

// 5. Preserve a value after a side effect.
Promise.resolve({ name: "Farrukh" })
  .then(user => {
    console.log("Loaded user:", user.name);
    return user; // Keep the value available to the next link.
  })
  .then(user => console.log("Welcome,", user.name));

// 6. Empty callback versus a missing callback
// An empty callback RUNS and returns undefined, discarding the earlier value.
Promise.resolve("important data")
  .then(() => { })
  .then(value => console.log("Empty callback gives:", value)); // undefined

// A missing callback does not run; it passes the earlier value through unchanged.
Promise.resolve("important data")
  .then()
  .then(value => console.log("Missing callback keeps:", value)); // important data

// 7. Error recovery with catch
// Returning a value from catch changes the chain back to fulfilled.
Promise.reject(new Error("Network error"))
  .catch(error => {
    console.warn(error.message);
    return { name: "Guest" };
  })
  .then(user => console.log("Recovered as:", user.name));

// Throwing from a handler (or returning Promise.reject(...)) makes the next link reject.
Promise.resolve("data")
  .then(() => {
    throw new Error("Could not process data");
  })
  .catch(error => console.error(error.message));

// 8. finally() is for cleanup. It normally preserves the earlier value or error.
Promise.resolve("data")
  .finally(() => console.log("Hide loading indicator"))
  .then(value => console.log("Value after finally:", value)); // data

// Note: throwing inside finally() overrides the earlier result and rejects the chain.

// -----------------------------------------------------------------------------
// Promise constructor and Promise static methods
// -----------------------------------------------------------------------------

// Promise constructor
// Use new Promise() when you need to wrap callback-based or custom async work.
// Call resolve(value) when the work succeeds and reject(error) when it fails.
function wait(milliseconds) {
  return new Promise((resolve, reject) => {
    if (milliseconds < 0) {
      reject(new Error("Milliseconds cannot be negative."));
      return;
    }

    setTimeout(() => resolve(`Waited ${milliseconds}ms`), milliseconds);
  });
}

wait(100)
  .then(message => console.log("Promise constructor:", message))
  .catch(error => console.error(error.message));

// Promise.resolve(value) creates an already-fulfilled Promise.
Promise.resolve("Already available")
  .then(value => console.log("Promise.resolve:", value));

// Promise.reject(reason) creates an already-rejected Promise.
Promise.reject(new Error("Example rejection"))
  .catch(error => console.log("Promise.reject:", error.message));

const firstTask = Promise.resolve("first result");
const secondTask = Promise.resolve("second result");
const failedTask = Promise.reject(new Error("Task failed"));

// Promise.all(iterable)
// Resolves only when EVERY input Promise resolves. Results retain input order.
// Rejects immediately when any input Promise rejects.
Promise.all([firstTask, secondTask])
  .then(results => console.log("Promise.all:", results));

Promise.all([firstTask, failedTask])
  .then(results => console.log(results))
  .catch(error => console.log("Promise.all error:", error.message));

// Promise.allSettled(iterable)
// Waits for EVERY Promise, regardless of whether it fulfilled or rejected.
// Each result has status: "fulfilled" with value, or "rejected" with reason.
Promise.allSettled([firstTask, failedTask])
  .then(results => console.log("Promise.allSettled:", results));

// Promise.race(iterable)
// Settles as soon as the FIRST input Promise settles (fulfills or rejects).
const slowTask = new Promise(resolve => setTimeout(() => resolve("slow"), 200));
const fastTask = new Promise(resolve => setTimeout(() => resolve("fast"), 50));

Promise.race([slowTask, fastTask])
  .then(result => console.log("Promise.race:", result)); // fast

// Promise.any(iterable)
// Resolves with the FIRST successful result. Rejections are ignored unless every
// input Promise rejects; in that case it rejects with an AggregateError.
Promise.any([failedTask, fastTask])
  .then(result => console.log("Promise.any:", result)); // fast

Promise.any([
  Promise.reject(new Error("Service A failed")),
  Promise.reject(new Error("Service B failed")),
])
  .catch(error => console.log("Promise.any errors:", error.errors.length));

// -----------------------------------------------------------------------------
// Promise method reference
// -----------------------------------------------------------------------------

// INSTANCE METHODS (called on a Promise instance)
// promise.then(onFulfilled, onRejected)
// Adds success and optional error handlers. It always returns a NEW Promise.
// A returned value flows to the next handler; a returned Promise is awaited.

// promise.catch(onRejected)
// Shorthand for promise.then(undefined, onRejected). It handles a rejection and
// returns a new Promise, so returning a fallback value lets the chain continue.

// promise.finally(onFinally)
// Runs after fulfillment or rejection, usually for cleanup. It receives no
// result value and normally preserves the earlier value or error. If it throws,
// the returned Promise rejects with that new error.

// STATIC METHODS (called on Promise itself)
// Promise.resolve(value)
// Converts a value, thenable, or Promise into a Promise. A normal value becomes
// a fulfilled Promise; a Promise/thenable is adopted and its eventual result is
// followed.

// Promise.reject(reason)
// Returns a new Promise that is immediately rejected with reason.

// Promise.all(iterable)
// Waits for every input to fulfill and resolves with their values in input order.
// It rejects as soon as the first input rejects. Use it when every result is
// required.

// Promise.allSettled(iterable)
// Waits for every input to settle. It always fulfills with an array of outcome
// objects: { status: "fulfilled", value } or { status: "rejected", reason }.
// Use it when you need a report of every task, including failures.

// Promise.race(iterable)
// Settles as soon as the first input settles, whether it fulfills or rejects.
// It is commonly used for timeouts, but it does not cancel the losing work.

// Promise.any(iterable)
// Fulfills with the first successful input. It ignores individual rejections,
// then rejects with AggregateError only when every input rejects. Use it for
// fallback services or alternative sources.

// Promise.withResolvers()
// Returns { promise, resolve, reject }. It is useful when the code that creates
// a Promise must expose its resolve/reject functions for an event or callback
// that happens later. Prefer ordinary Promise-returning APIs when possible.
// This modern method may require a current JavaScript runtime.

// Promise.try(callback, ...args)
// Calls callback immediately and wraps its outcome in a Promise: a returned
// value fulfills, a thrown error rejects, and a returned Promise is adopted.
// This modern method is useful when a function may be synchronous or async.
// Check runtime support before using it in older browsers or Node.js versions.

// -----------------------------------------------------------------------------
// Important Promise interview questions
// -----------------------------------------------------------------------------

// 1. What is a Promise?
// A Promise is an object representing the eventual result of an asynchronous
// operation. It is pending at first, then becomes fulfilled or rejected.

// 2. What is the difference between a Promise's state and its result?
// State is pending, fulfilled, or rejected. A fulfilled Promise's result is its
// value; a rejected Promise's result is its reason/error. Once settled, its
// state and result cannot change.

// 3. Why does .then() return a new Promise?
// This allows chaining. The new Promise settles based on what the callback
// returns or throws.
Promise.resolve(2)
  .then(value => value * 3)
  .then(value => console.log("Interview 3:", value)); // 6

// 4. What happens when a .then() callback returns a value, a Promise, nothing,
// or throws an error?
// - return value: next .then() receives that value.
// - return Promise: chain waits for it.
// - no return: next .then() receives undefined.
// - throw error: chain becomes rejected and goes to .catch().

// 5. What is the difference between .then(success, failure) and .catch(failure)?
// .catch(failure) is like .then(undefined, failure). A catch at the end also
// handles errors thrown by earlier success handlers, which is why it is usually
// easier and safer to read.

// 6. Does .catch() stop a Promise chain?
// No. If it returns a normal value, the next .then() runs with that value.
Promise.reject(new Error("Request failed"))
  .catch(() => "fallback data")
  .then(value => console.log("Interview 6:", value)); // fallback data

// 7. What is the difference between Promise.all(), allSettled(), race(), and any()?
// all:        needs every task to succeed; first failure rejects it.
// allSettled: waits for every task and reports every outcome.
// race:       first task to settle (success OR failure) wins.
// any:        first task to succeed wins; rejects only if all tasks fail.

// 8. Does Promise.all() cancel other Promises after one rejects?
// No. It rejects early, but the other asynchronous operations keep running
// unless their APIs support cancellation (for example, fetch with AbortController).

// 9. What is the difference between Promise.resolve() and new Promise(...)?
// Promise.resolve(value) wraps/adopts an existing value or Promise. Use
// new Promise((resolve, reject) => ...) only when adapting a callback/event API
// or creating custom asynchronous work.

// 10. What is a thenable?
// Any object with a callable .then() method. Promise.resolve(thenable) adopts
// it, meaning the resulting native Promise follows its eventual outcome.

// 11. Are Promise callbacks synchronous or asynchronous?
// The executor passed to new Promise() runs synchronously. Handlers passed to
// .then(), .catch(), and .finally() run later as microtasks, even when the
// Promise is already settled.
console.log("Interview 11: start");
Promise.resolve().then(() => console.log("Interview 11: promise handler"));
console.log("Interview 11: end");
// Output: start, end, promise handler

// 12. What is the microtask queue, and why is it important?
// Promise handlers use the microtask queue. After current synchronous code
// finishes, JavaScript runs queued microtasks before moving to timer callbacks
// such as setTimeout() (the task/macrotask queue).

// 13. What is the output order here?
setTimeout(() => console.log("Interview 13: timeout"), 0);
Promise.resolve().then(() => console.log("Interview 13: microtask"));
console.log("Interview 13: synchronous");
// Output: synchronous, microtask, timeout

// 14. What is Promise callback "callback hell" and how do Promises help?
// Callback hell is deeply nested callbacks that are difficult to read and
// handle errors in. Returning Promises produces a flat, sequential chain with
// centralized error handling.

// 15. What is the relationship between async/await and Promises?
// async functions always return a Promise. await pauses only that async function
// until its Promise settles; it is syntax built on top of Promise behavior.
async function getGreeting() {
  const name = await Promise.resolve("Farrukh");
  return `Hello, ${name}`;
}

getGreeting().then(message => console.log("Interview 15:", message));

// 16. How do you handle a timeout or cancel a Promise?
// Promise.race() can choose a timeout result, but it does not stop the original
// work. For fetch, pass an AbortSignal from AbortController to actually cancel.

// 17. What is an unhandled Promise rejection?
// It is a rejected Promise without a rejection handler. Always return/await
// Promises and handle errors with try/catch or .catch() at an appropriate level.

// -----------------------------------------------------------------------------
// Tricky and in-depth Promise interview questions
// -----------------------------------------------------------------------------

// 18. What does this print, and why?
Promise.resolve("value")
  .then(value => {
    console.log("Interview 18a:", value);
    // No return means this handler returns undefined.
  })
  .then(value => console.log("Interview 18b:", value));
// Output: "value", then undefined.

// 19. What is the difference between returning a Promise and nesting it?
// Returning keeps one chain and lets one final catch handle failures.
// Nesting creates an inner chain that the outer chain does not wait for.
Promise.resolve("Farrukh")
  .then(name => {
    return Promise.resolve(`Hello, ${name}`); // Correct: returned.
  })
  .then(message => console.log("Interview 19:", message));

// 20. Why is this error NOT caught by the outer catch?
// Promise.resolve()
//   .then(() => {
//     Promise.reject(new Error("Inner rejection")); // Not returned.
//   })
//   .catch(error => console.log("Outer catch:", error.message));
// The outer chain fulfills with undefined. Return the inner Promise to propagate
// its rejection: return Promise.reject(new Error("Inner rejection"));
// This intentionally unhandled example is commented out to keep this file safe
// to run without an unhandled-rejection warning.

// 21. Does a Promise resolve only once?
// Yes. Only the first call to resolve() or reject() matters; later attempts are
// ignored. "Resolve" can adopt another Promise, so it may stay pending until
// that adopted Promise settles.
const settleOnce = new Promise((resolve, reject) => {
  resolve("first result");
  reject(new Error("ignored"));
  resolve("also ignored");
});
settleOnce.then(value => console.log("Interview 21:", value)); // first result

// 22. Is Promise.resolve(promise) always a new Promise?
// No. If promise is already a native Promise created by the same constructor,
// Promise.resolve(promise) returns the very same object.
const existingPromise = Promise.resolve("same object");
console.log(
  "Interview 22:",
  Promise.resolve(existingPromise) === existingPromise,
); // true

// 23. What is Promise resolution (or assimilation)?
// If a handler returns a Promise or thenable, the Promise created by .then()
// adopts its state instead of fulfilling with the Promise object itself.
Promise.resolve()
  .then(() => Promise.resolve("adopted value"))
  .then(value => console.log("Interview 23:", value)); // adopted value

// 24. What happens if a chain returns itself?
// It creates a circular resolution and rejects with TypeError.
let circularChain;
circularChain = Promise.resolve().then(() => circularChain);
circularChain.catch(error => console.log("Interview 24:", error.name)); // TypeError

// 25. Can one rejection handler receive errors from multiple earlier links?
// Yes. A catch at the end handles rejections from the original Promise and
// errors thrown or returned as rejected Promises by every earlier chain handler.
Promise.resolve("input")
  .then(() => {
    throw new Error("Processing failed");
  })
  .then(() => "This is skipped")
  .catch(error => console.log("Interview 25:", error.message));

// 26. What is the difference between throwing in a .then() and returning
// Promise.reject(error)? Both make the next Promise reject. Throwing is usually
// clearer for synchronous validation; return Promise.reject() is useful when an
// API already supplies a rejected Promise.

// 27. What happens if finally() returns a rejected Promise?
// It overrides the earlier success or failure, and the resulting chain rejects.
Promise.resolve("original value")
  .finally(() => Promise.reject(new Error("Cleanup failed")))
  .catch(error => console.log("Interview 27:", error.message));

// 28. Why can await in a loop be slow, and when is it correct?
// A for...of loop with await performs tasks one after another. That is correct
// when each task depends on the previous result or rate limiting is required.
// For independent tasks, start them together and use Promise.all().
async function sequentialExample() {
  const results = [];
  for (const value of [1, 2, 3]) {
    results.push(await Promise.resolve(value * 2));
  }
  return results;
}

async function concurrentExample() {
  return Promise.all([1, 2, 3].map(value => Promise.resolve(value * 2)));
}

// 29. Why is Array.prototype.forEach() a poor match for await?
// forEach does not await its callback or return a Promise representing all work.
// Use for...of for sequential work, or map() plus Promise.all() for concurrent
// work instead.

// 30. Does Promise.race() provide a reliable timeout by itself?
// It selects whichever result settles first, but losing operations continue.
// A real timeout should also cancel work when the underlying API supports it.
// Example with fetch: create AbortController, pass controller.signal to fetch,
// and call controller.abort() when the timeout expires.

// 31. What is the difference between concurrency and parallelism for Promises?
// Starting several async operations before awaiting them is concurrent. Whether
// work runs in parallel depends on the underlying operation and JavaScript host
// (network, browser, Node.js, workers), not on Promise.all() itself.

// 32. How do Promise errors differ from errors in setTimeout callbacks?
// A thrown error inside a Promise handler becomes a rejection in that chain. A
// throw inside a later setTimeout callback is outside the Promise unless that
// callback calls reject(error) or catches and forwards the error.
