/* --- Page control (carousel dots), shared by every swipe track ---------------
   nav.js (sectors, USPs, stats, why-cards, testimonials) and carousel.js (case
   bento, home page case studies) both build their dots through this, so there
   is one markup, one behaviour and one style (.dots in components.css, sized
   by the --dot-* tokens).

   The row is a SINGLE control, the way the iOS page control is: VoiceOver
   reads that as "page 2 of 8, adjustable", and the web equivalent is
   role="slider". That is what lets the dots sit close together. As separate
   buttons each one had to be a 24px target (WCAG 2.5.8, which Lighthouse
   flagged), which spread an eight-dot row across 192px. Now the whole row is
   the target: a tap goes to the dot nearest the finger, and the arrow, Home
   and End keys step through.

     var ctl = pageDots(row, count, {
       label: "Case studies",          // the control's accessible name
       noun: "Case study",             // valuetext: "Case study 2 of 8"
       go: function (i) { ... },       // scroll item i into view
       step: function (d) { ... }      // optional: own the arrow keys (looping)
     });
     ctl.set(i);                       // call when the track settles on item i
   --- */
window.pageDots = function (row, count, opts) {
  "use strict";
  var current = 0;
  var marks = [];

  row.classList.add("dots");
  row.setAttribute("role", "slider");
  row.setAttribute("tabindex", "0");
  row.setAttribute("aria-label", opts.label);
  row.setAttribute("aria-orientation", "horizontal");
  row.setAttribute("aria-valuemin", "1");
  row.setAttribute("aria-valuemax", String(count));

  for (var i = 0; i < count; i++) {
    var m = document.createElement("span");
    m.className = "dots__dot";
    m.setAttribute("aria-hidden", "true");
    row.appendChild(m);
    marks.push(m);
  }

  function set(i) {
    current = i;
    marks.forEach(function (m, j) { m.classList.toggle("is-active", j === i); });
    row.setAttribute("aria-valuenow", String(i + 1));
    row.setAttribute("aria-valuetext", opts.noun + " " + (i + 1) + " of " + count);
  }

  function go(i) {
    i = Math.max(0, Math.min(count - 1, i));
    set(i);
    opts.go(i);
  }

  // Nearest mark to the tap, measured centre to centre, so the gaps between
  // dots and the padding at either end all count as part of the target.
  row.addEventListener("click", function (e) {
    var best = 0, bestDelta = Infinity;
    marks.forEach(function (m, j) {
      var r = m.getBoundingClientRect();
      var delta = Math.abs(e.clientX - (r.left + r.width / 2));
      if (delta < bestDelta) { bestDelta = delta; best = j; }
    });
    go(best);
  });

  row.addEventListener("keydown", function (e) {
    var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (d) {
      e.preventDefault();
      if (opts.step) opts.step(d); else go(current + d);
    } else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(count - 1); }
  });

  set(0);
  return { set: set };
};
