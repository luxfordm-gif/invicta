/* ==========================================================================
   hero-media.js — crossfading image stacks: the home hero's backdrop, and
   the flagship services card ([data-crossfade], 14/10/26). Each stack runs on
   its own timer; data-crossfade-hold sets it, so the card can run slower
   than the hero and the two never change together.

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

  var HOLD = 6000;   /* default: how long each frame sits before the next one starts */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  [].forEach.call(document.querySelectorAll("[data-hero-media], [data-crossfade]"), crossfade);

  function crossfade(media) {
  var frames = media.querySelectorAll("img");
  if (frames.length < 2) return;

  var hold = parseInt(media.getAttribute("data-crossfade-hold"), 10) || HOLD;
  var i = 0;
  var timer = null;

  function step() {
    frames[i].classList.remove("is-active");
    i = (i + 1) % frames.length;
    frames[i].classList.add("is-active");
  }

  function start() {
    if (timer || reduce.matches || document.hidden) return;
    timer = window.setInterval(step, hold);
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
  }
})();
