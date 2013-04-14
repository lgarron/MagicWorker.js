this.addEventListener("message", function(e) {
  this.postMessage("Hello! You sent: " + e.data);
}, false);