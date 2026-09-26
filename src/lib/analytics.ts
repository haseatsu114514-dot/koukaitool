/** Google Analytics 4 measurement ID (G-XXXXXXXXXX), read at build time. Empty means no analytics script and no events. */
const RAW_ID = process.env.NEXT_PUBLIC_GA_ID || "";
if (RAW_ID && !/^G-[A-Z0-9]+$/.test(RAW_ID)) throw new Error("NEXT_PUBLIC_GA_ID must look like G-XXXXXXXXXX.");
export const GA_ID = RAW_ID;

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

/** Funnel events. Parameters carry the type slug and where something was pressed, never the birth date or the item. */
export type FunnelEvent =
  | { name: "diagnosis_complete"; stella_type: string }
  | { name: "line_view"; stella_type: string }
  | { name: "line_click"; stella_type: string }
  | { name: "share"; method: "image" | "native" | "copy"; content_type: "result" | "type"; item_id: string };

export function track({ name, ...params }: FunnelEvent) {
  if (GA_ID && typeof window !== "undefined") window.gtag?.("event", name, params);
}
