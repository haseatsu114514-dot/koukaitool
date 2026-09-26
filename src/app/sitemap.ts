import type { MetadataRoute } from "next";
import { CHARACTER_TYPES } from "@/data/types";
import { siteUrl } from "@/lib/paths";

export const dynamic = "force-static";

/** Public pages for search engines. The result page is personal and stays out (it is also noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).href;
  return [
    { url: url("./"), priority: 1 },
    { url: url("types/"), priority: 0.8 },
    ...CHARACTER_TYPES.map(type => ({ url: url(`types/${type.slug}/`), priority: 0.7 })),
    { url: url("privacy/"), priority: 0.2 },
  ];
}
