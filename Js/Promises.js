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
// Detailed answer: A Promise represents a future value, not necessarily a value that already
// exists. It gives asynchronous code one standard contract: success is delivered
// as fulfillment and failure as rejection, so callers can attach handlers later.

// A Promise is an object representing the eventual result of an asynchronous
// operation. It is pending at first, then becomes fulfilled or rejected.

// 2. What is the difference between a Promise's state and its result?
// Detailed answer: State describes the lifecycle (pending, fulfilled, rejected); result is the
// final value or reason. A Promise is immutable after settlement so multiple
// consumers observe the same outcome and no race can change it afterward.

// State is pending, fulfilled, or rejected. A fulfilled Promise's result is its
// value; a rejected Promise's result is its reason/error. Once settled, its
// state and result cannot change.

// 3. Why does .then() return a new Promise?
// Detailed answer: .then() returns a new Promise because each handler may transform a value,
// start more async work, or fail. The new Promise represents that handler's own
// eventual outcome, which is what makes a chain sequential and composable.

// This allows chaining. The new Promise settles based on what the callback
// returns or throws.
Promise.resolve(2)
  .then(value => value * 3)
  .then(value => console.log("Interview 3:", value)); // 6

// 4. What happens when a .then() callback returns a value, a Promise, nothing,
// or throws an error?
// Detailed answer: Returning a plain value fulfills the next Promise with that value. Returning
// a Promise/thenable makes the next Promise adopt it and wait. No return means
// return undefined. Throwing is converted into a rejection, preserving one error
// path instead of requiring manual try/catch inside every callback.

// - return value: next .then() receives that value.
// - return Promise: chain waits for it.
// - no return: next .then() receives undefined.
// - throw error: chain becomes rejected and goes to .catch().

// 5. What is the difference between .then(success, failure) and .catch(failure)?
// Detailed answer: .then(success, failure) handles a rejection only from the Promise before
// that particular .then(); it does not catch errors thrown by its own success
// callback. A later .catch() can handle both earlier rejections and handler
// errors, which is why ending a chain with .catch() is usually preferable.

// .catch(failure) is like .then(undefined, failure). A catch at the end also
// handles errors thrown by earlier success handlers, which is why it is usually
// easier and safer to read.

// 6. Does .catch() stop a Promise chain?
// Detailed answer: .catch() returns a new Promise. If its handler returns normally, that new
// Promise fulfills with the returned value, so the chain recovers. If it throws
// or returns a rejected Promise, the chain stays rejected and a later catch can
// handle the new error.

// No. If it returns a normal value, the next .then() runs with that value.
Promise.reject(new Error("Request failed"))
  .catch(() => "fallback data")
  .then(value => console.log("Interview 6:", value)); // fallback data

// 7. What is the difference between Promise.all(), allSettled(), race(), and any()?
// Detailed answer: Choose all when every result is essential; it fails fast. Choose allSettled
// when failures are also useful information. Choose race when the first settled
// outcome matters (such as a timeout). Choose any when only one successful source
// is required, because individual source failures should not stop the operation.

// all:        needs every task to succeed; first failure rejects it.
// allSettled: waits for every task and reports every outcome.
// race:       first task to settle (success OR failure) wins.
// any:        first task to succeed wins; rejects only if all tasks fail.

// 8. Does Promise.all() cancel other Promises after one rejects?
// Detailed answer: Promise.all() only observes Promise outcomes; Promises do not have built-in
// cancellation. Its returned Promise rejects early for fast feedback, but it has
// no authority to stop an already-started network request, timer, or file task.

// No. It rejects early, but the other asynchronous operations keep running
// unless their APIs support cancellation (for example, fetch with AbortController).

// 9. What is the difference between Promise.resolve() and new Promise(...)?
// Detailed answer: Promise.resolve() is a conversion utility: it wraps a value or adopts an
// existing thenable. new Promise() runs an executor immediately and exposes
// resolve/reject, so it is for adapting callback/event APIs—not for wrapping code
// that already returns a Promise, where it can add mistakes without benefit.

// Promise.resolve(value) wraps/adopts an existing value or Promise. Use
// new Promise((resolve, reject) => ...) only when adapting a callback/event API
// or creating custom asynchronous work.

// 10. What is a thenable?
// Detailed answer: A thenable is promise-like rather than necessarily a native Promise. Native
// Promise APIs adopt it so different libraries can interoperate. This convenience
// is why thenable code must be trusted: its .then() method is executed.

// Any object with a callable .then() method. Promise.resolve(thenable) adopts
// it, meaning the resulting native Promise follows its eventual outcome.

// 11. Are Promise callbacks synchronous or asynchronous?
// Detailed answer: The Promise executor runs immediately so it can begin the underlying work.
// Handlers run asynchronously as microtasks so registration is predictable: even
// an already-fulfilled Promise never calls a newly added handler in the middle of
// the current synchronous call stack.

// The executor passed to new Promise() runs synchronously. Handlers passed to
// .then(), .catch(), and .finally() run later as microtasks, even when the
// Promise is already settled.
console.log("Interview 11: start");
Promise.resolve().then(() => console.log("Interview 11: promise handler"));
console.log("Interview 11: end");
// Output: start, end, promise handler

// 12. What is the microtask queue, and why is it important?
// Detailed answer: The microtask queue is drained after the current JavaScript stack finishes
// and before the runtime takes the next timer/event task. Promise reactions use
// it, which explains why a .then() normally runs before setTimeout(..., 0).

// Promise handlers use the microtask queue. After current synchronous code
// finishes, JavaScript runs queued microtasks before moving to timer callbacks
// such as setTimeout() (the task/macrotask queue).

// 13. What is the output order here?
// Detailed answer: Synchronous logging happens first because it is on the current stack. The
// Promise handler is then run from the microtask queue. Finally the timer runs
// from the later task queue; a zero delay means "not before the current turn", not
// "run immediately".

setTimeout(() => console.log("Interview 13: timeout"), 0);
Promise.resolve().then(() => console.log("Interview 13: microtask"));
console.log("Interview 13: synchronous");
// Output: synchronous, microtask, timeout

// 14. What is Promise callback "callback hell" and how do Promises help?
// Detailed answer: Callback hell occurs when each callback starts the next operation inside a
// deeper block. Returning Promises keeps each step at the same indentation level,
// and errors can propagate automatically to one rejection handler.

// Callback hell is deeply nested callbacks that are difficult to read and
// handle errors in. Returning Promises produces a flat, sequential chain with
// centralized error handling.

// 15. What is the relationship between async/await and Promises?
// Detailed answer: An async function is syntax that builds a Promise-returning function. await
// resumes that function when its operand settles: fulfillment supplies a value,
// while rejection throws at the await expression. It does not block the JavaScript
// thread or pause unrelated code.

// async functions always return a Promise. await pauses only that async function
// until its Promise settles; it is syntax built on top of Promise behavior.
async function getGreeting() {
  const name = await Promise.resolve("Farrukh");
  return `Hello, ${name}`;
}

getGreeting().then(message => console.log("Interview 15:", message));

// 16. How do you handle a timeout or cancel a Promise?
// Detailed answer: Promise.race() can report a timeout first, but it cannot stop the original
// operation. Cancellation needs cooperation from the underlying API; fetch, for
// example, accepts AbortController.signal so abort() can stop the request itself.

// Promise.race() can choose a timeout result, but it does not stop the original
// work. For fetch, pass an AbortSignal from AbortController to actually cancel.

// 17. What is an unhandled Promise rejection?
// Detailed answer: An unhandled rejection means no rejection handler was attached in time for
// a rejected Promise. Runtimes may warn, log, or terminate because it often means
// a failure was silently lost. Return/await all Promises so error ownership stays
// visible, and catch errors at a deliberate boundary.

// It is a rejected Promise without a rejection handler. Always return/await
// Promises and handle errors with try/catch or .catch() at an appropriate level.

// -----------------------------------------------------------------------------
// Tricky and in-depth Promise interview questions
// -----------------------------------------------------------------------------

// 18. What does this print, and why?
// Detailed answer: The first handler logs "value" and implicitly returns undefined. Since the
// Promise returned by that .then() fulfills with undefined, the following handler
// receives undefined. Logging a value is a side effect; it does not forward that
// value unless the handler explicitly returns it.

Promise.resolve("value")
  .then(value => {
    console.log("Interview 18a:", value);
    // No return means this handler returns undefined.
  })
  .then(value => console.log("Interview 18b:", value));
// Output: "value", then undefined.

// 19. What is the difference between returning a Promise and nesting it?
// Detailed answer: Returning an inner Promise makes the outer chain adopt it, so the next step
// waits and a final catch sees its failure. Nesting without return creates a
// detached branch: the outer chain completes early and cannot reliably observe
// the branch's value or error.

// Returning keeps one chain and lets one final catch handle failures.
// Nesting creates an inner chain that the outer chain does not wait for.
Promise.resolve("Farrukh")
  .then(name => {
    return Promise.resolve(`Hello, ${name}`); // Correct: returned.
  })
  .then(message => console.log("Interview 19:", message));

// 20. Why is this error NOT caught by the outer catch?
// Detailed answer: The inner Promise is detached because it is created but not returned. The
// outer callback itself finishes normally, so its Promise fulfills with undefined
// and the outer catch has nothing to catch. Returning the inner Promise connects
// its rejection to the outer chain.

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
// Detailed answer: Settlement is first-call-wins. This protects callers from conflicting
// callbacks that try to report both success and failure. Calling resolve with a
// pending Promise is special: the outer Promise commits to following it, then
// settles when that inner Promise eventually settles.

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
// Detailed answer: Promise.resolve(existingPromise) can return exactly the same Promise when
// it was created by the same Promise constructor. There is no need to add another
// wrapper; preserving identity also avoids unnecessary scheduling and allocation.

// No. If promise is already a native Promise created by the same constructor,
// Promise.resolve(promise) returns the very same object.
const existingPromise = Promise.resolve("same object");
console.log(
  "Interview 22:",
  Promise.resolve(existingPromise) === existingPromise,
); // true

// 23. What is Promise resolution (or assimilation)?
// Detailed answer: Assimilation means a returned Promise/thenable controls the state of the
// Promise produced by .then(). It prevents nested results such as
// Promise<Promise<string>> and is why a chain naturally waits for returned async
// operations.

// If a handler returns a Promise or thenable, the Promise created by .then()
// adopts its state instead of fulfilling with the Promise object itself.
Promise.resolve()
  .then(() => Promise.resolve("adopted value"))
  .then(value => console.log("Interview 23:", value)); // adopted value

// 24. What happens if a chain returns itself?
// Detailed answer: A Promise cannot depend on its own result because it could never determine
// whether to fulfill or reject. JavaScript detects this circular resolution and
// rejects with TypeError instead of leaving the chain pending forever.

// It creates a circular resolution and rejects with TypeError.
let circularChain;
circularChain = Promise.resolve().then(() => circularChain);
circularChain.catch(error => console.log("Interview 24:", error.name)); // TypeError

// 25. Can one rejection handler receive errors from multiple earlier links?
// Detailed answer: Rejection travels forward through a chain until a rejection handler handles
// it. Each .then() without a suitable error handler passes the rejection onward,
// so one terminal catch can centrally handle failures from many earlier steps.

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
// Detailed answer: Both throw error and return Promise.reject(error) create a rejected next
// Promise. throw is simpler for an error discovered synchronously in the handler;
// returning a rejected Promise is useful when forwarding an already-Promise-based
// API result. Their observable chain behavior is otherwise equivalent.


// 27. What happens if finally() returns a rejected Promise?
// Detailed answer: finally() waits for anything it returns. A fulfilled cleanup result is
// ignored so the original outcome passes through, but a thrown error or rejected
// cleanup Promise means cleanup failed, so that failure replaces the earlier one.

// It overrides the earlier success or failure, and the resulting chain rejects.
Promise.resolve("original value")
  .finally(() => Promise.reject(new Error("Cleanup failed")))
  .catch(error => console.log("Interview 27:", error.message));

// 28. Why can await in a loop be slow, and when is it correct?
// Detailed answer: await inside for...of waits before starting the next iteration, so durations
// add together. That is correct for dependencies, ordered writes, or rate limits.
// Independent work should start first and be joined with Promise.all(), allowing
// the underlying operations to overlap.

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
// Detailed answer: forEach ignores the value returned from its callback, including Promises.
// Therefore awaiting the forEach call does not wait for its async callbacks. Use
// for...of when sequence is needed, or map() to create a Promise array followed
// by Promise.all() when work can be concurrent.

// forEach does not await its callback or return a Promise representing all work.
// Use for...of for sequential work, or map() plus Promise.all() for concurrent
// work instead.

// 30. Does Promise.race() provide a reliable timeout by itself?
// Detailed answer: race() only decides which result the caller receives first; it does not
// cancel losers. Without aborting the slow operation, it can keep consuming
// bandwidth, CPU, or resources and possibly produce side effects after timeout.

// It selects whichever result settles first, but losing operations continue.
// A real timeout should also cancel work when the underlying API supports it.
// Example with fetch: create AbortController, pass controller.signal to fetch,
// and call controller.abort() when the timeout expires.

// 31. What is the difference between concurrency and parallelism for Promises?
// Detailed answer: Concurrency means operations are in progress during the same time period.
// Parallelism means work physically executes simultaneously. Promise.all() starts
// no work by itself; it observes work already started. Actual parallelism depends
// on the browser, Node.js, network, OS, and whether workers are used.

// Starting several async operations before awaiting them is concurrent. Whether
// work runs in parallel depends on the underlying operation and JavaScript host
// (network, browser, Node.js, workers), not on Promise.all() itself.

// 32. How do Promise errors differ from errors in setTimeout callbacks?
// Detailed answer: Promise machinery catches exceptions only in its executor and registered
// reaction handlers. A later timer callback is a separate task, outside that
// Promise's execution context. To propagate its error, call reject(error) inside
// the timer callback or wrap that callback with try/catch and reject the Promise.

// A thrown error inside a Promise handler becomes a rejection in that chain. A
// throw inside a later setTimeout callback is outside the Promise unless that
// callback calls reject(error) or catches and forwards the error.
