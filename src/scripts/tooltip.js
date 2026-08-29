/* ==========================================================================
   tooltip.js — the plain-English gloss on a term of art
   Pairs with /styles/components/tooltip.css.

   SITE-WIDE COMPONENT, CURRENTLY ADOPTED ON THE HOME PAGE ONLY. It binds to
   `[data-tooltip]` and nothing else, so it does its job on any page that
   includes it and does nothing at all on a page with no marked-up terms.

   ONE PANEL, NOT ONE PER TERM. The visible panel is a single element appended
   to <body> and moved to whichever term is active. A per-term panel nested
   beside its word would be cropped by any ancestor that clips (the parallax
   frames, the case carousels) and would inherit the stacking context of a
   sticky column, which puts it under the next section. Fixed positioning off
   <body> has neither problem.

   THE SCREEN-READER TEXT IS SEPARATE FROM THE PANEL, and that is deliberate.
   `aria-describedby` has to point at something stable that exists whether or
   not anything is hovered, so each term gets its own visually-hidden
   `role="tooltip"` node holding the same sentence. The visible panel is then
   purely a pointing device, and is `aria-hidden` so the definition is not
   announced twice.
   ========================================================================== */
(function () {
  "use strict";

  var terms = [].slice.call(document.querySelectorAll("[data-tooltip]"));
  if (!terms.length) return;

  var panel = document.createElement("div");
  panel.className = "tooltip-panel";
  panel.setAttribute("aria-hidden", "true");
  document.body.appendChild(panel);

  var active = null;

  /* Below the term and centred on it, unless there is no room below — then
     above. Clamped to an 8px viewport margin on every side, so a term at the
     end of a line never pushes its panel off-screen. Measured while the panel
     is `visibility: hidden` (which still lays out) so the first show is placed
     correctly rather than flashing in the wrong place. */
  function place(term) {
    var r = term.getBoundingClientRect();
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var x = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), Math.max(8, vw - w - 8));
    var y = r.bottom + 8;
    if (y + h > vh - 8) y = Math.max(8, r.top - h - 8);
    panel.style.transform = "translate(" + Math.round(x) + "px, " + Math.round(y) + "px)";
  }

  function show(term) {
    if (active === term) return;
    active = term;
    panel.textContent = term.getAttribute("data-tooltip");
    place(term);
    panel.classList.add("is-open");
    term.setAttribute("aria-expanded", "true");
  }

  function hide() {
    if (!active) return;
    active.removeAttribute("aria-expanded");
    active = null;
    panel.classList.remove("is-open");
  }

  terms.forEach(function (term, i) {
    var text = term.getAttribute("data-tooltip");
    if (!text) return;

    /* Reachable and describable. A term is not a link and not a button, so it
       gets tabindex rather than a role: the only thing it does is carry a
       description, which is exactly what `aria-describedby` announces. */
    var id = "tooltip-" + (i + 1);
    var sr = document.createElement("span");
    sr.className = "tooltip-a11y";
    sr.id = id;
    sr.setAttribute("role", "tooltip");
    sr.textContent = text;
    term.insertAdjacentElement("afterend", sr);
    term.setAttribute("aria-describedby", id);
    if (!term.hasAttribute("tabindex")) term.setAttribute("tabindex", "0");

    term.addEventListener("mouseenter", function () { show(term); });
    term.addEventListener("mouseleave", hide);
    term.addEventListener("focus", function () { show(term); });
    term.addEventListener("blur", hide);
    /* Touch has no hover, so a tap toggles. On a pointer this is harmless: the
       term is already showing from mouseenter, and the click re-shows it. */
    term.addEventListener("click", function (e) {
      e.preventDefault();
      if (active === term) hide(); else show(term);
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-tooltip]")) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });
  /* Fixed-position panel, scrolling page: the term moves and the panel does
     not, so dismiss rather than chase it. Same for a resize, which invalidates
     the measurement the placement was made from. */
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide, { passive: true });
})();
