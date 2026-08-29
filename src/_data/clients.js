/* Client logos for the trust band.

   Real artwork, re-sourced from each company's own website rather than a logo
   aggregator. Five arrived as true vectors; Chelsea and the Hospice publish
   only raster, so those are PNGs taken at the largest size their own sites
   serve. DIS and IAC are the two thin ones (132px and 177px wide), and they
   are the reason the band is monochrome: greyed and set small they hold up
   next to the vectors, in full colour at size they would not.

   `scale` is optical, not mechanical. A logo wall that sets every mark to the
   same height is wrong, because a square crest at a wordmark's height reads as
   half the size: the wordmark spreads its weight over four times the width.
   So `scale` multiplies the base height, and the squarer the mark the more it
   gets. Chelsea's crest at 1.45 and South East Water's long wordmark at 1.0
   end up looking like siblings, which is the whole job.

   `w`/`h` are the intrinsic dimensions, present so the row reserves its space
   before the images land rather than jumping when they do. For the SVGs they
   are the viewBox.

   Alpha, the tenth mark on the old site, is deliberately absent: that was
   Alpha LSG, the Gatwick airline caterer, which is dnata catering now. The
   mark is retired and no artwork survives beyond a 120x90 JPEG.
*/

module.exports = [
  // Ordered so the square marks never sit next to each other, otherwise the
  // row develops a lump. Shape alternates: square, long, mid, long, square...
  { name: "Chelsea FC",           file: "chelsea-fc.png",           w: 180,  h: 180, scale: 1.45 },
  { name: "South East Water",     file: "south-east-water.svg",     w: 522,  h: 116, scale: 1.0  },
  { name: "Cowdray Estate",       file: "cowdray-estate.svg",       w: 240,  h: 87,  scale: 1.0  },
  { name: "GSK",                  file: "gsk.svg",                  w: 106,  h: 33,  scale: 0.95 },
  { name: "Hospice in the Weald", file: "hospice-in-the-weald.png", w: 180,  h: 159, scale: 1.35 },
  { name: "Amgen",                file: "amgen.svg",                w: 1782, h: 454, scale: 1.0  },
  { name: "IAC Services",         file: "iac-services.png",         w: 177,  h: 123, scale: 1.2  },
  { name: "Carel",                file: "carel.svg",                w: 350,  h: 175, scale: 1.05 },
  { name: "DIS Group",            file: "dis-group.png",            w: 132,  h: 60,  scale: 1.0  },
];
