export const SITE_URL = "https://ai.cloudnature.jp";

export const PRODUCT_NAME = "ミツモリAI";

export const SITE_NAME = `CloudNature ${PRODUCT_NAME}`;

export const OG_IMAGE = {
  url: "/images/og-img.jpg",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  postalCode: "951-8068",
  addressLocality: "新潟市中央区",
  streetAddress: "上大川前通七番町1230番地7 ストークビル鏡橋 7F",
  addressRegion: "新潟県",
  addressCountry: "JP",
} as const;
