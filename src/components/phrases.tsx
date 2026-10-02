import { Fragment } from "react";

const BREAK_AFTER = "、。！？", CLOSING = "」』）";

/** Splits short display text after Japanese punctuation and at "｜" hints written into the copy (the hint itself is not shown).
 * A closing bracket stays with the punctuation before it, so a line never starts with 」. */
export function phraseSegments(text: string): string[] {
  const out = [""];
  for (const ch of text) {
    if (ch === "｜") { out.push(""); continue; }
    if (CLOSING.includes(ch) && out.at(-1) === "" && out.length > 1) { out[out.length - 2] += ch; continue; }
    out[out.length - 1] += ch;
    if (BREAK_AFTER.includes(ch)) out.push("");
  }
  return out.filter(Boolean);
}

/** Short display text (headings, catches, labels, short list items) that wraps only between segments, never inside one unless a line cannot hold it.
 * Used on the love page instead of BudouX, whose guesses split words such as うまく｜いく or 見た｜目. */
export function Phrases({ children }: { children: string }) {
  return <span className="bx">{phraseSegments(children).map((part, i) => <Fragment key={i}>{i > 0 && <wbr />}{part}</Fragment>)}</span>;
}
