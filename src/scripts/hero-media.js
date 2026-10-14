/* ==========================================================================
   hero-media.js — crossfading image stacks ([data-crossfade]): today, the
   flagship services card on the home page. It was written for the old home
   hero's backdrop ([data-hero-media], still matched), which became a running
   photo strip on 14/10/26. Each stack runs on its own timer, set by
   data-crossfade-hold.

   A few <img> stacked by CSS, one of them carrying .is-active. All this does is move that class along on a timer; the fade
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

/* --------------------------------------------------------------------------
   The home hero's photo strip, moved by the page scroll (14/10/26).

   Sets --strip-shift on the track to a share of the scroll position, so the
   band sits still at the top of the page and slides left as you scroll down.
   RATE is pixels of slide per pixel of scroll: at 0.6 the band travels a
   little over half a screen's width while the hero scrolls away, enough to
   read as movement tied to your hand without the pictures racing.

   Only runs while the strip is on screen, does nothing with reduced motion
   asked for, and writes once per frame however fast the scroll events come.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var RATE = 0.6;
  var track = document.querySelector(".hp-hero__track");
  if (!track) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var strip = track.parentElement;
  var queued = false;

  function update() {
    queued = false;
    var r = strip.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;   // off screen
    track.style.setProperty("--strip-shift", (window.scrollY * RATE).toFixed(1) + "px");
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
})();
