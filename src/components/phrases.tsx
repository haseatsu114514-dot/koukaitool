import { Fragment } from "react";
import { Parser, jaModel } from "@/lib/budoux-ja";

const parser = new Parser(jaModel);
const OPEN = "「『（", CLOSE: Record<string, string> = { "「": "」", "『": "』", "（": "）" };
/** A line never starts with these, so a break is never placed right before them. */
const NO_LINE_START = "、。！？」』）・ー～";
/** Words BudouX splits in this page's copy (うまく｜いく, 見た｜目, 後回しにしが｜ち …): a break never falls inside them.
 * When a heading or a line of text breaks inside a word, add the word here (tests/love.test.ts checks the list against the copy). */
export const KEEP_WHOLE = ["見た目", "しっかり者", "うまくい", "盛り上が", "特別扱い", "高嶺の花", "近寄りがた", "がち", "ゆるめ", "笑顔", "思い立", "占い館", "読み解", "なぜか", "当てはま", "からこそ", "頼りがい", "ひと言", "占い師"];
/** Quotes up to this length (「恋の正解」, 「占いの帝王」) stay on one line. */
const SHORT_QUOTE = 10;
/** Short phrases are joined to a neighbour (恋の傾向, 相手の特徴, くれる相手。, 深い関係に) only while the two together are no longer than this. */
const NO_PAIR = 10;

/** Where a line may break in a run of Japanese text: between natural phrases (BudouX), always after 、。！？, and at a "｜" written into
 * the copy (the mark itself is not shown). Never inside the words above or a short quote, never before closing punctuation, a
 * one-character piece (や, も …) stays with the phrase before it, and a short 〜の phrase stays with what it describes. */
export function phraseSegments(text: string, by: "phrase" | "hint" = "phrase"): string[] {
  const out: string[] = [];
  for (const part of text.split("｜")) {
    if (!part) continue;
    const cuts = new Set<number>();
    let at = 0;
    if (by === "phrase") for (const phrase of parser.parse(part)) cuts.add(at += phrase.length);
    for (let i = 0; i < part.length; i++) if ("、。！？".includes(part[i])) cuts.add(i + 1);
    const keepWhole = (from: number, to: number) => { for (const cut of cuts) if (cut > from && cut < to) cuts.delete(cut); };
    for (const word of KEEP_WHOLE) for (let i = part.indexOf(word); i >= 0; i = part.indexOf(word, i + 1)) keepWhole(i, i + word.length);
    for (let i = 0; i < part.length; i++) {
      if (!OPEN.includes(part[i])) continue;
      const end = part.indexOf(CLOSE[part[i]], i + 1);
      if (end > i && end - i - 1 <= SHORT_QUOTE) keepWhole(i, end + 1);
    }
    for (const cut of cuts) if (cut <= 0 || cut >= part.length || NO_LINE_START.includes(part[cut]) || OPEN.includes(part[cut - 1])) cuts.delete(cut);
    const pieces: string[] = [];
    let from = 0;
    for (const cut of [...[...cuts].sort((a, b) => a - b), part.length]) { pieces.push(part.slice(from, cut)); from = cut; }
    for (let i = pieces.length - 1; i > 0; i--) if ([...pieces[i]].length === 1 || [...pieces[i - 1]].length === 1) { pieces[i - 1] += pieces[i]; pieces.splice(i, 1); }
    // A short ending (相手。) stays with the phrase before it; a short 〜の phrase or a two-character one (深い, 少し) with the phrase after it.
    for (let i = pieces.length - 1; i > 0; i--) if ([...pieces[i]].length <= 3 && /[、。！？]$/.test(pieces[i]) && [...pieces[i - 1] + pieces[i]].length <= NO_PAIR) { pieces[i - 1] += pieces[i]; pieces.splice(i, 1); }
    for (let i = 0; i < pieces.length - 1; i++) {
      const short = pieces[i].endsWith("の") || ([...pieces[i]].length === 2 && !/[、。！？]$/.test(pieces[i]));
      if (short && [...pieces[i] + pieces[i + 1]].length <= NO_PAIR) { pieces[i] += pieces[i + 1]; pieces.splice(i + 1, 1); i--; }
    }
    out.push(...pieces);
  }
  return out;
}

/** Japanese text on the love page: each phrase is its own inline block, so lines break only between phrases (never inside a word, and
 * never after a closing bracket on its own). With text-wrap: balance (headings, short items) the lines come out even; with
 * text-wrap: pretty (running text) the last line is never left with a word or two.
 * by="hint" breaks only after 、。！？ and at ｜, for a short note whose lines should follow its meaning ("合わない恋を" stays whole). */
export function Phrases({ children, by = "phrase" }: { children: string; by?: "phrase" | "hint" }) {
  return <span className="bx">{phraseSegments(children, by).map((part, i) => <Fragment key={i}>{i > 0 && <wbr />}<span className="phrase">{part}</span></Fragment>)}</span>;
}
