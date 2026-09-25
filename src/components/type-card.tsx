import Link from "next/link";
import { ViewTransition } from "react";
import { Character } from "./character";
import { elementColors, type CharacterType } from "@/data/types";
export function TypeCard({ type }: { type: CharacterType }) {
  const element = elementColors(type.stem);
  return <Link className="type-card" href={`/types/${type.slug}/`}>
    <ViewTransition name={`character-${type.slug}`}><div className="type-card-art" style={{ background: element.tint, "--el": element.color } as React.CSSProperties}><Character type={type} /></div></ViewTransition>
    <h3>{type.displayName}</h3>
    <p>{type.keywords.join("・")}</p>
  </Link>;
}
