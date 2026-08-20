/* --- Filmstrip ---------------------------------------------------------------
   Enhancement for the drag-along photography band (_includes/filmstrip.njk).
   The markup is already a centre-snapping scroll list, so with no JS it swipes
   and snaps on its own. This adds, for pointers that can do it:

     • an endless loop: the set of frames is cloned either side of itself, so
       there is always a picture left and right and the row never runs out
     • mouse drag along the track, with a fling that carries on after release
       and settles the nearest frame back into the centre
     • a "Drag" bubble that follows the cursor while it is over the track
     • left/right keyboard control

   Touch is left entirely alone: the browser's own momentum and snapping are
   better than anything re-implemented here.
   --- */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".filmstrip").forEach(function (root) {
    var track = root.querySelector(".filmstrip__track");
    if (!track) return;
    var items = [].slice.call(track.querySelectorAll(".filmstrip__item"));
    if (items.length < 2) return;

    /* --- the loop ---------------------------------------------------------
       A copy of the whole set is laid before and after the real one. The
       middle set is what a visitor starts on, and because the content repeats
       exactly, scrollLeft can be jumped forward or back by one set width
       without anything appearing to move. That jump happens only once the
       track has come to rest, so it can never interrupt a fling.
       The copies are hidden from assistive tech: the same seven photographs
       three times over is noise, not content. --- */
    var real = items.length;
    var looping = real >= 3;

    if (looping) {
      var before = document.createDocumentFragment();
      var after = document.createDocumentFragment();
      items.forEach(function (el) {
        [before, after].forEach(function (frag) {
          var clone = el.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          frag.appendChild(clone);
        });
      });
      track.insertBefore(before, items[0]);
      track.appendChild(after);
      items = [].slice.call(track.querySelectorAll(".filmstrip__item"));
      root.classList.add("is-loop");
    }
    root.classList.add("is-live");

    // One set's width, measured rather than assumed: the gap between a frame
    // and the copy of itself one set along.
    function setWidth() {
      if (!looping) return 0;
      return items[real].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
    }

    function wrap() {
      var w = setWidth();
      if (!w) return;
      if (track.scrollLeft < w * 0.5) track.scrollLeft += w;
      else if (track.scrollLeft > w * 1.5) track.scrollLeft -= w;
    }

    /* --- settling -------------------------------------------------------- */
    // Where the track has to sit for frame i to be centred.
    function restFor(i) {
      var tr = track.getBoundingClientRect();
      var r = items[i].getBoundingClientRect();
      return track.scrollLeft + (r.left + r.width / 2) - (tr.left + tr.width / 2);
    }

    function nearestTo(left) {
      var best = 0, bestDelta = Infinity;
      items.forEach(function (_, i) {
        var d = Math.abs(restFor(i) - left);
        if (d < bestDelta) { bestDelta = d; best = i; }
      });
      return best;
    }

    function settle(i, instant) {
      i = Math.max(0, Math.min(items.length - 1, i));
      root.classList.add("is-free");   // dropped again by the rest timer below
      track.scrollTo({ left: restFor(i), behavior: (instant || reduce) ? "auto" : "smooth" });
    }

    // Start on the first real frame, in the middle set, with its neighbours
    // already showing either side.
    settle(looping ? real : 0, true);
    root.classList.remove("is-free");

    // Snapping stays off until the track has actually come to a stop, so the
    // browser cannot yank a fling straight to the nearest frame mid-flight,
    // and the loop is stitched at the same moment for the same reason.
    var rest;
    track.addEventListener("scroll", function () {
      clearTimeout(rest);
      rest = setTimeout(function () {
        if (dragging) return;
        wrap();
        root.classList.remove("is-free");
      }, 140);
    }, { passive: true });

    var resized;
    window.addEventListener("resize", function () {
      clearTimeout(resized);
      // Frame sizes are tied to the viewport, so a resize moves every rest
      // position. Put whatever was centred back in the centre.
      resized = setTimeout(function () {
        settle(nearestTo(track.scrollLeft), true);
        wrap();
      }, 150);
    });

    /* --- wheel ------------------------------------------------------------
       A horizontal scroller under the pointer swallows a vertical wheel in
       Chrome and Firefox and spends it moving sideways, so a visitor scrolling
       the page has to grind through every frame before the page moves again.
       Vertical wheels are handed back to the page; a sideways trackpad swipe
       still belongs to the strip. --- */
    // The page sets html { scroll-behavior: smooth }, which a wheel tick must
    // not inherit: each tick would start a fresh animation that the next one
    // cancels, and the page would sit still. Ask for an instant scroll where
    // the browser understands it, and turn smooth off around the call where
    // it does not.
    var canScrollInstantly = false;
    try {
      window.scrollBy({ top: 0, behavior: "instant" });
      canScrollInstantly = true;
    } catch (err) { /* older browser: fall back below */ }

    function pageBy(dy) {
      if (canScrollInstantly) {
        window.scrollBy({ top: dy, left: 0, behavior: "instant" });
        return;
      }
      var doc = document.documentElement;
      var was = doc.style.scrollBehavior;
      doc.style.scrollBehavior = "auto";
      window.scrollBy(0, dy);
      doc.style.scrollBehavior = was;
    }

    track.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;                      // lines (Firefox)
      else if (e.deltaMode === 2) dy *= window.innerHeight;  // pages
      pageBy(dy);
    }, { passive: false });

    /* --- mouse drag ------------------------------------------------------ */
    var dragging = false, pid = null;
    var startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      pid = e.pointerId;
      startX = lastX = e.clientX;
      startLeft = track.scrollLeft;
      lastT = e.timeStamp;
      vel = 0;
      root.classList.add("is-dragging", "is-free");
      track.setPointerCapture(pid);
      e.preventDefault();   // no text selection, no image ghost
    });

    track.addEventListener("pointermove", function (e) {
      if (!dragging || e.pointerId !== pid) return;
      var dt = e.timeStamp - lastT;
      // px per ms, smoothed; a long gap means the drag paused, so start over
      if (dt > 0) {
        var v = (e.clientX - lastX) / dt;
        vel = dt > 90 ? 0 : vel * 0.7 + v * 0.3;
        lastX = e.clientX;
        lastT = e.timeStamp;
      }
      track.scrollLeft = startLeft - (e.clientX - startX);
    });

    function release(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false;
      root.classList.remove("is-dragging");
      if (pid !== null && track.hasPointerCapture(pid)) track.releasePointerCapture(pid);
      // Holding still before letting go should not fling.
      if (e && e.timeStamp - lastT > 90) vel = 0;
      // Carry the throw a little further, then settle on whatever is nearest.
      settle(nearestTo(track.scrollLeft - vel * (reduce ? 0 : 260)));
      pid = null;
    }

    track.addEventListener("pointerup", release);
    track.addEventListener("pointercancel", release);

    /* --- keyboard -------------------------------------------------------- */
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      settle(nearestTo(track.scrollLeft) + (e.key === "ArrowRight" ? 1 : -1));
    });

    /* --- cursor cue ------------------------------------------------------ */
    var cue = root.querySelector(".filmstrip__cue");
    if (!cue || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var cueX = 0, cueY = 0, toX = 0, toY = 0, chasing = false;

    // The bubble trails the pointer rather than pinning to it: it is the whole
    // difference between a cursor swap and something that feels alive.
    function chase() {
      var k = reduce ? 1 : 0.2;
      cueX += (toX - cueX) * k;
      cueY += (toY - cueY) * k;
      cue.style.transform = "translate3d(" + cueX.toFixed(1) + "px," + cueY.toFixed(1) + "px,0)";
      if (Math.abs(toX - cueX) > 0.4 || Math.abs(toY - cueY) > 0.4) {
        requestAnimationFrame(chase);
      } else {
        chasing = false;
      }
    }

    function aim(x, y, jump) {
      toX = x; toY = y;
      if (jump) { cueX = x; cueY = y; }
      if (!chasing) { chasing = true; requestAnimationFrame(chase); }
    }

    function show(e) {
      if (e.pointerType === "touch") return;
      aim(e.clientX, e.clientY, !root.classList.contains("has-cue"));
      root.classList.add("has-cue");
      cue.classList.add("is-on");
    }

    // pointerover as well as pointermove: a pointer that arrives without
    // crossing the boundary (the page scrolling under a still mouse) fires
    // neither enter nor move, and the cue would sit there missing.
    track.addEventListener("pointerover", show);
    track.addEventListener("pointermove", show);
    track.addEventListener("pointerleave", function () {
      root.classList.remove("has-cue");
      cue.classList.remove("is-on");
    });
  });
})();
