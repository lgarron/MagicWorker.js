var workerCode = function() {
  this.addEventListener("message", function(e) {
    this.postMessage("Hello! You sent: " + e.data);
  }, false);
};

// Detect if we're in a web worker:
if (typeof importScripts === 'function') {
  workerCode();
}