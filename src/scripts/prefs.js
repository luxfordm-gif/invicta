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

  // Home hero A/B: "light" is the cream field with the picture underneath,
  // "photo" the full-bleed photograph with the copy over it. Stored the same
  // way as the palette so it survives a page change and the mobile preview.
  function setHero(h) {
    if (h === "photo") document.documentElement.dataset.hero = "photo";
    else delete document.documentElement.dataset.hero;
    try { localStorage.setItem("iwt-hero", h); } catch (e) {}
    panel.querySelectorAll("[data-hero]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-hero") === h);
    });
    if (phone) phone.querySelector("iframe").contentWindow.location.reload();
  }

  setHero(document.documentElement.dataset.hero === "photo" ? "photo" : "light");

  // The row only means anything on the home page, which is the only page with
  // both heroes in it.
  var heroRow = panel.querySelector("[data-prefs-home]");
  if (heroRow && !document.querySelector(".light-hero")) heroRow.remove();

  panel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) setView(b.getAttribute("data-view"));
    var p = e.target.closest("[data-palette]");
    if (p) setPalette(p.getAttribute("data-palette"));
    var h = e.target.closest("[data-hero]");
    if (h) setHero(h.getAttribute("data-hero"));
  });
})();
