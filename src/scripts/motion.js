/* ==========================================================================
   motion.js — reveal-on-scroll (restrained fade + rise)
   Pairs with motion.css. Respects prefers-reduced-motion.
   Rect-based (rAF-throttled) so content is never left stuck hidden — the
   in-view check runs on load, on scroll, and on resize.
   ========================================================================== */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var sel = [
    ".hero__eyebrow", ".hero__title", ".hero__scroll", ".hero__lead",
    ".band__bar",
    ".section .eyebrow", ".statement",
    ".acc",
    ".positioning__intro > *", ".sector",
    ".stat",
    ".client",
    ".footer__cta", ".footer__grid > *", ".footer__meta",
    ".footer__wordmark", ".footer__mark"
  ].join(", ");

  var pending = [].slice.call(document.querySelectorAll(sel));
  if (!pending.length) return;

  var scheduled = false;

  function reveal() {
    scheduled = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("is-in");
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  function onScroll() {
    if (!scheduled) { scheduled = true; setTimeout(reveal, 100); }
  }

  reveal(); // reveal whatever is already on/above the fold
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

/* --- About hero: scroll-scrub the background wordmark + portrait ------------
   As the hero stage moves up the viewport, the oversized "Invicta" wordmark
   shrinks (large -> small) and fades up (0.8 -> 1.0), and the portrait scales up.
   Only runs on pages that have the stage; respects reduced-motion. --------- */
(function () {
  "use strict";
  var stage = document.querySelector("[data-hero-stage]");
  if (!stage) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var wordmark = stage.querySelector(".about-hero__wordmark");
  var portrait = stage.querySelector(".about-hero__portrait");
  if (!wordmark || !portrait) return;

  var ticking = false;
  function update() {
    ticking = false;
    var rect = stage.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 1;
    var p = (vh - rect.top) / (vh + rect.height);   // 0 (below fold) -> 1 (scrolled past)
    p = Math.max(0, Math.min(1, p));
    wordmark.style.setProperty("--wm-scale", (1.28 - 0.36 * p).toFixed(3));
    wordmark.style.setProperty("--wm-opacity", (0.8 + 0.2 * p).toFixed(3));
    portrait.style.setProperty("--pt-scale", (0.94 + 0.14 * p).toFixed(3));
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
