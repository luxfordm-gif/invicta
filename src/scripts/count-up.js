/* ==========================================================================
   count-up.js — figures that count up from zero as they come into view.

   Markup: an element with data-count-to="20" (and optionally
   data-count-suffix="+"). It already holds the final figure, so with no JS or
   with reduced motion asked for, the real number simply shows. Pair it with a
   visually hidden copy of the figure and aria-hidden on this one, so a screen
   reader hears the number once rather than every step of the count.

   A ROW COUNTS TOGETHER. Figures inside the same [data-count-group] start at
   the same moment, when the group's top passes 85% of the window, so three
   numbers side by side arrive as one beat rather than one after another.

   SCROLL POSITION, NOT IntersectionObserver. The same rect check the site's
   reveal engine uses (motion.js), throttled the same way, so the two never
   disagree about whether something is on screen.

   Used on the home page's positioning section (14/10/26).
   ========================================================================== */
(function () {
  "use strict";

  var els = [].slice.call(document.querySelectorAll("[data-count-to]"));
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var DURATION = 1400;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function run(el) {
    var to = parseInt(el.getAttribute("data-count-to"), 10) || 0;
    var suffix = el.getAttribute("data-count-suffix") || "";
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DURATION);
      el.textContent = Math.round(to * easeOut(t)) + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
      else el.textContent = to + suffix;   // land exactly, whatever the frame timing
    }
    window.requestAnimationFrame(frame);
  }

  // Group the figures by their [data-count-group] (or each on its own).
  var groups = [];
  els.forEach(function (el) {
    var g = el.closest("[data-count-group]") || el;
    var found = groups.filter(function (x) { return x.el === g; })[0];
    if (!found) groups.push(found = { el: g, figures: [] });
    found.figures.push(el);
  });

  // Start every figure at zero, its width held at the final figure's so the
  // row does not shuffle as digits grow.
  els.forEach(function (el) {
    el.style.display = "inline-block";
    el.style.minWidth = el.getBoundingClientRect().width + "px";
    el.textContent = "0" + (el.getAttribute("data-count-suffix") || "");
  });

  var scheduled = false;
  function check() {
    scheduled = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    groups = groups.filter(function (g) {
      var r = g.el.getBoundingClientRect();
      if (r.top < vh * 0.85 && r.bottom > 0) {
        g.figures.forEach(run);
        return false;
      }
      return true;
    });
    if (!groups.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }
  function onScroll() {
    if (!scheduled) { scheduled = true; setTimeout(check, 100); }
  }

  check();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
