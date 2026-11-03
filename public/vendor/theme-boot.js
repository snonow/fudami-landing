/* Sets the theme class before the first paint. Load it in <head>, synchronously, from the site's own
   origin (a strict CSP forbids the inline version). Without it the page paints in the default theme
   and flips once chrome.js runs: the "loads dark, then switches to light" flash. Same rule as initTheme. */
(function () {
  var dark = false;
  try {
    var saved = localStorage.getItem("fudami-theme");
    dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) { /* storage or matchMedia unavailable: light */ }
  var cl = document.documentElement.classList;
  cl.toggle("dark", dark);
  cl.toggle("light", !dark);
})();
