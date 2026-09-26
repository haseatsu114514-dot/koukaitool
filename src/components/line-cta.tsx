"use client";
import { useEffect, useRef } from "react";
import type { CharacterType } from "@/data/types";
import { lineUrlFor } from "@/lib/line";
import { track } from "@/lib/analytics";
import { Bx } from "./bx";

/** What the result shows here, and what the official LINE adds on the same topic. */
const TOPICS: [topic: string, here: string, line: string][] = [
  ["性格", "どんな人か", "自分でも気づいていない一面"],
  ["仕事", "向いている仕事", "力が出る働き方"],
  ["相性", "相性のいいタイプ", "相性そこそこ・天敵のタイプ"],
  ["アイテム", "あなたのアイテム", "アイテムの生かし方"],
  ["時期", "—", "気をつけたい時期"],
];

/** After a diagnosis only, below the chapters: the continuation of the result on the official LINE account.
 * Renders nothing until a LINE URL is configured. A plain text button in LINE green (no LINE logo, which has its own usage rules). */
export function LineCta({ type }: { type: CharacterType }) {
  const url = lineUrlFor(type.slug);
  const panel = useRef<HTMLElement>(null);
  // Count how many people actually reach the invitation, so the click rate can be read against it.
  useEffect(() => {
    const node = panel.current; if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { track({ name: "line_view", stella_type: type.slug }); observer.disconnect(); } }, { threshold: 0.5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [type.slug]);
  if (!url) return null;
  return <section ref={panel} id="line" className="line-panel" aria-labelledby="line-title">
    <p className="line-kicker">公式LINEの友だち限定</p>
    <h2 id="line-title" className="line-heading">結果の続きを、LINEで</h2>
    <table className="line-table">
      <thead><tr><th scope="col"><span className="visually-hidden">テーマ</span></th><th scope="col">この結果</th><th scope="col" className="line-more">LINEでさらに詳しく</th></tr></thead>
      <tbody>{TOPICS.map(([topic, here, line]) => <tr key={topic}><th scope="row">{topic}</th><td><Bx>{here}</Bx></td><td className="line-more"><Bx>{line}</Bx></td></tr>)}</tbody>
    </table>
    <a className="button line-button" href={url} target="_blank" rel="noopener noreferrer" onClick={() => track({ name: "line_click", stella_type: type.slug })}>LINEで続きを読む</a>
    <p className="micro">LINEで友だち追加すると読めます。入力した生年月日がLINEに送られることはありません。</p>
  </section>;
}
