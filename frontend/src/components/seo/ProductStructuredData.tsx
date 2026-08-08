interface ProductStructuredDataProps {
  product: {
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    brand: string;
    category: string;
    model_number?: string | null;
    gtin?: string | null;
    sku?: string | null;
    mpn?: string | null;
    images: {
      image_url: string;
      is_primary: boolean;
    }[];
    prices: {
      merchant: string;
      price: number;
      currency: string;
      availability?: string | null;
      item_condition?: string | null;
      price_valid_until?: string | null;
      product_url: string;
    }[];
  };
}

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(
    /</g,
    "\\u003c",
  );
}

export default function ProductStructuredData({
  product,
}: ProductStructuredDataProps) {
  const canonical =
    `https://atlasexa.com/products/${product.slug}`;

  const images = [
    ...new Set(
      [
        ...product.images.map(
          (image) => image.image_url,
        ),
        product.image_url,
      ].filter(
        (value): value is string =>
          Boolean(value),
      ),
    ),
  ];

  const validOffers = product.prices.filter(
    (offer) =>
      Number.isFinite(offer.price) &&
      offer.price >= 0 &&
      Boolean(offer.currency) &&
      Boolean(offer.product_url),
  );

  const currencies = [
    ...new Set(
      validOffers.map(
        (offer) => offer.currency,
      ),
    ),
  ];

  let offers:
    | Record<string, unknown>
    | undefined;

  if (
    validOffers.length === 1
  ) {
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
    const prices =
      validOffers.map(
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
          description:
            product.description,
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
        item: "https://atlasexa.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item:
          `https://atlasexa.com/products?category=${encodeURIComponent(
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              productJsonLd,
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              breadcrumbJsonLd,
            ),
        }}
      />
    </>
  );
}
