const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const lightningcss = require("lightningcss");
const terser = require("terser");
const htmlmin = require("html-minifier-terser");

const OUTPUT_DIR = "_site";

/* Async so the image plugin, which is ESM-only, can be imported from this
   CommonJS config without needing a Node that supports require(esm). */
module.exports = async function (eleventyConfig) {
  const { eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  /* --- BUNDLES (14/10/26) ---------------------------------------------------
     The page used to load twelve stylesheets and ten scripts as separate
     files, every one of them shipped with its comments: 218 KB of CSS on the
     home page, of which the browser needed perhaps a third, and fourteen
     render-blocking requests before the first paint. Now base.njk asks for
     two stylesheets and one script:

       site-<hash>.css   the ten sheets every page loads, minified, one file
       page-<hash>.css   that page's extraStyles, if it has any
       site-<hash>.js    all ten scripts, minified, one deferred file

     The source files stay exactly as they are, comments and all, because the
     comments are the design record; only the build strips them. Each bundle
     is named by a hash of its minified bytes, so an unchanged bundle keeps
     its URL (and its year-long cache, see src/_headers) across deploys and a
     changed one cannot be served stale. Bundles are written straight into
     the output directory, memoised per build, and the memo is cleared on
     every build so `eleventy --serve` picks up edits. */
  const bundles = new Map();
  eleventyConfig.on("eleventy.before", () => bundles.clear());

  function writeBundle(kind, name, code) {
    const hash = crypto.createHash("sha1").update(code).digest("hex").slice(0, 8);
    const url = `/${kind}/${name}-${hash}.${kind === "styles" ? "css" : "js"}`;
    const file = path.join(OUTPUT_DIR, url);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, code);
    return url;
  }

  // {{ ["tokens", "base", "components/tooltip"] | cssBundle("site") }}
  eleventyConfig.addFilter("cssBundle", function (names, bundleName) {
    const key = "css:" + bundleName + ":" + names.join(",");
    if (bundles.has(key)) return bundles.get(key);
    const source = names.map((n) => fs.readFileSync(path.join("src/styles", n + ".css"), "utf8")).join("\n");
    const { code } = lightningcss.transform({
      filename: bundleName + ".css",
      code: Buffer.from(source),
      minify: true,
      errorRecovery: true,
    });
    const url = writeBundle("styles", bundleName, Buffer.from(code).toString("utf8"));
    bundles.set(key, url);
    return url;
  });

  // {{ ["nav", "carousel"] | jsBundle("site") }}. Every script is its own
  // IIFE, so concatenation needs no module wrapper.
  eleventyConfig.addAsyncFilter("jsBundle", async function (names, bundleName) {
    const key = "js:" + bundleName + ":" + names.join(",");
    if (bundles.has(key)) return bundles.get(key);
    const source = names.map((n) => fs.readFileSync(path.join("src/scripts", n + ".js"), "utf8")).join("\n;\n");
    const { code } = await terser.minify(source, { compress: true, mangle: true, format: { comments: false } });
    const url = writeBundle("scripts", bundleName, code);
    bundles.set(key, url);
    return url;
  });

  /* --- RESPONSIVE IMAGES ----------------------------------------------------
     Every <img> in the built HTML is rewritten with a srcset of WebP copies
     at these widths, generated from the 1536px source by sharp and written to
     /img/ under hashed names. Before this every photograph was served at
     1536px to every screen: 1.9 MB of pictures on the home page on a phone
     that could show about a third of it. The templates keep their plain
     <img src="/assets/..."> and the originals stay in /assets/ (the share
     image and favicon are read from there directly).

     `sizes`: an image that sets its own keeps it. Otherwise it gets the
     default below: `auto` lets Chromium size lazy-loaded images from their
     laid-out width exactly, and the list after it is the fallback for other
     browsers (and for eager images), which is roughly right for the cards,
     bands and strips on this site. SVG logos pass through untouched. */
  const IMAGE_WIDTHS = [400, 640, 960, 1280, 1536];
  /* The plugin reads a plain width="1536" attribute as "output this ONE
     width", which would defeat the whole point: every <img> in the templates
     carries width/height so the browser can reserve the box before CSS
     arrives. This pre-pass (priority 0 runs before the plugin's -1) hands
     every local photograph the full list through the plugin's own
     eleventy:widths attribute instead. Widths above the source are skipped,
     so the 960px gallery copies get three sizes, not five. */
  eleventyConfig.htmlTransformer.addPosthtmlPlugin("html", function () {
    return (tree) => {
      tree.match({ tag: "img" }, (node) => {
        const src = (node.attrs && node.attrs.src) || "";
        if (src.startsWith("/assets/logos/")) {
          // Client marks: SVGs, and WebPs already a few KB. Left untouched,
          // otherwise an SVG would come out as a 1536px raster of a 20px mark.
          node.attrs["eleventy:ignore"] = "";
        } else if (src.startsWith("/assets/") && !node.attrs["eleventy:widths"]) {
          node.attrs["eleventy:widths"] = IMAGE_WIDTHS.join(",");
        }
        return node;
      });
      return tree;
    };
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp"],
    widths: IMAGE_WIDTHS,
    urlPath: "/img/",
    outputDir: path.join(OUTPUT_DIR, "img"),
    svgShortCircuit: true,
    sharpWebpOptions: { quality: 80 },
    htmlOptions: {
      imgAttributes: {
        decoding: "async",
        sizes: "auto, (max-width: 899px) 100vw, 50vw",
      },
    },
  });

  /* --- HTML MINIFICATION ---------------------------------------------------
     Collapses runs of whitespace (keeping one space, so inline text never
     closes up) and drops the HTML comments. The Nunjucks comments that carry
     the design notes never reach the output anyway; this catches the few
     <!-- --> ones and the indentation. About 30% off every page. */
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return htmlmin.minify(content, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
    });
  });

  /* --- TOUCH ICON ----------------------------------------------------------
     iOS and Android home screens want a PNG; the favicon is an SVG. Rendered
     from it at build time rather than kept as a second source of the mark. */
  eleventyConfig.on("eleventy.after", async () => {
    const sharp = require("sharp");
    await sharp("src/assets/favicon.svg", { density: 384 })
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));

    /* Browsers and crawlers still ask for /favicon.ico whatever the <link>
       says, and Netlify logged those as 404s. A 32px PNG wrapped in a
       one-image ICO header, which every browser accepts. */
    const png = await sharp("src/assets/favicon.svg", { density: 384 }).resize(32, 32).png().toBuffer();
    const head = Buffer.alloc(22);
    head.writeUInt16LE(1, 2);            // type: icon
    head.writeUInt16LE(1, 4);            // one image
    head[6] = 32; head[7] = 32;          // width, height
    head.writeUInt16LE(1, 10);           // colour planes
    head.writeUInt16LE(32, 12);          // bits per pixel
    head.writeUInt32LE(png.length, 14);  // image size
    head.writeUInt32LE(22, 18);          // image offset
    fs.writeFileSync(path.join(OUTPUT_DIR, "favicon.ico"), Buffer.concat([head, png]));
  });

  /* The old `v` filter (a ?v=<hash> cache-bust on each stylesheet and
     script) is gone: the bundles above and the images in /img/ carry the
     hash in the filename itself, which is what lets src/_headers cache them
     for a year. */

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

  // Copy static assets straight through (paths become /assets, /fonts). The
  // stylesheets and scripts are NOT copied: they reach the output only as the
  // bundles above, so nothing unminified or unreferenced is deployed.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/fonts");
  // Netlify redirects and headers files, copied to the site root.
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: OUTPUT_DIR,
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
