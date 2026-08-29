/* --- Scroll-snap tracks -----------------------------------------------------
   Progressive enhancement for .case-bento, which becomes a one-card-per-screen
   swipeable track below 900px. It works with no JS as a plain scrollable list;
   this adds a row of pagination dots that track the card in view. Each block is
   wired independently, so several can live on one page.

   The generic wire() below still supports prev/next arrows (data-cc-prev /
   data-cc-next) and keyboard control. Nothing uses them today: they were for
   the full-width .case-cc carousel, which lost the layout A/B to the bento and
   was deleted with the lab page. Kept because the next track that needs arrows
   should not have to rebuild them. --- */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var behavior = reduce ? "auto" : "smooth";

  function wire(root, sel) {
    var track = root.querySelector(sel.track);
    if (!track) return;
    var items = [].slice.call(track.querySelectorAll(sel.item));
    if (items.length < 2) return;

    var prev = root.querySelector("[data-cc-prev]");
    var next = root.querySelector("[data-cc-next]");
    var dotsWrap = root.querySelector(sel.dots);

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
        b.className = sel.dotClass;
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
    if (sel.keyboard) {
      track.setAttribute("tabindex", "0");
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); scrollToItem(currentIndex() + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); scrollToItem(currentIndex() - 1); }
      });
    }

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
  }

  document.querySelectorAll(".case-bento").forEach(function (root) {
    wire(root, {
      track: ".bento",
      item: ".bento__cell",
      dots: ".bento__dots",
      dotClass: "bento__dot",
      keyboard: false
    });
  });
})();
