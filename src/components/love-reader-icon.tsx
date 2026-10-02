import { LOVE_READER } from "@/data/love-copy";
import { assetPath } from "@/lib/paths";

/** ホシヨミ's icon (a night-blue book with a gold moon), round. Decorative: the name is always written next to it. */
export function ReaderIcon({ size }: { size: number }) {
  return <img src={assetPath(LOVE_READER.icon)} alt="" width={size} height={size} loading="lazy" decoding="async" className="lv-reader-icon" />;
}
