/* --- Scroll-snap tracks -----------------------------------------------------
   Progressive enhancement for .case-bento, which becomes a one-card-per-screen
   swipeable track below 900px, and for the home page's .hp-cases, which is a
   one-study-at-a-time carousel at every width, with arrows above 900px. It works with no JS as a plain scrollable list;
   this adds a row of pagination dots that track the card in view. Each block is
   wired independently, so several can live on one page.

   The generic wire() supports prev/next arrows (data-cc-prev / data-cc-next),
   keyboard control and an onChange hook. The home page's case studies are the
   track that uses the arrows. --- */
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
        b.setAttribute("aria-label", "Go to case study " + (i + 1));
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
      if (sel.onChange) sel.onChange(i);
    }
    setActive(0);

    // Step from where the track is HEADING, not where it is: a second press
    // mid-scroll would otherwise read the slide still under the viewport and
    // land on the same one. Cleared when the scroll settles.
    var target = null, settle;
    function step(d) {
      var from = target === null ? currentIndex() : target;
      target = Math.max(0, Math.min(items.length - 1, from + d));
      scrollToItem(target);
      clearTimeout(settle);
      settle = setTimeout(function () { target = null; }, 900);
    }
    track.addEventListener("scrollend", function () { target = null; });
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    // keyboard: make the track focusable and respond to arrows
    if (sel.keyboard) {
      track.setAttribute("tabindex", "0");
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
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

  document.querySelectorAll(".hp-cases").forEach(function (root) {
    var counter = root.closest("section").querySelector("[data-cases-current]");
    wire(root, {
      track: ".hp-cases__track",
      item: ".hp-case",
      dots: ".hp-cases__dots",
      dotClass: "hp-cases__dot",
      keyboard: true,
      onChange: function (i) {
        if (counter) counter.textContent = (i < 9 ? "0" : "") + (i + 1);
      }
    });
  });
})();
