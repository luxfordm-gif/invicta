/* enquiry.js — slide-out enquiry drawer. Opens from any "Send Enquiry" /
   "Arrange a site visit" trigger (a[href="/enquiry/"] or [data-enquiry-open]). */
(function () {
  "use strict";

  var root = document.documentElement;
  var drawer = document.querySelector("[data-enquiry]");
  if (!drawer) return;

  var panel = drawer.querySelector(".enquiry__panel");
  var lastFocused = null;
  var scrollLockY = 0;

  // Scroll-lock: pin the body with a negative-top offset. This keeps the page
  // EXACTLY where it was (no jump, no scroll reset), the fixed drawer still covers
  // the viewport (verified), and the sticky header is hidden — so nothing can be
  // seen shifting. Scroll is restored instantly on close.
  function lockScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = -scrollLockY + "px";
    root.classList.add("enquiry-open");
  }
  function unlockScroll() {
    root.classList.remove("enquiry-open");
    document.body.style.top = "";
    window.scrollTo({ top: scrollLockY, left: 0, behavior: "instant" });
  }

  function open(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    drawer.hidden = false;
    lockScroll();
    var sc = panel.querySelector(".enquiry__scroll");   // always open anchored to the top
    if (sc) sc.scrollTop = 0;
    // next frame so the transform transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { drawer.classList.add("is-open"); });
    });
    var first = panel.querySelector(".enquiry__close");
    if (first) first.focus({ preventScroll: true });
    document.addEventListener("keydown", onKey);
  }

  function close() {
    drawer.classList.remove("is-open");
    unlockScroll();
    document.removeEventListener("keydown", onKey);
    var done = function () {
      drawer.hidden = true;
      panel.removeEventListener("transitionend", done);
    };
    panel.addEventListener("transitionend", done);
    // fallback if transitionend doesn't fire
    setTimeout(function () { if (!drawer.classList.contains("is-open")) drawer.hidden = true; }, 700);
    if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  // Triggers
  [].forEach.call(document.querySelectorAll('a[href="/enquiry/"], [data-enquiry-open]'), function (el) {
    el.addEventListener("click", open);
  });

  // Close controls (backdrop + × button)
  [].forEach.call(drawer.querySelectorAll("[data-enquiry-close]"), function (el) {
    el.addEventListener("click", close);
  });

  // Tabs: swap views
  var tabs = drawer.querySelectorAll("[data-enquiry-tab]");
  var views = drawer.querySelectorAll("[data-enquiry-view]");
  [].forEach.call(tabs, function (tab) {
    tab.addEventListener("click", function () {
      var name = tab.getAttribute("data-enquiry-tab");
      [].forEach.call(tabs, function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      [].forEach.call(views, function (v) {
        v.hidden = v.getAttribute("data-enquiry-view") !== name;
      });
      var sc = drawer.querySelector(".enquiry__scroll");
      if (sc) sc.scrollTop = 0;
    });
  });

  // Submit — no backend yet, so show a confirmation state.
  var form = drawer.querySelector(".enquiry__form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var consent = form.querySelector('[name="consent"]');
      if (consent && !consent.checked) { consent.focus(); return; }
      var name = (form.querySelector('[name="name"]') || {}).value || "there";
      var wrap = document.createElement("div");
      wrap.className = "enquiry__success";
      wrap.innerHTML =
        "<h3>Thank you, " + name.split(" ")[0].replace(/[<>&]/g, "") + ".</h3>" +
        "<p>Your enquiry is on its way. We'll be in touch personally, usually within a working day.</p>";
      form.replaceWith(wrap);
    });
  }
})();
