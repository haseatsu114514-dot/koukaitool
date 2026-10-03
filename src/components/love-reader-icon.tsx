import { LOVE_READER } from "@/data/love-copy";
import { assetPath } from "@/lib/paths";

/** ホシヨミ's icon (a night-blue book with a gold moon), round. Decorative: the name is always written next to it. */
export function ReaderIcon({ size, priority = false }: { size: number; priority?: boolean }) {
  return <img src={assetPath(LOVE_READER.icon)} alt="" width={size} height={size} loading={priority ? "eager" : "lazy"} decoding="async" className="lv-reader-icon" />;
}
