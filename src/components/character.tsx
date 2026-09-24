import { characterAsset, type CharacterType } from "@/data/types";
import { assetPath } from "@/lib/paths";
export function Character({ type, priority = false }: { type: CharacterType; priority?: boolean }) {
  const asset = characterAsset(type);
  return <img src={assetPath(asset.src)} alt={asset.alt} width={asset.width} height={asset.height} loading={priority ? "eager" : "lazy"} className="character" />;
}
