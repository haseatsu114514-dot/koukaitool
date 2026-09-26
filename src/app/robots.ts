import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/paths";

export const dynamic = "force-static";

/** Crawlers only read robots.txt at a domain root, so this takes effect once the site has its own domain. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("sitemap.xml", siteUrl).href };
}
