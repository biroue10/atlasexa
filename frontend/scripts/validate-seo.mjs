import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SITE_URL = "https://atlasexa.com";

function fail(message) {
  throw new Error(message);
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getTag(html, pattern) {
  const match = html.match(pattern);

  return decodeHtmlEntities(
    match?.[1]?.trim() ?? "",
  );
}

function extractJsonLd(html) {
  const matches = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    ),
  ];

  return matches.map((match, index) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      fail(
        `Invalid JSON-LD block #${index + 1}: ${error.message}`,
      );
    }
  });
}

async function walkProductPages() {
  const productsDir = path.join(
    DIST_DIR,
    "products",
  );

  const entries = await fs.readdir(
    productsDir,
    {
      withFileTypes: true,
    },
  );

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      file: path.join(
        productsDir,
        entry.name,
        "index.html",
      ),
    }));
}

async function loadSitemapUrls() {
  const sitemapPath = path.join(
    DIST_DIR,
    "sitemap.xml",
  );

  const xml = await fs.readFile(
    sitemapPath,
    "utf8",
  );

  return new Set(
    [
      ...xml.matchAll(
        /<loc>(.*?)<\/loc>/g,
      ),
    ].map((match) =>
      match[1].trim(),
    ),
  );
}

function validatePage({
  slug,
  html,
  sitemapUrls,
}) {
  const title = getTag(
    html,
    /<title>([\s\S]*?)<\/title>/i,
  );

  const description = getTag(
    html,
    /<meta\s+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );

  const canonical = getTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i,
  );

  const robots = getTag(
    html,
    /<meta\s+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );

  if (!title) {
    fail(`${slug}: missing title`);
  }

  if (title.length < 20) {
    fail(
      `${slug}: title too short (${title.length})`,
    );
  }

  if (title.length > 65) {
    fail(
      `${slug}: title too long (${title.length})`,
    );
  }

  if (!description) {
    fail(
      `${slug}: missing meta description`,
    );
  }

  if (description.length < 80) {
    fail(
      `${slug}: meta description too short (${description.length})`,
    );
  }

  if (description.length > 170) {
    fail(
      `${slug}: meta description too long (${description.length})`,
    );
  }

  if (!canonical) {
    fail(`${slug}: missing canonical`);
  }

  if (!canonical.startsWith("https://")) {
    fail(
      `${slug}: canonical must use HTTPS`,
    );
  }

  const expectedPrefix =
    `${SITE_URL}/products/`;

  if (
    !canonical.startsWith(
      expectedPrefix,
    )
  ) {
    fail(
      `${slug}: invalid canonical ${canonical}`,
    );
  }

  if (!robots) {
    fail(`${slug}: missing robots`);
  }

  const isNoIndex =
    robots
      .toLowerCase()
      .includes("noindex");

  if (
    isNoIndex &&
    sitemapUrls.has(canonical)
  ) {
    fail(
      `${slug}: noindex page appears in sitemap`,
    );
  }

  if (
    !isNoIndex &&
    !sitemapUrls.has(canonical)
  ) {
    fail(
      `${slug}: indexable page missing from sitemap`,
    );
  }

  const jsonLd = extractJsonLd(
    html,
  );

  if (jsonLd.length < 2) {
    fail(
      `${slug}: expected at least 2 JSON-LD blocks`,
    );
  }

  const product = jsonLd.find(
    (item) =>
      item?.["@type"] === "Product",
  );

  const breadcrumb = jsonLd.find(
    (item) =>
      item?.["@type"] ===
      "BreadcrumbList",
  );

  if (!product) {
    fail(
      `${slug}: missing Product JSON-LD`,
    );
  }

  if (!breadcrumb) {
    fail(
      `${slug}: missing BreadcrumbList JSON-LD`,
    );
  }

  if (!product.name) {
    fail(
      `${slug}: Product.name missing`,
    );
  }

  if (!product.url) {
    fail(
      `${slug}: Product.url missing`,
    );
  }

  if (
    product.url !== canonical
  ) {
    fail(
      `${slug}: Product.url does not match canonical`,
    );
  }

  if (
    !product.brand ||
    !product.brand.name
  ) {
    fail(
      `${slug}: Product.brand missing`,
    );
  }

  if (
    product.url &&
    !String(product.url).startsWith(
      "https://",
    )
  ) {
    fail(
      `${slug}: Product.url must use HTTPS`,
    );
  }

  if (
    product.offers?.url &&
    !String(
      product.offers.url,
    ).startsWith("https://")
  ) {
    fail(
      `${slug}: Offer URL must use HTTPS`,
    );
  }

  const identifiers = [
    product.gtin,
    product.sku,
    product.mpn,
  ].filter(Boolean);

  for (const identifier of identifiers) {
    if (
      typeof identifier !==
      "string"
    ) {
      fail(
        `${slug}: invalid product identifier`,
      );
    }
  }

  if (
    product.offers?.priceValidUntil
  ) {
    const date =
      product.offers.priceValidUntil;

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date,
      )
    ) {
      fail(
        `${slug}: invalid priceValidUntil`,
      );
    }
  }

  return {
    slug,
    titleLength: title.length,
    descriptionLength:
      description.length,
    noindex: isNoIndex,
  };
}

async function main() {
  const pages =
    await walkProductPages();

  if (!pages.length) {
    fail(
      "No prerendered product pages found.",
    );
  }

  const sitemapUrls =
    await loadSitemapUrls();

  const results = [];

  for (const page of pages) {
    const html =
      await fs.readFile(
        page.file,
        "utf8",
      );

    results.push(
      validatePage({
        slug: page.slug,
        html,
        sitemapUrls,
      }),
    );
  }

  console.log(
    `SEO validation passed for ${results.length} product pages.`,
  );

  const noindexCount =
    results.filter(
      (item) => item.noindex,
    ).length;

  console.log(
    `Indexable: ${results.length - noindexCount}`,
  );

  console.log(
    `Noindex: ${noindexCount}`,
  );
}

main().catch((error) => {
  console.error(
    `SEO validation failed: ${error.message}`,
  );
  process.exit(1);
});
