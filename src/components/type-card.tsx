import Link from "next/link";
import { ViewTransition } from "react";
import { Character } from "./character";
import { elementStyle, type CharacterType } from "@/data/types";
import { Bx } from "./bx";
export function TypeCard({ type }: { type: CharacterType }) {
  return <Link className="type-card" href={`/types/${type.slug}/`}>
    <ViewTransition name={`character-${type.slug}`}><div className="type-card-art" style={elementStyle(type.stem)}><Character type={type} /></div></ViewTransition>
    <h3><Bx>{type.displayName}</Bx></h3>
    <p>{type.keywords.join("・")}</p>
  </Link>;
}
