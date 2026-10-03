import { CHARACTER_SIZES, characterAsset, characterSizedSrc, type CharacterType } from "@/data/types";
import { assetPath } from "@/lib/paths";

/** A character picture. Without `size` it is the full-resolution lossless image (the app's profile and share pictures).
 * With `size` (the width it is shown at, in CSS px) it picks the smallest of the small copies that stays sharp on the screen's
 * pixel density, so a row of 38px faces downloads a few kilobytes each instead of half a megabyte. */
export function Character({ type, priority = false, size }: { type: CharacterType; priority?: boolean; size?: number }) {
  const asset = characterAsset(type);
  const loading = priority ? "eager" : "lazy";
  if (size) return <img src={assetPath(characterSizedSrc(type, 256))} srcSet={CHARACTER_SIZES.map(width => `${assetPath(characterSizedSrc(type, width))} ${width}w`).join(", ")} sizes={`${size}px`} alt={asset.alt} width={size} height={size} loading={loading} decoding="async" fetchPriority={priority ? "high" : undefined} className="character" />;
  return <img src={assetPath(asset.displaySrc ?? asset.src)} alt={asset.alt} width={asset.width} height={asset.height} loading={loading} className="character" />;
}
