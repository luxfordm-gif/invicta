/* ==========================================================================
   coverage-band.js — the grayscale coverage map on /about/.

   Draws a Google basemap, desaturated through the Maps style array, and shades
   the counties we serve on top of it from /assets/coverage-counties.json.

   Three deliberate choices:

   1. The basemap is greyed by the STYLE ARRAY, not a CSS filter. A CSS filter
      on the container would desaturate the county polygons too, and the
      polygons are the entire point of the band.

   2. Nothing loads until the band is near the viewport. Maps JS is a heavy
      third-party payload, and this band sits at the very bottom of a long
      page; most of the request is wasted if it fires on page load. It also
      means no visitor is announced to Google unless they scroll that far.

   3. The map is inert. No gestures, no controls, no clickable POIs. It is a
      statement about coverage, not a tool. /contact/ has the map you can drive.

   With no API key the template never renders [data-coverage-map] at all — it
   drops in the keyless Google Maps embed instead, and this file no-ops.
   ========================================================================== */
(function () {
  "use strict";

  var el = document.querySelector("[data-coverage-map]");
  if (!el) return;

  var key = el.getAttribute("data-maps-key");
  var src = el.getAttribute("data-counties-src");
  if (!key || !src) return;

  var started = false;

  /* --- Basemap palette: grey everything, keep place names, drop the clutter --- */
  var GREYSCALE = [
    { elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f2f2f2" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#dedede" }] },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#d0d3d5" }] },
    { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] }
  ];

  /* --- Load the Maps script once, then hand back control --- */
  function loadMaps(done) {
    if (window.google && window.google.maps) { done(); return; }

    var cb = "__invictaCoverageMapReady";
    window[cb] = function () { try { done(); } finally { delete window[cb]; } };

    var s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js" +
            "?key=" + encodeURIComponent(key) +
            "&callback=" + cb +
            "&loading=async";
    s.async = true;
    s.onerror = function () { el.closest(".coverage-band").classList.add("is-mapless"); };
    document.head.appendChild(s);
  }

  function init() {
    var map = new google.maps.Map(el, {
      styles: GREYSCALE,
      backgroundColor: "#E6E7E7",
      disableDefaultUI: true,
      gestureHandling: "none",
      keyboardShortcuts: false,
      clickableIcons: false,
      isFractionalZoomEnabled: true,
      center: { lat: 51.2, lng: -0.25 },        // provisional; fitBounds takes over
      zoom: 8
    });

    map.data.setStyle({
      fillColor: "#0B1F3A",                     // --ground
      fillOpacity: 0.26,
      strokeColor: "#0B1F3A",
      strokeOpacity: 0.55,
      strokeWeight: 1.2,
      clickable: false
    });

    fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error("coverage counties " + r.status);
        return r.json();
      })
      .then(function (geo) {
        map.data.addGeoJson(geo);

        // Frame every shaded county, then keep it framed through resizes.
        var bounds = new google.maps.LatLngBounds();
        map.data.forEach(function (feature) {
          feature.getGeometry().forEachLatLng(function (ll) { bounds.extend(ll); });
        });
        if (bounds.isEmpty()) return;

        var fit = function () { map.fitBounds(bounds, 0); };
        fit();

        var t;
        window.addEventListener("resize", function () {
          clearTimeout(t);
          t = setTimeout(fit, 150);
        });
      })
      .catch(function () {
        // Basemap is up but the shading failed; a grey map with no highlight
        // says nothing, so fall back to the plain tinted band.
        el.closest(".coverage-band").classList.add("is-mapless");
      });
  }

  /* --- Hold off until the band is worth loading --- */
  function start() {
    if (started) return;
    started = true;
    loadMaps(init);
  }

  if (!("IntersectionObserver" in window)) { start(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { io.disconnect(); start(); }
    });
  }, { rootMargin: "300px 0px" });

  io.observe(el);
})();
