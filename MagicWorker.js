var MagicWorker = (function() {

  var inlineWorker = function(workerCode) {
    var blob = new Blob([workerCode]);
    var workerURL = window.URL.createObjectURL(blob);
    var worker = new window.Worker(workerURL);
    setTimeout(function () { window.URL.revokeObjectURL(workerURL); }, 1000);
    return worker;
  };

  var Worker = function (filename, fn) {
    try {
      return new window.Worker(filename);
    }
    catch (e) {
      // Check for Chrome security exception.
      if (e.code == 18) {
        var src = fn.toString();
        src = src.slice(0, src.lastIndexOf("}")).substring(src.indexOf("{") + 1);

        return inlineWorker(src);
      }
    }
  };

  return {
    Worker: Worker
  };
})();

