import Link from "next/link";
import { ViewTransition } from "react";
import { Character } from "./character";
import { CHARACTER_TYPES, elementStyle, type CharacterType } from "@/data/types";
import { Bx } from "./bx";
export function TypeCard({ type }: { type: CharacterType }) {
  return <Link className="type-card" href={`/types/${type.slug}/`}>
    <ViewTransition name={`character-${type.slug}`}><div className="type-card-art" style={elementStyle(type.stem)}><Character type={type} /><span className="type-card-no">No.{String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0")}</span></div></ViewTransition>
    <div className="type-card-body"><h3><Bx>{type.displayName}</Bx></h3>
    <p className="type-card-catch"><Bx>{type.shortCatch}</Bx></p>
    <ul className="card-tags">{type.keywords.slice(0, 2).map(word => <li key={word}>{word}</li>)}</ul></div>
  </Link>;
}
