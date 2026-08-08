import fs from "node:fs/promises";
import path from "node:path";

const API_URL =
  process.env.VITE_API_URL ??
  "https://api.atlasexa.com";

const SITE_URL = "https://atlasexa.com";
const DIST_DIR = path.resolve("dist");

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function getAllProducts() {
  const products = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${API_URL}/api/products?page=${page}&page_size=50&sort_by=name`,
    );

    if (!response.ok) {
      throw new Error(
        `Unable to load product catalog: ${response.status}`,
      );
    }

    const data = await response.json();

    products.push(...data.items);

    if (
      products.length >= data.total ||
      data.items.length === 0
    ) {
      break;
    }

    page += 1;
  }

  return products;
}

async function getProduct(slug) {
  const response = await fetch(
    `${API_URL}/api/products/${slug}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load ${slug}: ${response.status}`,
    );
  }

  return response.json();
}

async function main() {
  const catalog = await getAllProducts();

  const urls = [
    {
      loc: `${SITE_URL}/`,
    },
    {
      loc: `${SITE_URL}/products`,
    },
  ];

  for (const item of catalog) {
    const product = await getProduct(item.slug);

    if (product.is_indexable === false) {
      console.log(
        `Skipping noindex product: ${product.slug}`,
      );
      continue;
    }

    urls.push({
      loc:
        product.canonical_url?.trim() ||
        `${SITE_URL}/products/${product.slug}`,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  await fs.writeFile(
    path.join(DIST_DIR, "sitemap.xml"),
    xml,
    "utf8",
  );

  console.log(
    `Generated sitemap with ${urls.length} URLs.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
