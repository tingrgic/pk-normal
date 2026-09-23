import { readFileSync, writeFileSync } from "node:fs";
const origin = process.env.SITE_URL;
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== "https:") throw Error("SITE_URL must use HTTPS");
  url.search = "";
  url.hash = "";
  const base = url.href.replace(/\/?$/, "/");
  const html = readFileSync("dist/index.html", "utf8");
  writeFileSync(
    "dist/index.html",
    html.replace(
      "</head>",
      '<link rel="canonical" href="' +
        base +
        '"/><meta property="og:url" content="' +
        base +
        '"/></head>',
    ),
  );
  writeFileSync(
    "dist/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' +
      base +
      "</loc></url></urlset>",
  );
  writeFileSync(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\nSitemap: " + base + "sitemap.xml\n",
  );
}
