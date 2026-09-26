import { CHARACTER_TYPES } from "@/data/types";

/** Official LINE friend-add URLs. Both are read at build time; with neither set, the LINE invitation is not shown. */

/** One URL for everyone (https://lin.ee/… or https://line.me/R/ti/p/@…). */
const COMMON_URL = process.env.NEXT_PUBLIC_LINE_URL || "";

/** Optional per-type URLs as JSON, e.g. {"grizzly":"https://…","rabbit":"https://…"}.
 * Tools such as Lステップ or エルメ issue one friend-add URL per source and tag the friend with it, so each type can get its own follow-up messages. */
const PER_TYPE_JSON = process.env.NEXT_PUBLIC_LINE_URLS || "";

/** Parses the per-type JSON. Throws on a bad value so a typo fails the build instead of silently sending everyone to the common URL. */
export function parseLineUrls(json: string, slugs: readonly string[]): Record<string, string> {
  if (!json.trim()) return {};
  let value: unknown;
  try { value = JSON.parse(json); } catch { throw new Error("NEXT_PUBLIC_LINE_URLS is not valid JSON."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("NEXT_PUBLIC_LINE_URLS must be a JSON object of type slug → URL.");
  for (const [slug, url] of Object.entries(value)) {
    if (!slugs.includes(slug)) throw new Error(`NEXT_PUBLIC_LINE_URLS: unknown type "${slug}". Use one of: ${slugs.join(", ")}.`);
    if (typeof url !== "string" || !url.startsWith("https://")) throw new Error(`NEXT_PUBLIC_LINE_URLS: the URL for "${slug}" must start with https://.`);
  }
  return value as Record<string, string>;
}

const PER_TYPE = parseLineUrls(PER_TYPE_JSON, CHARACTER_TYPES.map(type => type.slug));

/** The friend-add URL for a type: its own URL if configured, otherwise the common one ("" hides the invitation). */
export const lineUrlFor = (slug: string) => PER_TYPE[slug] || COMMON_URL;
