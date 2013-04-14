# MagicWorker.js

Web workers are awesome because they allow you to run computations in a webpage without locking up the page. Most major browsers [support it now](http://caniuse.com/#feat=webworkers), and there is good [documentation](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers) and [tutorials](http://www.html5rocks.com/en/tutorials/workers/basics/).

## The Problem

Web workers don't work in every environment you might want, because of restrictions in Chrome:

- Web workers work for sites on the internet.
- Web workers work offline for sites using the [offline application cache](http://html5doctor.com/go-offline-with-application-cache/). However, this requires the user to visit the page and save the content, and is only available in that browser installation.
- Opening a saved HTML file, e.g. by clicking on it in the OS file browser, *does* allow web workers, *EXCEPT IN GOOGLE CHROME*.

Chrome is wonderfully fast at some things, so it would be great if we could test and run "offline apps" that use web workers by opening oin any major browser them like normal files. However, trying to create a web worker using `new Worker("file.js")` in the usual way results in `SECURITY_ERR: DOM Exception 18`.

## Usage

- 1) Add `MagicWorker.js` to your project.
- 2) Include `MagicWorker.js` and all your web worker files in your webpage using a normal script tag.
- 3) Modify each web worker script by prepending the line:

        var workerCode = function() {

and appending the line:

        }; if (typeof importScripts === 'function') {workerCode();}

If there is more than one script, change `workerCode` to a different variable name for each.

- 4) Modify the relevant calls from `new Worker("file.js")` to `new MagicWorker("file.js", workerCode)` (replace `workerCode` with the function name from step 3).

## Caveats

- Currently, each web worker code file must be self-contained. Any `importScripts` calls must be replaced with actual code if you want them to work offline. It might be reasonable to combine multiple web worker source files into one, which allows the code to interact by living in the same wrapper.

- You'll get a `Resource interpreted as Script but transferred with MIME type text/plain: "blob:null/********-****-****-****-************". ` warning for every web worker loaded using a string.

- Not tested in Internet Explorer. Chrome, Firefox, Safari, and Opera all work (although the workaround is mainly for Chrome).

## How does it work?

It's possible to create an [inline web worker](http://www.html5rocks.com/en/tutorials/workers/basics/#toc-inlineworkers) by using a string containing source code instead of a file name. The trick lies in allowing the browser to create a web worker like usual (if possible), but fall back to a string if it fails.. There are many ideas for this that seem promising, but very few of them work.

It's possible to convert the web worker code into a string, but this is tedious, and requires having two versions of the code (unless you use `eval`). Chrome also has security measures that make it difficult to have a representation of code that can be run directly *or* as a string, but there are two generic ways to do it: place your source code in a script tag, or use the `toString()` function. Placing the source code in a script tag requires adding it to your HTML file, so I've opted for the latter. Thus, the full sequence for a web worker using `MagicWorker.js` is:

- In the execution of the `<script>` tag, we create a wrapper function the our web worker.
- Since we're not in a web worker environment, the function isn't executed.
- A call to `MagicWorker.create("file.js", workerCode)` tries to create a web worker using the file name.
    - If this succeeds, the web worker creates the wrapper function and *does* execute it, immediately.
    - If we encounter a security exception with code 18, we try creating the web worker as follows:
        - Convert the function to a string using `toString()` to get its source code, then strip the anonymous wrapper function.
        - Create a blob from the string.
        - Creatie a temporary object URL for the blob.
        - Create a worker with the temporary URL.
        - (Set a timeout to release the temporary URL, for garbage collection.)

## Resources

- [caniuse.com](http://caniuse.com/#feat=webworkers)
- [HTML5 Rocks](http://www.html5rocks.com/en/tutorials/workers/basics/)
- Also trying to figure out the offline application cache? Try [offline-bootstrap](https://github.com/lgarron/offline-bootstrap).
- [codeproject.com](http://www.codeproject.com/Articles/321893/Working-with-Inline-Web-Workers) - An article by Gil Fink with that reminded me to release the blob URLs.