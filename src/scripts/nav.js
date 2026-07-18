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
    });

    // Mobile: tapping a has-menu parent toggles its submenu instead of navigating.
    [].forEach.call(links.querySelectorAll(".nav__item.has-menu > a"), function (parent) {
      parent.addEventListener("click", function (e) {
        if (!mq.matches) return;
        e.preventDefault();
        parent.parentNode.classList.toggle("is-expanded");
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
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
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
