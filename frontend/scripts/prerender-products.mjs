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

function safeJsonLd(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c");
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

function buildStructuredData(product, canonical) {
  const images = [
    ...new Set(
      [
        ...(product.images ?? []).map(
          (image) => image.image_url,
        ),
        product.image_url,
      ].filter(Boolean),
    ),
  ];

  const validOffers = (product.prices ?? []).filter(
    (offer) =>
      Number.isFinite(offer.price) &&
      offer.price >= 0 &&
      offer.currency &&
      offer.product_url,
  );

  const currencies = [
    ...new Set(
      validOffers.map(
        (offer) => offer.currency,
      ),
    ),
  ];

  let offers;

  if (validOffers.length === 1) {
    const offer = validOffers[0];

    offers = {
      "@type": "Offer",
      url: offer.product_url,
      price: offer.price,
      priceCurrency: offer.currency,
      ...(offer.availability
        ? {
            availability:
              offer.availability,
          }
        : {}),
      ...(offer.item_condition
        ? {
            itemCondition:
              offer.item_condition,
          }
        : {}),
      ...(offer.price_valid_until
        ? {
            priceValidUntil:
              offer.price_valid_until,
          }
        : {}),
    };
  } else if (
    validOffers.length > 1 &&
    currencies.length === 1
  ) {
    const prices = validOffers.map(
      (offer) => offer.price,
    );

    offers = {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: validOffers.length,
      priceCurrency: currencies[0],
    };
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: canonical,
    ...(product.description
      ? {
          description: product.description,
        }
      : {}),
    ...(images.length
      ? {
          image: images,
        }
      : {}),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    ...(product.model_number
      ? {
          model: product.model_number,
        }
      : {}),
    ...(product.gtin
      ? {
          gtin: product.gtin,
        }
      : {}),
    ...(product.sku
      ? {
          sku: product.sku,
        }
      : {}),
    ...(product.mpn
      ? {
          mpn: product.mpn,
        }
      : {}),
    ...(offers
      ? {
          offers,
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item:
          `${SITE_URL}/products?category=${encodeURIComponent(
            product.category,
          )}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: canonical,
      },
    ],
  };

  return {
    productJsonLd,
    breadcrumbJsonLd,
  };
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

  const {
    productJsonLd,
    breadcrumbJsonLd,
  } = buildStructuredData(
    product,
    canonical,
  );

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

  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${safeJsonLd(productJsonLd)}</script>
  <script type="application/ld+json">${safeJsonLd(breadcrumbJsonLd)}</script>
</head>`,
  );

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
    `Generated ${generated} product SEO pages with structured data.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
