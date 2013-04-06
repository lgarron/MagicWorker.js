(function(f) {if (typeof MagicWorker !== "undefined") {
    MagicWorker.register("demo-worker.js", f);
} else {f()}})(function() {
  this.addEventListener('message', function(e) {

    var max = e.data;
    var numPrimesUnder = primesUnder(max);
    this.postMessage('Number of primes under ' + max + ': ' + numPrimesUnder);

  }, false);


  var isPrime = function(n) {
    
    for (var i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
      if (n % i == 0) {
        return false;
      }
    }

    return true;
  }


  var primesUnder = function(max) {

    var total = 0;

    for (var i = 2; i < max; i++) {
      if (isPrime(i)) {
        total++
      }
    }

    return total;
  }
});