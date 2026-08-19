/* ==========================================================================
   Case studies, single source of truth.

   These feed one place: the case-study section on each service page, where one
   study fills the screen at a time and the arrows step to the next. There is
   no project page behind them, so each study is read here in full: `title`,
   `body` and `highlight` are what the reader gets.

   `services` is the split. Each study belongs to exactly ONE service so the
   studies are shared out across the four service pages rather than the same
   handful appearing everywhere. Three per service is the ceiling, counting the
   hand-written `caseStudy` in a page's front matter, which leads; the
   case-carousel template enforces it.

   Locations are deliberately AGNOSTIC: named clients are anonymised to
   initials (as the client supplied them) and locations are given at town or
   county level, never a precise address.

   No em dashes anywhere in the copy. `image` is the web asset once added (see
   /assets); null renders a tasteful "photo to follow" placeholder.

   `blurb` is the CARD copy: one short sentence, all a bento card shows before
   you hover it. `highlight` is the line that slides up under it. Keep both
   tight; the full write-up lives in `body` and is what the editorial carousel
   layout renders. `title` is held but not currently rendered anywhere: a
   per-study headline was tried and dropped, because stacked under the section's
   own header it pushed the picture and the copy below the fold.
   ========================================================================== */

module.exports = [
  {
    id: "lk-effingham",
    name: "LK, Effingham",
    title: "One house, three sources, <span class=\"em\">and everything else we found.</span>",
    location: "Effingham, Surrey",
    county: "Surrey",
    services: ["private-water-supplies"],
    flagship: true,
    blurb:
      "Two failed boreholes and a ground-source heat system that would not run.",
    body: [
      "A flagship project. A multi-million-pound house came to us with two failed boreholes and a ground-source heat system that would not work. We designed a water treatment system to look after borehole, rainwater and mains water together.",
      "While on site we were asked to design and install a chlorine-free pool system. Then we noticed the ground-source heat pump was not working, investigated it alongside a misbehaving solar system, installed an on-site generator, and identified exactly where things were going wrong so the owners could hold their contractors to account.",
      "The next task was to find water on site, which we did with our chalk-geology specialist, drilling and carefully developing a new borehole. We like to help where we can.",
    ],
    highlight: "One supply across borehole, rainwater and mains, plus a chlorine-free pool.",
    image: null,
    imageAlt: null,
  },
  {
    id: "u-farm-kent",
    name: "U Farm, Kent",
    title: "Water like carrot juice, <span class=\"em\">made clear.</span>",
    location: "Kent",
    county: "Kent",
    services: ["design-install"],
    blurb:
      "Water like carrot juice one day, coffee the next.",
    body: [
      "We picked this project up after the driller decided the water treatment was beyond them. The supply was heavily silted, with high iron and manganese, and quality swung wildly from a clay-rich aquifer, like carrot juice some days, coffee others.",
      "We designed and installed a full treatment system, including our own design-and-build ultrafiltration membrane unit, along with chlorination and a control panel. It now feeds the main house and several cottages.",
      "The ultrafiltration unit is genuinely impressive: it can be retrofitted to any borehole system and improves water clarity almost instantly.",
    ],
    highlight: "In-house ultrafiltration: clear water from a clay-rich, variable source.",
    image: null,
    imageAlt: null,
  },
  {
    id: "uppark-sussex",
    name: "Uppark, National Trust",
    title: "A National Trust restoration, <span class=\"em\">right down to the water.</span>",
    location: "South Harting, Sussex",
    county: "Sussex",
    services: ["water-hygiene"],
    blurb:
      "Treatment and chlorination for a house coming back into real use.",
    body: [
      "Uppark House underwent a major restoration, and Invicta was selected to design and install a bespoke water treatment system, including chlorination.",
      "As the project progressed, we retrofitted a programmable tank control system to meet the varying demands of the site, the kind of adaptation that only shows up once a building is back in real use.",
    ],
    highlight: "A bespoke system for a National Trust restoration.",
    image: null,
    imageAlt: null,
  },
  {
    id: "rf-estate-woking",
    name: "RF Estate, Woking",
    title: "An inherited system, <span class=\"em\">put right and passed.</span>",
    location: "Woking, Surrey",
    county: "Surrey",
    services: ["private-water-supplies"],
    blurb:
      "An inherited system that never quite worked.",
    body: [
      "Another inherited project, where the original company had installed a system that never quite worked well enough. We redesigned and refurbished where necessary to make it perform.",
      "The final water passed the local EHO tests with flying colours. The work led to a second project very close by, where we could install a properly designed system from the start, giving that owner the independence they wanted.",
    ],
    highlight: "Passed the local EHO tests with flying colours.",
    image: null,
    imageAlt: null,
  },
  {
    id: "b-farm-cotswolds",
    name: "B Farm, Cotswolds",
    title: "A silted spring and a saline borehole, <span class=\"em\">both made to behave.</span>",
    location: "Cotswolds",
    county: "Gloucestershire",
    services: ["design-install"],
    blurb:
      "A silted spring and a saline borehole that had defeated several firms.",
    body: [
      "The client had tried several water treatment companies to solve the borehole and spring problems on site. The spring had been damaged during site works and was producing a lot of silt; the borehole was saline.",
      "We reconfigured the existing system, adding a settling raw-water tank, better filtration, and redesigning the reverse osmosis to work on this fouling water. As with any revamp of old equipment there were teething problems, but as each arose, we solved it.",
    ],
    highlight: "A redesigned RO that copes with fouling, saline water.",
    image: null,
    imageAlt: null,
  },
  {
    id: "b-stud-berkshire",
    name: "B Stud, Berkshire",
    title: "Excellent water needs a light touch, <span class=\"em\">kept up for years.</span>",
    location: "Berkshire",
    county: "Berkshire",
    services: ["servicing"],
    blurb:
      "A chalk aquifer that produces excellent water and does not need fighting.",
    body: [
      "We installed a very simple treatment system here, because the chalk aquifer produces excellent water and does not need fighting.",
      "Over the years we have upgraded the pumps and kept the whole site going, including annual cleans and chlorinations, with UKAS-accredited sampling.",
    ],
    highlight: "Years of steady care: annual cleans, chlorination, UKAS sampling.",
    image: null,
    imageAlt: null,
  },
  {
    id: "roundhurst-haslemere",
    name: "Roundhurst House, Haslemere",
    title: "A private supply looked after <span class=\"em\">on the county border.</span>",
    location: "Haslemere",
    county: "Surrey / Sussex border",
    services: ["servicing"],
    blurb:
      "A private supply we look after on the Surrey and Sussex border.",
    body: [
      "A private supply on the Surrey–Sussex border that we look after near Haslemere.",
    ],
    highlight: null,
    image: null,
    imageAlt: null,
  },
];
