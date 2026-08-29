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

Promise.resolve({ name: "Asha" })
  .then(user => {
    saveUser(user); // Incorrect: this Promise is not returned.
  })
  .then(() => console.log("Runs before saving is guaranteed to finish."));

Promise.resolve({ name: "Asha" })
  .then(user => {
    return saveUser(user); // Correct: the chain now waits.
  })
  .then(() => console.log("Runs after saving finishes."));

// 5. Preserve a value after a side effect.
Promise.resolve({ name: "Asha" })
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
