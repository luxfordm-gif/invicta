/* prefs.js — BUILD-TIME preview panel: collapse toggle + Desktop/Mobile viewport
   preview. Mobile renders the current page in a 390px iframe so its own mobile
   breakpoints apply. REMOVE before launch (with prefs.css + the .prefs markup). */
(function () {
  "use strict";

  // Inside the mobile-preview iframe: strip the panel so it doesn't recurse.
  if (window.top !== window.self) {
    var inner = document.querySelector("[data-prefs]");
    if (inner) inner.remove();
    return;
  }

  var panel = document.querySelector("[data-prefs]");
  if (!panel) return;

  // Gear collapses / expands the panel.
  var gear = panel.querySelector("[data-prefs-toggle]");
  if (gear) {
    gear.addEventListener("click", function () {
      panel.classList.toggle("is-collapsed");
    });
  }

  // Desktop / Mobile viewport preview.
  var backdrop = null, phone = null;

  function setView(v) {
    panel.querySelectorAll("[data-view]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-view") === v);
    });

    if (v === "mobile" && !phone) {
      backdrop = document.createElement("div");
      backdrop.className = "prefs-backdrop";
      backdrop.addEventListener("click", function () { setView("desktop"); });

      phone = document.createElement("div");
      phone.className = "prefs-mobile";
      var frame = document.createElement("iframe");
      frame.title = "Mobile preview";
      frame.src = location.pathname + location.search;
      phone.appendChild(frame);

      document.body.appendChild(backdrop);
      document.body.appendChild(phone);
    } else if (v === "desktop" && phone) {
      backdrop.remove();
      phone.remove();
      backdrop = phone = null;
    }
  }

  // Palette A/B: "deep" is the original navy, "bright" the lifted livery blue.
  // Stored so it holds across page changes and inside the mobile-preview iframe.
  function setPalette(p) {
    if (p === "deep") document.documentElement.dataset.palette = "deep";
    else delete document.documentElement.dataset.palette;
    try { localStorage.setItem("iwt-palette", p); } catch (e) {}
    panel.querySelectorAll("[data-palette]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-palette") === p);
    });
    if (phone) phone.querySelector("iframe").contentWindow.location.reload();
  }

  setPalette(document.documentElement.dataset.palette === "deep" ? "deep" : "bright");

  panel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) setView(b.getAttribute("data-view"));
    var p = e.target.closest("[data-palette]");
    if (p) setPalette(p.getAttribute("data-palette"));
  });
})();
