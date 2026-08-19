/* ==========================================================================
   Google Maps configuration.

   The coverage band on /about/ draws a grayscale Google basemap with the
   counties we serve shaded on top. That needs a Maps JavaScript API key.

   The key is supplied by the GOOGLE_MAPS_API_KEY environment variable (set it
   in Netlify under Site settings > Environment variables, and in a local .env
   or shell export for `npm run dev`).

   A Maps JS key is PUBLIC by design: it ships in the page and is visible to
   anyone. That is expected, and it is why the key must be locked down in the
   Google Cloud console with an HTTP-referrer restriction to our own domains,
   and limited to the Maps JavaScript API only.

   With no key set, coverage-band.js leaves the band in its fallback state: the
   heading still renders over a plain tinted ground, and no request is made to
   Google. The build never fails for want of a key.
   ========================================================================== */

module.exports = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY || "",

  // Where the shaded counties come from, and what we claim to cover.
  // Boundaries: ONS Local Authority Districts (Dec 2013), Open Government
  // Licence v3, dissolved up to ceremonial counties and simplified.
  counties: ["Surrey", "Sussex", "Kent", "Hampshire", "Berkshire", "Greater London"],
};
