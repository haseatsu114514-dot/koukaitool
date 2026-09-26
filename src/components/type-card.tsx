import Link from "next/link";
import { ViewTransition } from "react";
import { Character } from "./character";
import { CHARACTER_TYPES, elementStyle, groupName, type CharacterType } from "@/data/types";
import { Bx } from "./bx";

/** One type as a list row: art on the left, number, group, name, then either the catch and keywords or one あるある line (home page). */
export function TypeCard({ type, aruaru }: { type: CharacterType; aruaru?: string }) {
  const number = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0");
  return <Link className="type-card" href={`/types/${type.slug}/`} style={elementStyle(type.stem)}>
    <ViewTransition name={`character-${type.slug}`}><div className="type-card-art"><Character type={type} /></div></ViewTransition>
    <div className="type-card-body">
      <p className="type-card-meta"><b>No.{number}</b><span className="element-chip"><span className="element-orb" aria-hidden="true" />{groupName(type.stem)}</span></p>
      <h3><Bx>{type.displayName}</Bx></h3>
      {aruaru ? <p className="type-card-aruaru"><span className="aruaru-label">あるある</span><Bx>{aruaru}</Bx></p> : <>
        <p className="type-card-catch"><Bx>{type.shortCatch}</Bx></p>
        <ul className="card-tags">{type.keywords.map(word => <li key={word}>{word}</li>)}</ul>
      </>}
    </div>
  </Link>;
}
