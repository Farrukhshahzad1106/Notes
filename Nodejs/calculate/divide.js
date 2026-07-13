function calculateQuotient(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed.");
    }
    return Math.floor(a / b); // Using Math.floor to return the quotient as an integer
}