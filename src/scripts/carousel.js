/* --- Case-study carousel ----------------------------------------------------
   Progressive enhancement for every .case-cc block: the .case-cc__track is a
   horizontal scroll-snap list that already works with no JS. This adds:
     • prev/next arrows (data-cc-prev / data-cc-next)
     • a row of pagination dots that track the card in view
     • left/right keyboard control when the track has focus
   Each carousel is wired independently, so multiple can live on one page. --- */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var behavior = reduce ? "auto" : "smooth";

  document.querySelectorAll(".case-cc").forEach(function (root) {
    var track = root.querySelector(".case-cc__track");
    if (!track) return;
    var items = [].slice.call(track.querySelectorAll(".case-cc__item"));
    if (items.length < 2) return;

    var prev = root.querySelector("[data-cc-prev]");
    var next = root.querySelector("[data-cc-next]");
    var dotsWrap = root.querySelector(".case-cc__dots");

    function scrollToItem(i) {
      var el = items[Math.max(0, Math.min(items.length - 1, i))];
      if (el) el.scrollIntoView({ behavior: behavior, inline: "start", block: "nearest" });
    }

    // current = left-most fully-ish visible item
    function currentIndex() {
      var best = 0, bestDelta = Infinity;
      var base = track.scrollLeft;
      items.forEach(function (el, i) {
        var delta = Math.abs(el.offsetLeft - track.offsetLeft - base);
        if (delta < bestDelta) { bestDelta = delta; best = i; }
      });
      return best;
    }

    // --- dots ---
    var dots = [];
    if (dotsWrap) {
      items.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "case-cc__dot";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Go to project " + (i + 1));
        b.addEventListener("click", function () { scrollToItem(i); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function setActive(i) {
      dots.forEach(function (b, j) {
        var on = j === i;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= items.length - 1;
    }
    setActive(0);

    if (prev) prev.addEventListener("click", function () { scrollToItem(currentIndex() - 1); });
    if (next) next.addEventListener("click", function () { scrollToItem(currentIndex() + 1); });

    // keyboard: make the track focusable and respond to arrows
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToItem(currentIndex() + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); scrollToItem(currentIndex() - 1); }
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.6) {
            setActive(items.indexOf(en.target));
          }
        });
      }, { root: track, threshold: [0.6] });
      items.forEach(function (el) { io.observe(el); });
    } else {
      track.addEventListener("scroll", function () { setActive(currentIndex()); }, { passive: true });
    }
  });
})();
