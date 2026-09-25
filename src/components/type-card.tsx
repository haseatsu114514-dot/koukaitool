import Link from "next/link";
import { ViewTransition } from "react";
import { Character } from "./character";
import { CHARACTER_TYPES, elementStyle, type CharacterType } from "@/data/types";
import { Bx } from "./bx";
export function TypeCard({ type }: { type: CharacterType }) {
  return <Link className="type-card" href={`/types/${type.slug}/`}>
    <ViewTransition name={`character-${type.slug}`}><div className="type-card-art" style={elementStyle(type.stem)}><Character type={type} /></div></ViewTransition>
    <p className="type-card-no">No.{String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0")}</p><h3><Bx>{type.displayName}</Bx></h3>
    <p>{type.keywords.join("・")}</p>
  </Link>;
}
