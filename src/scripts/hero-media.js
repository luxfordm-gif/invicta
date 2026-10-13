/* ==========================================================================
   hero-media.js — the home hero's crossfading backdrop.

   Three <img> in .hp-hero__media, stacked by CSS, one of them carrying
   .is-active. All this does is move that class along on a timer; the fade
   itself is a CSS opacity transition, so nothing here touches layout and the
   whole thing stays on the compositor.

   It does nothing at all when:
     - there are fewer than two frames (nothing to cross to),
     - the visitor asks for reduced motion (the first frame stays put),
     - the tab is hidden (no point burning a timer nobody can see).

   No controls and no dots, deliberately. This is scenery behind a headline,
   not a gallery: /gallery/ is where pictures you operate live. That also means
   nothing here needs focus management or announcing, which is why the stack is
   aria-hidden in the markup.
   ========================================================================== */
(function () {
  "use strict";

  var HOLD = 6000;   /* how long each frame sits before the next one starts */

  var media = document.querySelector("[data-hero-media]");
  if (!media) return;

  var frames = media.querySelectorAll("img");
  if (frames.length < 2) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var i = 0;
  var timer = null;

  function step() {
    frames[i].classList.remove("is-active");
    i = (i + 1) % frames.length;
    frames[i].classList.add("is-active");
  }

  function start() {
    if (timer || reduce.matches || document.hidden) return;
    timer = window.setInterval(step, HOLD);
  }

  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  /* Honour the setting if it is changed while the page is open. addEventListener
     on a MediaQueryList is not in older Safari, hence the fallback. */
  if (reduce.addEventListener) {
    reduce.addEventListener("change", function () { stop(); start(); });
  } else if (reduce.addListener) {
    reduce.addListener(function () { stop(); start(); });
  }

  start();
})();
