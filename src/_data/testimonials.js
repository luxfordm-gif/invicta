/* ==========================================================================
   Client reviews, shown on the home page.

   *** THESE ARE WRITTEN SAMPLES, NOT REAL CLIENTS. ***

   The array was empty on purpose until now, because these are meant to be real
   people saying real things about real work. It is filled with sample copy so
   the section can be judged with words in it rather than with four grey
   placeholder blocks, and every card renders a visible "Sample copy" chip
   while `placeholder: true` is set on it. That chip is the safety catch: it
   makes it impossible to ship invented praise as genuine by forgetting about
   this file.

   TO REPLACE, per review: swap `quote`, `name` and `role` for the real ones
   and DELETE the `placeholder: true` line. The chip disappears with it. Any
   review still carrying the flag is still made up.

   Keep real clients anonymised the same way the case studies are: initials, or
   a property type and county, unless the client has agreed to be named. Three
   or four reads best; the grid takes any number. No em dashes.
   ========================================================================== */

module.exports = [
  {
    placeholder: true,
    quote:
      "They surveyed the borehole before quoting a single piece of equipment, which no one else had offered to do. The system they designed has run without a fault since, and the water is better than anything we had on mains.",
    name: "Sample copy",
    role: "Private estate, Surrey",
  },
  {
    placeholder: true,
    quote:
      "We took on a house with a supply nobody understood and paperwork that did not add up. Invicta worked out what was there, kept what was sound, and put the rest right. They explained every decision in plain terms.",
    name: "Sample copy",
    role: "Country house, West Sussex",
  },
  {
    placeholder: true,
    quote:
      "The pump failed on a Sunday in February. We called the number we were given and spoke to the engineer who installed the system, not a call centre. He was on site that afternoon.",
    name: "Sample copy",
    role: "Farm and holiday lets, Kent",
  },
  {
    placeholder: true,
    quote:
      "The plant room is set out so cleanly that our own maintenance team can find everything. Ten years on it is still serviced by the same people who built it, and it still looks like the day it went in.",
    name: "Sample copy",
    role: "Institution, Hampshire",
  },
];
