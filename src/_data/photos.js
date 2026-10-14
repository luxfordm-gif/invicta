/* ==========================================================================
   photos.js, every photograph on the site, by job.

   ALL OUR OWN. As of 12 October 2026 the stand-in photography (Wikimedia
   landscapes on the case studies, stock plant rooms and vans everywhere else)
   is gone. Every file in /assets is a photograph from an Invicta job, supplied
   by the client in dated job folders and graded in one batch so they sit
   together. The Drive source is "Invicta Water Treatment/_New image edits";
   each file here keeps the camera number from its original (IMG_4927 becomes
   b-estate-4927.webp), so any picture can be traced back to the folder it
   came from and swapped for a re-edit without touching a template.

   WHERE EACH ONE IS USED is not recorded here, deliberately: a template that
   wants a picture names the file directly, the way they always have, and this
   list is what the /gallery/ page renders. It is grouped by job because that
   is how the client supplied them, and because the gallery reads better as
   "this house, these rooms" than as a wall of plant.

   NAMES AND PLACES follow the case-study rule in caseStudies.js: clients are
   anonymised to the initials the client supplied, places are given at town or
   county level. The job folders are the client's own names and are used as
   they came. The one discrepancy is U Farm, filed by the client under West
   Sussex but written up in the case study (and the 2026 case-studies document)
   as Kent; the case-study copy is kept and the gallery follows it until the
   client says which is right.

   ALT TEXT describes what is in the frame. Where a job is a stand-in for a
   case study (the client's plan uses B Estate plant rooms for B Farm, and a
   Reeth lodge for B Stud) the alt still describes the actual picture, not the
   study it stands beside.

   `lead: true` picks the photograph that opens a job's run on the gallery page
   (the first wide card). One per job; absent, the first photograph leads.
   ========================================================================== */

module.exports = [
  {
    id: "lk-effingham",
    name: "LK, Effingham",
    place: "Surrey",
    note: "Borehole, rainwater and mains brought together on one flagship house, with a new borehole found and drilled on site.",
    photos: [
      { src: "/assets/lk-effingham-8595.webp", lead: true,
        alt: "A newly built stone house with a slate roof, an Invicta van on the drive and fresh groundworks with blue pipe coiled on the gravel." },
      { src: "/assets/lk-effingham-8608.webp",
        alt: "A plant room with a black Enduramaxx storage tank, a wall-mounted control panel, twin pumps and labelled pipework." },
    ],
  },
  {
    id: "uppark",
    name: "Uppark, National Trust",
    place: "South Harting, Sussex",
    note: "A bespoke treatment and chlorination system for a National Trust restoration.",
    photos: [
      { src: "/assets/uppark-0846.webp", lead: true,
        alt: "A large plant room with a cold water storage tank, booster pumps and insulated pipework running along the wall." },
      { src: "/assets/uppark-4882.webp",
        alt: "A control panel on a plywood wall beside framed commissioning notices, a water meter and a tank float." },
    ],
  },
  {
    id: "u-farm",
    name: "U Farm",
    place: "Kent",
    note: "Our own ultrafiltration unit, built for a clay-rich borehole whose water swung from carrot juice to coffee.",
    photos: [
      { src: "/assets/u-farm-4670.webp", lead: true,
        alt: "A plywood-lined plant room with an ultrafiltration unit, three blue pressure vessels and a chlorination controller." },
      { src: "/assets/u-farm-4095.webp",
        alt: "A hand holding up a sample bottle of brown, silted raw water against a bright sky." },
      { src: "/assets/u-farm-1307.webp",
        alt: "Seen through a timber doorway, a plant room with blue pressure vessels, a booster pump set and a step ladder." },
      { src: "/assets/u-farm-8952.webp",
        alt: "A formal garden with clipped hedges, a terrace and planters full of tulips in spring." },
    ],
  },
  {
    id: "rf-estate",
    name: "RF Estate, Woking",
    place: "Surrey",
    note: "An inherited system redesigned and refurbished until it passed the EHO tests with flying colours.",
    photos: [
      { src: "/assets/rf-estate-4334.webp", lead: true,
        alt: "A clean white plant room with a black storage tank, a wall-mounted filter and UV unit, and pipework run neatly along the wall." },
      { src: "/assets/rf-estate-4339.webp",
        alt: "A garage plant room with a water softener, three blue pressure vessels and a white vessel plumbed in a row." },
    ],
  },
  {
    id: "roundhurst",
    name: "Roundhurst House, Haslemere",
    place: "Surrey and Sussex border",
    note: "A private supply we look after on the county border.",
    photos: [
      { src: "/assets/roundhurst-4872.webp", lead: true,
        alt: "A plant room with two blue pressure vessels, red expansion vessels and insulated copper and steel pipework." },
    ],
  },
  {
    id: "b-estate",
    name: "B Estate",
    place: "Sussex",
    note: "A borehole drilled on the lawn, a new plant room and a control panel designed and built in-house.",
    photos: [
      { src: "/assets/b-estate-7931.webp", lead: true,
        alt: "A mini digger on the lawn of a timber-framed country house, with a borehole pump and hose laid out on the grass." },
      { src: "/assets/b-estate-4927.webp",
        alt: "A plant room with four blue pressure vessels in a row, a red expansion vessel and ducting overhead." },
      { src: "/assets/b-estate-4933.webp",
        alt: "A control panel with indicator lights and selector switches for the borehole, soft and potable tanks." },
      { src: "/assets/b-estate-2271.webp",
        alt: "A plant room with three blue pressure vessels, a black storage tank and a grey steel door." },
      { src: "/assets/b-estate-4916.webp",
        alt: "Two black settling tanks and a pump set in a plywood-lined plant room." },
      { src: "/assets/b-estate-0941.webp",
        alt: "A narrow plant room with two blue pressure vessels, a controller and pipework on plywood walls." },
      { src: "/assets/b-estate-0118.webp",
        alt: "A walled courtyard with the borehole chamber open and the rising main coiled out across the block paving." },
      { src: "/assets/b-estate-0796.webp",
        alt: "An old brick-domed water tank with a mossy cover, set in woodland under autumn leaves." },
      { src: "/assets/b-estate-0374.webp",
        alt: "A black storage tank in a timber-framed enclosure against a brick wall." },
      { src: "/assets/b-estate-0416.webp",
        alt: "A Tudor brick tower with a lawn and a timber outbuilding beside it." },
    ],
  },
  {
    id: "w-estate",
    name: "W Estate, Haslemere",
    place: "Surrey",
    note: "Winter callouts, a tank clean and a spring in a grotto.",
    photos: [
      { src: "/assets/w-estate-9952.webp", lead: true,
        alt: "An Invicta van on the gravel drive of a stone country house, with a view across the Weald behind." },
      { src: "/assets/w-estate-9241.webp",
        alt: "The side of an Invicta van on a hillside drive, with frost and snowdrops on the grass and hills beyond." },
      { src: "/assets/w-estate-9983.webp",
        alt: "A tiled water tank being refilled by hose after cleaning, with a submersible pump at the bottom." },
      { src: "/assets/w-estate-9990.webp",
        alt: "A stone grotto with a gilded statue over a spring-fed pond in the garden." },
    ],
  },
  {
    id: "l-mill",
    name: "L Mill, Brecon",
    place: "Powys",
    note: "A converted mill in the Brecon Beacons: a borehole kiosk in the field and a plant room inside.",
    photos: [
      { src: "/assets/l-mill-1879.webp", lead: true,
        alt: "A stone terrace in the evening, looking across fields to the hills, with the sun low behind the clouds." },
      { src: "/assets/l-mill-1885.webp",
        alt: "A green borehole kiosk in a field with its doors open, showing the pump controllers and valves inside." },
      { src: "/assets/l-mill-5576.webp",
        alt: "A plant room with a UV steriliser, cartridge filters, a blue pressure vessel and pipework on plywood walls." },
      { src: "/assets/l-mill-1848.webp",
        alt: "An Invicta van outside a stone barn conversion on a bright day." },
      { src: "/assets/l-mill-5260.webp",
        alt: "A stone house being renovated, with a van and skip on the drive and hills behind." },
    ],
  },
  {
    id: "reeth",
    name: "Reeth",
    place: "Surrey",
    note: "A lodge with a paddock, and a cellar plant room.",
    photos: [
      { src: "/assets/reeth-0517.webp", lead: true,
        alt: "An Invicta van parked on a lane beside a five-bar gate, with a house behind trees." },
      { src: "/assets/reeth-0524.webp",
        alt: "A timber garden pavilion across a lawn, with a terrace and mature trees." },
      { src: "/assets/reeth-0666.webp",
        alt: "A cellar plant room with a blue pressure vessel, a water softener and a UV unit." },
    ],
  },
  {
    id: "r-cottage",
    name: "R Cottage",
    place: "Sussex",
    note: "A new supply run across the lawn to a brick cottage.",
    photos: [
      { src: "/assets/r-cottage-2762.webp", lead: true,
        alt: "A brick and tile-hung cottage with an Invicta van on the gravel drive, under bare winter trees." },
      { src: "/assets/r-cottage-2765.webp",
        alt: "A cottage across its lawn with a blue water pipe laid out over the grass to the house." },
    ],
  },
  {
    id: "s-cottage",
    name: "S Cottage, New Forest",
    place: "Hampshire",
    note: "A private supply designed in from the start of a new build.",
    photos: [
      { src: "/assets/s-cottage-5641.webp", lead: true,
        alt: "A new-build house in timber and stone, with the ground around it freshly graded." },
    ],
  },
  {
    id: "s-farm",
    name: "S Farm",
    place: "Surrey",
    note: "A borehole head on the wall, kept running with a six-monthly descale.",
    photos: [
      { src: "/assets/s-farm-4835.webp", lead: true,
        alt: "A borehole headworks board on a garden wall: pump controller, filter housing, red expansion vessel and valves." },
    ],
  },
  {
    id: "t-elstead",
    name: "T, Elstead",
    place: "Surrey",
    note: "A parkland supply surveyed from the chamber up.",
    photos: [
      { src: "/assets/t-elstead-6784.webp", lead: true,
        alt: "Parkland with a mature oak, a greenhouse and a farmhouse beyond, and an open chamber in the foreground." },
    ],
  },
  {
    id: "b-aerospace",
    name: "B Aerospace",
    place: "Commercial site",
    note: "Process water for industry: our in-house reverse osmosis unit on a factory floor.",
    photos: [
      { src: "/assets/b-aerospace-6636.webp", lead: true,
        alt: "A compact reverse osmosis skid with a black vessel, blue filter housing and control box, on a factory floor beside blue machinery." },
      { src: "/assets/b-aerospace-5508.webp",
        alt: "An industrial plant floor with black tanks, a blue steel mezzanine and overhead pipework." },
      { src: "/assets/b-aerospace-5488.webp",
        alt: "A commercial plant room with two control panels on a white block wall and a pump on the floor." },
    ],
  },
  {
    id: "elsewhere",
    name: "Across the South East",
    place: null,
    note: "Estates, towers and drives from other jobs.",
    photos: [
      { src: "/assets/img-8014.webp", lead: true,
        alt: "An Invicta van on the lawn of a stone manor house, with drilling spoil and a borehole hose behind it." },
      { src: "/assets/img-9257.webp",
        alt: "A red brick water tower beside a barn with solar panels, with an Invicta van on the drive." },
      { src: "/assets/img-6720.webp",
        alt: "A brick water tower and gatehouse with an arch, seen across a lawn." },
      { src: "/assets/img-3912.webp",
        alt: "Pipework and hoses laid across a gravel drive, with an Invicta van and a car under the trees." },
      { src: "/assets/img-0427.webp",
        alt: "A stone terrace with covered garden furniture, looking out across the countryside." },
      { src: "/assets/img-0428.webp",
        alt: "A red brick country house with tall chimneys across a wide lawn." },
      { src: "/assets/img-5193.webp",
        alt: "A timber lodge with a verandah beside a post-and-rail paddock and a gravel drive." },
      { src: "/assets/img-1133.webp",
        alt: "A large grey-clad commercial building under construction, with pipework in the trench at its base." },
    ],
  },
];
