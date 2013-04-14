# Simple Workarounds

Examples of web worker workarounds for my blog post.

- `simple-worker`: Doesn't work in Chrome offline.
- `two-sources`: Keep the worker source in a file *and* in a string.
- `one-source`: Use `toString()` on function to keep the source in only one place.
- `magical`: Using `MagicWorker.js`.