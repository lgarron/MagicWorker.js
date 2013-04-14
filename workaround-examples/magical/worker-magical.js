(function(f) {if (typeof MagicWorker !== "undefined") {
    MagicWorker.register("worker-magical.js", f);
} else {f()}})(function() {

  this.addEventListener("message", function(e) {
    this.postMessage("Hello! You sent: " + e.data);
  }, false);

});