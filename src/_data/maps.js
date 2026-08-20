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

   With no key set the band falls back to the keyless Google Maps embed that
   /contact/ uses: a real, greyed basemap of the South East behind the heading,
   but with none of the counties shaded. The build never fails for want of a
   key; the key only buys the county shading.
   ========================================================================== */

module.exports = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY || "",

  // Where the shaded counties come from, and what we claim to cover.
  // Boundaries: ONS Local Authority Districts (Dec 2013), Open Government
  // Licence v3, dissolved up to ceremonial counties and simplified.
  counties: ["Surrey", "Sussex", "Kent", "Hampshire", "Berkshire", "Greater London"],
};
