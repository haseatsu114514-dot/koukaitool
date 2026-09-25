import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Character } from "./character";
import { elementColors, type CharacterType } from "@/data/types";
export function TypeCard({ type, index }: { type: CharacterType; index: number }) {
  const element = elementColors(type.stem);
  return <Link className="type-card" href={`/types/${type.slug}/`}>
    <div className="type-card-art" style={{ background: element.tint, "--el": element.color } as React.CSSProperties}><span className="file-number">FILE {String(index + 1).padStart(2, "0")}</span><span className="stem-tag"><i aria-hidden="true" />{type.motif}</span><Character type={type} /></div>
    <div className="type-card-caption"><h3>{type.displayName}</h3><ArrowUpRight size={18} aria-hidden="true" /></div>
    <p>{type.keywords.join(" / ")}</p>
  </Link>;
}
