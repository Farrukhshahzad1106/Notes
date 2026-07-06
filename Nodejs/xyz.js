console.log("logging from xyz.js");

console.log("As per module caching, this file will be executed only once even if we import it multiple times in different files. This is because nodejs caches the module after the first time it is imported and then returns the cached version of the module for subsequent imports.");