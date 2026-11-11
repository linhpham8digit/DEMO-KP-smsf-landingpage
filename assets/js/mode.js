/* Runs in <head>, before the page is drawn. A visitor sent here by the quiz has already
   given their details, so the page shows without the form (see .from-quiz in landing.css).
   Doing it this early means the form never flashes up and disappears. */
(function () {
  try {
    if (new URLSearchParams(window.location.search).get("from") === "quiz") {
      document.documentElement.classList.add("from-quiz");
    }
  } catch (e) { /* old browser: the page simply shows as normal */ }
})();
