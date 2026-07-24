const cart = ['Iphone', 'Macbook', 'Airpods'];
createOrder(cart)
.then(orderId => proceedToPayment(orderId))
.then(paymentInfo => showOrderSummary(paymentInfo))
.then(orderSummary => console.log(orderSummary))
.catch(err => console.log(err.message));

function createOrder(cart) {
    return new Promise((resolve, reject) => {
        if (!cart || cart.length === 0) {
            reject(new Error("Cart is empty. Cannot create order."));
        } else {
            const orderId = Math.floor(Math.random() * 10000);
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
            reject(new Error("Payment failed. Cannot show order summary."));   
        } else {
            const orderSummary = `Order ID: ${paymentInfo.orderId}, Status: ${paymentInfo.status}`;
            resolve(orderSummary);
        }
    })}
