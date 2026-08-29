/* ==========================================================================
   glossary.js — the plain-English gloss behind every tooltip on the site.

   ONE DEFINITION PER TERM, IN ONE PLACE. The tooltips started as hand-written
   `data-tooltip` attributes on the home page, which was fine for six of them
   and would not have survived four service pages: "UKAS-accredited" alone
   appears on three of them, and three hand-typed definitions of it drift.

   HOW A TERM GETS GLOSSED. Nothing is marked up in the copy. The `gloss` filter
   in .eleventy.js runs over the rendered body of every page and wraps the FIRST
   occurrence of each term below, so a writer adds the word and the tooltip
   follows. See that filter for the rules it applies (never in a heading, never
   inside a link, two per paragraph, once per page).

   WRITING A DEFINITION
     - one or two sentences, for a client, not a colleague
     - say what it IS first, then why it matters to them
     - never define a term of art with another term of art
     - commas, not em dashes (house style)

   `match` is an optional list of extra spellings that mean the same thing. The
   longest match anywhere in the list wins, so "UKAS-accredited" is glossed as
   the phrase rather than leaving a bare "UKAS" wrapped inside it.
   ========================================================================== */

module.exports = [
  {
    term: "Legionella",
    def: "A bacterium that causes Legionnaires' disease. Water systems above 20°C and below 45°C are at risk without proper control.",
  },
  {
    term: "UKAS-accredited",
    match: ["UKAS accredited", "UKAS"],
    def: "Testing conducted through a lab accredited by the UK Accreditation Service, the national accreditation body.",
  },
  {
    term: "ACOP L8",
    match: ["ACoP L8", "L8"],
    def: "The Health and Safety Executive's Approved Code of Practice for controlling Legionella in water systems. It sets out what the person responsible for a building has to do, and inspectors judge against it.",
  },
  {
    term: "CHAS",
    def: "Contractors Health and Safety Assessment Scheme, a common contractor pre-qualification standard.",
  },
  {
    term: "DWI",
    def: "Drinking Water Inspectorate, the regulator for public and private drinking water supplies in England and Wales.",
  },
  {
    term: "HSE",
    def: "Health and Safety Executive, the UK regulator for workplace health and safety.",
  },
  {
    term: "Section 80 notice",
    def: "Enforcement notice served by a local authority when a private water supply fails wholesomeness standards.",
  },
  {
    term: "abstraction",
    def: "Taking water from your own borehole, well, spring or watercourse. Above 20 cubic metres a day it needs a licence from the Environment Agency.",
  },
  {
    term: "UV sterilisation",
    match: ["UV steriliser", "UV sterilization"],
    def: "Passing water under ultraviolet light to kill bacteria and viruses, without adding anything to it.",
  },
  {
    term: "iron and manganese reduction",
    def: "Filtering out two metals that occur naturally in ground water. Left in, they stain baths and laundry, taint the taste, and build up inside pipework.",
  },
  {
    term: "pH correction",
    def: "Adjusting how acidic the water is. Naturally acidic ground water eats copper pipework and fittings from the inside.",
  },
  {
    term: "chlorination",
    match: ["chlorinated", "chlorinate"],
    def: "Dosing a system with chlorine to kill what is living in it, then flushing it through. Used to disinfect a supply before it goes into service, and to clear one that has failed a test.",
  },
  {
    term: "wholesomeness",
    match: ["wholesome"],
    def: "The legal standard drinking water has to meet in England and Wales, covering bacteria, chemistry and what it looks and tastes like.",
  },
  {
    term: "commissioning",
    match: ["commissioned"],
    def: "The last stage of an install: the system is tested against what it was designed to do, set to its running values, and handed over with the paperwork that proves it.",
  },
];
