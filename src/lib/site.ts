import type { Metadata } from "next";
export const SITE_NAME = "ステラファイル";
export const SITE_TAGLINE = "生年月日でわかる10のステラタイプ診断";
/** Page metadata with matching Open Graph / X cards. Child openGraph objects replace the parent's, so every page sets its own image. */
export function pageMetadata({ title, description, path, image = "/og/default.jpg" }: { title?: string; description: string; path: string; image?: string }): Metadata {
  const ogTitle = title ? `${title}｜${SITE_NAME}` : `${SITE_NAME}｜${SITE_TAGLINE}`;
  const images = [{ url: image, width: 1200, height: 630, alt: ogTitle }];
  return {
    ...(title ? { title } : {}), description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "ja_JP", url: path, title: ogTitle, description, images },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map(i => i.url) },
  };
}
