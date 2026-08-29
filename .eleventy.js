const fs = require("fs");
const crypto = require("crypto");

module.exports = function (eleventyConfig) {
  /* Cache-bust local CSS and JS by content.
     Without this, a browser that has already seen /scripts/prefs.js keeps
     serving its copy: neither the dev server nor Netlify sends a revalidation
     header these files would fail, so an edit ships and the page quietly runs
     the old one. That is not a theoretical problem — it cost a round of "the
     change isn't working" on a panel whose script had in fact changed.

     The hash is of the file's own bytes, so the URL only moves when the file
     does: unchanged assets stay cached across deploys, changed ones cannot be.
     Read fresh on every call rather than memoised, so `eleventy --serve` picks
     up an edit without a restart. The files are a few KB each. */
  eleventyConfig.addFilter("v", function (assetPath) {
    try {
      const bytes = fs.readFileSync("src" + assetPath);
      const hash = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 8);
      return assetPath + "?v=" + hash;
    } catch (e) {
      // A missing file is a broken link with or without a hash; let the 404 show.
      return assetPath;
    }
  });

  // Copy static assets straight through (paths become /styles, /scripts, /assets).
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/assets");
  // Netlify redirects file, copied to the site root.
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
