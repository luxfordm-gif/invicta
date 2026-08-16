/* ==========================================================================
   Case studies — single source of truth.

   Feeds three places:
     1. /case-studies/            (the full index page)
     2. service pages             (a carousel of the studies tagged to each)
     3. the coverage map          (each study's map.x / map.y places a glow)

   Locations are deliberately AGNOSTIC. Named clients are anonymised to
   initials (as the client supplied them) and map coordinates are approximate,
   town/county-level only — never a precise address. `map.x` / `map.y` are
   percentages (0–100) across the coverage-map canvas, west→east / north→south,
   laid out to mirror the real relative geography of the South East.

   `image` is the web asset once added (see /assets); null renders a tasteful
   "photo to follow" placeholder. `services` tags map to service page slugs so
   each service can pull the studies relevant to it.
   ========================================================================== */

module.exports = [
  {
    id: "lk-effingham",
    name: "LK, Effingham",
    location: "Effingham, Surrey",
    county: "Surrey",
    map: { x: 52, y: 40 },
    services: ["private-water-supplies", "design-install"],
    flagship: true,
    blurb:
      "A multi-million-pound house with two failed boreholes and a ground-source heat system that would not run. We designed a supply around borehole, rainwater and mains — then kept solving what we found.",
    body: [
      "A flagship project. A multi-million-pound house came to us with two failed boreholes and a ground-source heat system that would not work. We designed a water treatment system to look after borehole, rainwater and mains water together.",
      "While on site we were asked to design and install a chlorine-free pool system. Then we noticed the ground-source heat pump was not working, investigated it alongside a misbehaving solar system, installed an on-site generator, and identified exactly where things were going wrong so the owners could hold their contractors to account.",
      "The next task was to find water on site, which we did with our chalk-geology specialist, drilling and carefully developing a new borehole. We like to help where we can.",
    ],
    highlight: "One supply across borehole, rainwater and mains — plus a chlorine-free pool.",
    image: null,
    imageAlt: null,
  },
  {
    id: "u-farm-kent",
    name: "U Farm, Kent",
    location: "Kent",
    county: "Kent",
    map: { x: 82, y: 46 },
    services: ["private-water-supplies", "design-install", "water-hygiene"],
    blurb:
      "Water like carrot juice one day, coffee the next. We designed and built an ultrafiltration membrane system, with chlorination and control, feeding the main house and several cottages.",
    body: [
      "We picked this project up after the driller decided the water treatment was beyond them. The supply was heavily silted, with high iron and manganese, and quality swung wildly from a clay-rich aquifer — like carrot juice some days, coffee others.",
      "We designed and installed a full treatment system, including our own design-and-build ultrafiltration membrane unit, along with chlorination and a control panel. It now feeds the main house and several cottages.",
      "The ultrafiltration unit is genuinely impressive: it can be retrofitted to any borehole system and improves water clarity almost instantly.",
    ],
    highlight: "In-house ultrafiltration — clear water from a clay-rich, variable source.",
    image: null,
    imageAlt: null,
  },
  {
    id: "uppark-sussex",
    name: "Uppark, National Trust",
    location: "South Harting, Sussex",
    county: "Sussex",
    map: { x: 34, y: 66 },
    services: ["design-install", "water-hygiene", "servicing", "private-water-supplies"],
    blurb:
      "For the National Trust's restored Uppark House, a bespoke treatment and chlorination system — then a programmable tank control retrofitted to meet the site's varying demand.",
    body: [
      "Uppark House underwent a major restoration, and Invicta was selected to design and install a bespoke water treatment system, including chlorination.",
      "As the project progressed, we retrofitted a programmable tank control system to meet the varying demands of the site — the kind of adaptation that only shows up once a building is back in real use.",
    ],
    highlight: "A bespoke system for a National Trust restoration.",
    image: null,
    imageAlt: null,
  },
  {
    id: "rf-estate-woking",
    name: "RF Estate, Woking",
    location: "Woking, Surrey",
    county: "Surrey",
    map: { x: 46, y: 38, anchor: "end", dy: -6 },
    services: ["design-install", "servicing", "private-water-supplies"],
    blurb:
      "An inherited system that never quite worked. We redesigned and refurbished it until the final water passed the local EHO tests with flying colours — which led to a second, properly designed supply nearby.",
    body: [
      "Another inherited project, where the original company had installed a system that never quite worked well enough. We redesigned and refurbished where necessary to make it perform.",
      "The final water passed the local EHO tests with flying colours. The work led to a second project very close by, where we could install a properly designed system from the start — giving that owner the independence they wanted.",
    ],
    highlight: "Passed the local EHO tests with flying colours.",
    image: null,
    imageAlt: null,
  },
  {
    id: "b-farm-cotswolds",
    name: "B Farm, Cotswolds",
    location: "Cotswolds",
    county: "Gloucestershire",
    map: { x: 12, y: 16 },
    services: ["design-install", "private-water-supplies"],
    blurb:
      "A damaged spring running with silt and a saline borehole had defeated several firms. We reconfigured the system — settling tank, better filtration, a redesigned RO — to work on genuinely fouling water.",
    body: [
      "The client had tried several water treatment companies to solve the borehole and spring problems on site. The spring had been damaged during site works and was producing a lot of silt; the borehole was saline.",
      "We reconfigured the existing system — adding a settling raw-water tank, better filtration, and redesigning the reverse osmosis to work on this fouling water. As with any revamp of old equipment there were teething problems, but as each arose, we solved it.",
    ],
    highlight: "A redesigned RO that copes with fouling, saline water.",
    image: null,
    imageAlt: null,
  },
  {
    id: "b-stud-berkshire",
    name: "B Stud, Berkshire",
    location: "Berkshire",
    county: "Berkshire",
    map: { x: 33, y: 30 },
    services: ["servicing", "water-hygiene", "private-water-supplies"],
    blurb:
      "A chalk aquifer that produces great water needs only a simple system — and steady care. Over the years we've upgraded the pumps and kept the whole site running, with annual cleans, chlorinations and UKAS sampling.",
    body: [
      "We installed a very simple treatment system here, because the chalk aquifer produces excellent water and does not need fighting.",
      "Over the years we have upgraded the pumps and kept the whole site going — including annual cleans and chlorinations, with UKAS-accredited sampling.",
    ],
    highlight: "Years of steady care: annual cleans, chlorination, UKAS sampling.",
    image: null,
    imageAlt: null,
  },
  {
    id: "roundhurst-haslemere",
    name: "Roundhurst House, Haslemere",
    location: "Haslemere",
    county: "Surrey / Sussex border",
    map: { x: 42, y: 55 },
    services: ["servicing", "private-water-supplies"],
    blurb:
      "A private supply looked after on the Surrey–Sussex border, near Haslemere.",
    body: [
      "A private supply on the Surrey–Sussex border that we look after near Haslemere.",
    ],
    highlight: null,
    image: null,
    imageAlt: null,
  },
];
