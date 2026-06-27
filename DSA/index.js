function countDigits(n) {
    let count = 0;
    while (n > 0) {
        n /= 10;
        ++count;
    }
    console.log('count', count);
    return count;
}
countDigits(5);
// console.log(countDigits(123));
// console.log(countDigits(1));
// console.log(countDigits(1236574));
