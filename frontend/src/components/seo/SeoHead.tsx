import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  image?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  indexable?: boolean;
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  const selector = `meta[${attribute}="${key}"]`;

  let meta =
    document.head.querySelector<HTMLMetaElement>(
      selector,
    );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export default function SeoHead({
  title,
  description,
  canonical,
  image,
  ogTitle,
  ogDescription,
  indexable = true,
}: SeoHeadProps) {
  useEffect(() => {
    document.title = title;

    upsertMeta(
      "name",
      "description",
      description,
    );

    upsertMeta(
      "name",
      "robots",
      indexable
        ? "index,follow"
        : "noindex,nofollow",
    );

    upsertMeta(
      "property",
      "og:title",
      ogTitle || title,
    );

    upsertMeta(
      "property",
      "og:description",
      ogDescription || description,
    );

    upsertMeta(
      "property",
      "og:type",
      "product",
    );

    upsertMeta(
      "property",
      "og:url",
      canonical,
    );

    if (image) {
      upsertMeta(
        "property",
        "og:image",
        image,
      );
    }

    let canonicalLink =
      document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );

    if (!canonicalLink) {
      canonicalLink =
        document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonical;
  }, [
    canonical,
    description,
    image,
    indexable,
    ogDescription,
    ogTitle,
    title,
  ]);

  return null;
}
