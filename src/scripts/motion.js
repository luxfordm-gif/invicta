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
    ".section .eyebrow", ".statement",
    ".coverage-band__title",
    ".services-explore__card", ".services-explore__media",
    ".acc",
    ".positioning__intro > *", ".sector",
    ".why-card",
    ".stat",
    ".clients__viewport",
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

/* --- Mobile emergency button: hide once the footer is in view ---------------
   The footer carries the same contact details, so the floating call button
   bows out when the footer scrolls into view (and returns when it leaves).
   Class toggled on <html>; the fade itself lives in components.css. --------- */
(function () {
  "use strict";
  var dock = document.querySelector(".emergency-dock");
  if (!dock || !("IntersectionObserver" in window)) return;
  var footer = document.querySelector(".footer--b") ||
               document.querySelector(".footer");
  if (!footer) return;

  var io = new IntersectionObserver(function (entries) {
    document.documentElement.classList.toggle("footer-inview", entries[0].isIntersecting);
  }, { rootMargin: "0px 0px -12% 0px" });
  io.observe(footer);
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
    // Progress runs over a LONG travel so it never finishes abruptly: 0 while the
    // stage sits low in the viewport, reaching 1 only once it has scrolled well
    // past the top. Then it holds (clamped).
    var h = rect.height || 1;
    var startTop = vh * 0.9;    // p = 0 here
    var endTop = -h * 0.35;     // p = 1 here
    var p = (startTop - rect.top) / (startTop - endTop);
    p = Math.max(0, Math.min(1, p));
    wordmark.style.setProperty("--wm-scale", (1.2 - 0.2 * p).toFixed(3));     // big -> a touch smaller
    wordmark.style.setProperty("--wm-opacity", (0.05 + 0.95 * p).toFixed(3)); // very faint -> full
    portrait.style.setProperty("--pt-scale", (0.8 + 0.28 * p).toFixed(3));    // smaller -> bigger, then stops
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

/* --- Parallax media: the fallback engine ------------------------------------
   motion.css drives the drift off `animation-timeline: view()` wherever that
   exists. This is the same sum on rAF for the browsers that do not have it
   yet. Both read their numbers from the same two custom properties, so a
   component that overrides them is honoured either way, and travel:0 sits a
   picture out.

   Progress is measured on the FRAME, never the picture: the picture carries
   the transform, so measuring it would feed its own movement back in. Only
   what is on screen gets touched; an observer keeps the working set small. -- */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()")) return;
  if (!("IntersectionObserver" in window)) return;

  var pics = [].slice.call(document.querySelectorAll(".parallax > img"));
  if (!pics.length) return;

  var live = [];
  var ticking = false;

  function place(img) {
    var cs = getComputedStyle(img);
    var travel = parseFloat(cs.getPropertyValue("--parallax-travel")) || 0;
    var scale = parseFloat(cs.getPropertyValue("--parallax-scale")) || 1;
    var offset = parseFloat(cs.getPropertyValue("--parallax-offset")) || 0;
    // Travel 0 still needs the offset applied: a picture can be framed without
    // drifting (that is what the phone sector cards do).
    if (!travel) {
      img.style.transform = offset
        ? "translate3d(0," + offset + "%,0) scale(" + scale + ")"
        : "";
      return;
    }

    var r = img.parentNode.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 1;
    // 0 as the frame starts entering, 1 as it finishes leaving: the same span
    // `animation-range: cover 0% cover 100%` covers in the CSS.
    var p = (vh - r.top) / (vh + r.height);
    p = Math.max(0, Math.min(1, p));

    img.style.transform =
      "translate3d(0," + (offset + (p - 0.5) * 2 * travel).toFixed(2) + "%,0) scale(" + scale + ")";
  }

  function update() {
    ticking = false;
    for (var i = 0; i < live.length; i++) place(live[i]);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var at = live.indexOf(entries[i].target);
      if (entries[i].isIntersecting) { if (at === -1) live.push(entries[i].target); }
      else if (at !== -1) { live.splice(at, 1); }
    }
    update();
  });

  pics.forEach(function (img) { place(img); io.observe(img); });   // no unscaled first frame
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
