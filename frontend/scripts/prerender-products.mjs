import fs from "node:fs/promises";
import path from "node:path";

const API_URL =
  process.env.VITE_API_URL ??
  "https://api.atlasexa.com";

const SITE_URL = "https://atlasexa.com";
const DIST_DIR = path.resolve("dist");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function upsertTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(
    "</head>",
    `  ${replacement}\n</head>`,
  );
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

function buildSeoHtml(template, product) {
  const title =
    product.seo_title?.trim() ||
    `${product.name} Review, Specs & Best Price | Atlasexa`;

  const description =
    product.meta_description?.trim() ||
    product.description?.slice(0, 160) ||
    `Compare ${product.name} specifications, Atlasexa score and current offers.`;

  const canonical =
    product.canonical_url?.trim() ||
    `${SITE_URL}/products/${product.slug}`;

  const ogTitle =
    product.og_title?.trim() ||
    title;

  const ogDescription =
    product.og_description?.trim() ||
    description;

  const primaryImage =
    product.images?.find(
      (image) => image.is_primary,
    )?.image_url ||
    product.image_url ||
    "";

  const robots = product.is_indexable
    ? "index,follow"
    : "noindex,nofollow";

  let html = template;

  html = upsertTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  );

  html = upsertTag(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(description)}">`,
  );

  html = upsertTag(
    html,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${robots}">`,
  );

  html = upsertTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
  );

  html = upsertTag(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}">`,
  );

  html = upsertTag(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}">`,
  );

  html = upsertTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
  );

  html = upsertTag(
    html,
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="product">`,
  );

  if (primaryImage) {
    html = upsertTag(
      html,
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${escapeHtml(primaryImage)}">`,
    );
  }

  return html;
}

async function main() {
  const templatePath = path.join(
    DIST_DIR,
    "index.html",
  );

  const template = await fs.readFile(
    templatePath,
    "utf8",
  );

  const products = await getAllProducts();

  let generated = 0;

  for (const item of products) {
    const product = await getProduct(
      item.slug,
    );

    if (product.is_indexable === false) {
      console.log(
        `Prerendering noindex product: ${product.slug}`,
      );
    }

    const html = buildSeoHtml(
      template,
      product,
    );

    const directory = path.join(
      DIST_DIR,
      "products",
      product.slug,
    );

    await fs.mkdir(directory, {
      recursive: true,
    });

    await fs.writeFile(
      path.join(directory, "index.html"),
      html,
      "utf8",
    );

    generated += 1;
  }

  console.log(
    `Generated ${generated} product SEO pages.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
