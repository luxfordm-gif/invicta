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

  /* --- Tooltips, applied to the copy rather than written into it ------------
     Wraps the first occurrence of each glossary term (src/_data/glossary.js) in
     the `.term[data-tooltip]` span that tooltip.js binds to. Nothing is marked
     up by hand any more: a writer uses the word, the gloss follows.

     WHY A FILTER AND NOT A SHORTCODE. Most of this copy does not live in markup
     at all, it lives in front matter, the `why` cards and the FAQ answers on
     every service page. A shortcode cannot reach into a YAML string; a pass
     over the rendered HTML reaches all of it, and it keeps the copy readable
     for whoever edits it next.

     THE RULES IT ENFORCES, which are the ones the home page applied by hand:
       - once per page, on the FIRST occurrence, so a page is not stippled with
         dotted underlines
       - never inside a heading, a summary, a link, a button or a label: a
         tooltip on a thing you click fights the click
       - three per paragraph at most, for the same reason
       - nothing inside `data-no-gloss` (the client marquee: it scrolls, and a
         tooltip on a moving logo label is a tooltip you cannot catch)
       - never inside an existing [data-tooltip], and a term already glossed by
         hand on the page counts as spent
     Longest term first, so "UKAS-accredited" wins over the "UKAS" inside it. */
  const GLOSSARY = require("./src/_data/glossary.js");
  const GLOSS_ENTRIES = GLOSSARY
    .flatMap((g) => [g.term, ...(g.match || [])].map((m) => ({ m, term: g.term, def: g.def })))
    .sort((a, b) => b.m.length - a.m.length);
  // Word-ish boundaries: a term may start or end on a hyphen ("UKAS-accredited"),
  // so \b is wrong at those edges. Guard on "not a letter or digit" instead.
  const GLOSS_RE = new RegExp(
    "(?<![A-Za-z0-9])(" +
      GLOSS_ENTRIES.map((e) => e.m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
      ")(?![A-Za-z0-9])",
    "i"
  );
  const GLOSS_SKIP = /^(h[1-6]|a|button|label|summary|option|textarea|script|style|svg|title|nav|select)$/i;

  function escAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  eleventyConfig.addFilter("gloss", function (html) {
    if (!html) return html;
    const used = new Set();
    // A term already glossed by hand anywhere on the page is spent.
    for (const e of GLOSS_ENTRIES) {
      if (new RegExp("<span[^>]*data-tooltip[^>]*>[^<]*" + e.m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(html)) {
        used.add(e.term);
      }
    }

    const openTags = [];      // element stack, for the skip check
    let inGlossSpan = 0;      // depth inside an existing [data-tooltip]
    let noGloss = 0;          // depth inside a [data-no-gloss] subtree
    const noGlossAt = [];     // stack positions where those subtrees opened
    let perBlock = 0;         // terms glossed since the last block-level element
    let out = "";
    let i = 0;
    const src = String(html);

    while (i < src.length) {
      const lt = src.indexOf("<", i);
      if (lt === -1) { out += glossText(src.slice(i)); break; }
      out += glossText(src.slice(i, lt));

      const gt = src.indexOf(">", lt);
      if (gt === -1) { out += src.slice(lt); break; }
      const tag = src.slice(lt, gt + 1);
      out += tag;
      i = gt + 1;

      const m = /^<\s*(\/?)\s*([a-zA-Z0-9-]+)/.exec(tag);
      if (m) {
        const closing = m[1] === "/";
        const name = m[2].toLowerCase();
        const selfClosing = /\/\s*>$/.test(tag) || /^(br|img|input|hr|meta|link|source|path|circle|rect|use|area|col|embed|track|wbr)$/.test(name);
        if (closing) {
          const at = openTags.lastIndexOf(name);
          if (at !== -1) openTags.splice(at);
          if (name === "span" && inGlossSpan > 0) inGlossSpan--;
          while (noGlossAt.length && noGlossAt[noGlossAt.length - 1] >= openTags.length) {
            noGlossAt.pop();
            noGloss--;
          }
        } else if (!selfClosing) {
          if (/data-no-gloss/.test(tag)) { noGlossAt.push(openTags.length); noGloss++; }
          openTags.push(name);
          if (name === "span" && /data-tooltip=/.test(tag)) inGlossSpan++;
        }
        // A new block resets the two-per-paragraph budget.
        if (!closing && /^(p|li|dd|dt|section|div|article|aside|blockquote|figcaption|td)$/.test(name)) perBlock = 0;
      }
    }

    function glossText(text) {
      if (!text || inGlossSpan > 0 || noGloss > 0) return text;
      if (openTags.some((t) => GLOSS_SKIP.test(t))) return text;
      let res = "";
      let rest = text;
      for (;;) {
        if (perBlock >= 3) return res + rest;
        const hit = GLOSS_RE.exec(rest);
        if (!hit) return res + rest;
        const entry = GLOSS_ENTRIES.find((e) => e.m.toLowerCase() === hit[1].toLowerCase());
        if (!entry || used.has(entry.term)) {
          // Not glossable (already spent). Step past it and keep looking.
          res += rest.slice(0, hit.index + hit[1].length);
          rest = rest.slice(hit.index + hit[1].length);
          continue;
        }
        used.add(entry.term);
        perBlock++;
        res +=
          rest.slice(0, hit.index) +
          '<span class="term" data-tooltip="' + escAttr(entry.def) + '">' + hit[1] + "</span>";
        rest = rest.slice(hit.index + hit[1].length);
      }
    }

    return out;
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
