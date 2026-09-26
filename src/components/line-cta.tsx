"use client";
import { useEffect, useRef } from "react";
import type { CharacterType } from "@/data/types";
import { lineUrlFor } from "@/lib/line";
import { track } from "@/lib/analytics";
import { Bx } from "./bx";

/** After a diagnosis only, below the explanation: invites the visitor to the official LINE account for more detail.
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
  return <section ref={panel} className="line-panel" aria-labelledby="line-title">
    <h2 id="line-title" className="line-heading">もっと詳しく知りたい方へ</h2>
    <p className="line-text"><Bx>ステラファイル公式LINEを友だち追加すると、あなたのタイプについて、さらに詳しい内容を受け取れます。</Bx></p>
    <a className="button line-button" href={url} target="_blank" rel="noopener noreferrer" onClick={() => track({ name: "line_click", stella_type: type.slug })}>LINEで友だち追加</a>
    <p className="micro">LINEが開きます。入力した生年月日がLINEに送られることはありません。</p>
  </section>;
}
