/* Mobile nav toggle + a subtle hairline on the sticky nav once scrolled. */
(function () {
  "use strict";
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  var root = document.documentElement;
  var mq = window.matchMedia("(max-width: 900px)");

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
    root.classList.remove("nav-open");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
      root.classList.toggle("nav-open", !open);
      // Opening the full-screen menu: make sure the nav has no transform, or it
      // would become the containing block for the fixed inset:0 overlay.
      if (!open) root.classList.remove("header-up");
    });

    // The dropdown labels ("Services", "Sectors") aren't pages — they're just the
    // opener for their menu. Never navigate: on desktop the menu reveals on
    // hover/focus, on mobile we toggle the accordion.
    [].forEach.call(links.querySelectorAll(".nav__item.has-menu > a"), function (parent) {
      parent.addEventListener("click", function (e) {
        e.preventDefault();
        if (mq.matches) parent.parentNode.classList.toggle("is-expanded");
      });
    });

    // Close the menu when a real navigation link is tapped (not an accordion toggle).
    links.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var li = a.closest("li");
      var isParentToggle = li && li.classList.contains("has-menu") && a.parentElement === li;
      if (isParentToggle && mq.matches) return;
      closeMenu();
    });
  }
  var nav = document.querySelector(".nav");
  if (nav) {
    // Keep --nav-h matched to the nav's REAL height so the sticky breadcrumb sits
    // flush beneath it (a hardcoded value drifts when fonts load or type reflows,
    // opening a gap that shows the page behind it).
    var setNavH = function () {
      root.style.setProperty("--nav-h", nav.offsetHeight + "px");
    };
    setNavH();
    window.addEventListener("resize", setNavH, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setNavH);

    var reduceNav = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Smart-hide runs on desktop only. On mobile the utility bar is hidden and
    // the nav is pinned to the very top, so it stays exactly as-is there.
    var deskMq = window.matchMedia("(min-width: 900px)");
    var lastY = window.scrollY;
    var ticking = false;
    function applyNav() {
      ticking = false;
      var y = window.scrollY < 0 ? 0 : window.scrollY;
      nav.classList.toggle("is-scrolled", y > 8);
      // Smart header: on desktop, scrolling DOWN past the header slides the nav
      // and breadcrumb up out of view; scrolling UP (or returning near the top)
      // brings them back. The utility bar with the contact number stays pinned
      // throughout. A small delta threshold avoids flicker on tiny jitters.
      if (deskMq.matches && !reduceNav.matches) {
        var delta = y - lastY;
        if (delta > 4 && y > 160) {
          root.classList.add("header-up");        // scrolling down, clear of the header
        } else if (delta < -4 || y <= 160) {
          root.classList.remove("header-up");     // scrolling up, or back near the top
        }
      } else {
        root.classList.remove("header-up");
      }
      lastY = y;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(applyNav); } }
    applyNav();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Back-to-top: the #top target is the sticky utility bar (always pinned at the
  // viewport top), so the native anchor does nothing — scroll to 0 explicitly.
  var backToTop = document.querySelector(".footer__top");
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
})();

/* --- Emergency pill: adapt its tone to the band behind it --------------------
   The floating call pill is frosted and translucent, so over a light band a
   light pill would wash out. On each scroll we sample the element directly
   behind the pill's centre and, if that band reads light, flip
   html.dock-on-light (CSS then swaps the pill to deep navy). Mobile only. */
(function () {
  "use strict";
  var dock = document.querySelector(".emergency-dock");
  var cta = dock && dock.querySelector(".emergency-cta");
  if (!cta) return;
  var root = document.documentElement;
  var mq = window.matchMedia("(max-width: 899.98px)");

  // Luminance of the nearest ancestor with a non-transparent background.
  function toneBehind(el) {
    while (el && el !== document.body) {
      var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (m) {
        var p = m[1].split(",").map(parseFloat);
        var a = p[3] === undefined ? 1 : p[3];
        if (a > 0.1) {
          var lum = 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
          return lum > 140 ? "light" : "dark";
        }
      }
      el = el.parentElement;
    }
    return "dark";
  }

  var ticking = false;
  function sampleDock() {
    ticking = false;
    if (!mq.matches) { root.classList.remove("dock-on-light"); return; }
    var r = cta.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    if (cy < 0 || cy > window.innerHeight) return;         // pill off-screen mid-transition
    // Let the hit-test fall through the pill to the band underneath it.
    var prev = cta.style.pointerEvents;
    cta.style.pointerEvents = "none";
    var behind = document.elementFromPoint(cx, cy);
    cta.style.pointerEvents = prev;
    if (behind) root.classList.toggle("dock-on-light", toneBehind(behind) === "light");
  }
  function onDockScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sampleDock); } }

  window.addEventListener("scroll", onDockScroll, { passive: true });
  window.addEventListener("resize", onDockScroll, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sampleDock);
  sampleDock();
})();

/* --- Sectors carousel: build pagination dots + keep them in sync -------------
   On phones .sectors is a horizontal scroll-snap track. Add a row of dots
   beneath it: tap a dot to jump to that card, and the active dot follows the
   card currently snapped into view. The dots are hidden by CSS above phone
   width, so building them everywhere is harmless. --------------------------- */
(function () {
  "use strict";
  var track = document.querySelector(".sectors");
  if (!track) return;
  var cards = [].slice.call(track.querySelectorAll(".sector"));
  if (cards.length < 2) return;

  var dots = document.createElement("div");
  dots.className = "sectors__dots";
  dots.setAttribute("role", "tablist");
  dots.setAttribute("aria-label", "Sector slides");

  var buttons = cards.map(function (card, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "sectors__dot";
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", function () {
      // inline:start aligns the card to the track's start; block:nearest keeps
      // the page from jumping vertically.
      card.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        inline: "start",
        block: "nearest"
      });
    });
    dots.appendChild(b);
    return b;
  });

  track.parentNode.insertBefore(dots, track.nextSibling);

  function setActive(i) {
    buttons.forEach(function (b, j) {
      var on = j === i;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  setActive(0);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          setActive(cards.indexOf(e.target));
        }
      });
    }, { root: track, threshold: [0.6] });
    cards.forEach(function (c) { io.observe(c); });
  }
})();

/* --- Smoothly animate the services <details> accordion via grid-template-rows.
   Robust: no pixel measurement, and a safety timeout so it can never lock up. -- */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".acc, .faq__item").forEach(function (acc) {
    var summary = acc.querySelector("summary");
    var body = acc.querySelector(".acc__body, .faq__a");
    if (!summary || !body) return;

    // Wrap the body in a padding-free clip whose height we animate.
    var clip = document.createElement("div");
    clip.className = "acc__clip";
    body.parentNode.insertBefore(clip, body);
    clip.appendChild(body);

    summary.addEventListener("click", function (e) {
      if (reduce) return;                       // native instant toggle
      e.preventDefault();
      if (acc.dataset.animating) return;
      acc.dataset.animating = "1";

      function onEnd(after) {
        var fired = false;
        function finish() {
          if (fired) return;
          fired = true;
          clip.removeEventListener("transitionend", te);
          clip.style.height = "";                 // back to auto (or removed by native close)
          delete acc.dataset.animating;
          if (after) after();
        }
        function te(ev) {
          if (ev.target === clip && ev.propertyName === "height") finish();
        }
        clip.addEventListener("transitionend", te);
        setTimeout(finish, 650);                  // safety net if transitionend never fires
      }

      if (acc.open) {
        clip.style.height = clip.scrollHeight + "px";
        void clip.offsetHeight;                   // force reflow
        clip.style.height = "0px";
        onEnd(function () { acc.open = false; });
      } else {
        acc.open = true;
        clip.style.height = "0px";
        void clip.offsetHeight;                   // force reflow
        clip.style.height = clip.scrollHeight + "px";
        onEnd(null);
      }
    });
  });
})();
