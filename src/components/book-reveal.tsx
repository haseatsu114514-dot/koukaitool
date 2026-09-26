"use client";
import { useEffect, useRef, useState } from "react";
import { elementColors, type CharacterType } from "@/data/types";
import { GOD_COPY, type TenGod } from "@/lib/diagnosis/ten-gods";
import { ITEM_ICONS } from "./item-icon";
import { Character } from "./character";
import { LOGO_PATH } from "./logo";

/** Cover: a gold double rule with the brand mark and name. */
function CoverArt() {
  return <svg viewBox="0 0 200 260" className="book-cover-art" aria-hidden="true">
    <rect x="12" y="12" width="176" height="236" rx="6" fill="none" stroke="#e3b45a" strokeWidth="1.5" />
    <rect x="19" y="19" width="162" height="222" rx="4" fill="none" stroke="#e3b45a" strokeWidth=".6" opacity=".6" />
    <path transform="translate(65 76) scale(1.6) translate(-9 -16)" fill="#e3b45a" fillRule="evenodd" d={LOGO_PATH} />
    <text x="100" y="176" textAnchor="middle" fill="#e3b45a" fontSize="15" fontWeight="700" letterSpacing="2" fontFamily="var(--serif)">ステラファイル</text>
  </svg>;
}

export function BookReveal({ type, tenGod, onDone }: { type: CharacterType; tenGod: TenGod; onDone: () => void }) {
  const ItemIcon = ITEM_ICONS[tenGod];
  const [leaving, setLeaving] = useState(false);
  const element = elementColors(type.stem);
  const done = useRef(onDone); done.current = onDone;
  const timers = useRef<number[]>([]);
  useEffect(() => {
    timers.current.push(window.setTimeout(() => setLeaving(true), 3800), window.setTimeout(() => done.current(), 4300));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  function skip() { timers.current.forEach(clearTimeout); setLeaving(true); timers.current.push(window.setTimeout(() => done.current(), 400)); }
  return <div className={`book-reveal${leaving ? " is-leaving" : ""}`} onClick={skip} aria-hidden="true" style={{ "--el": element.color, "--tint": element.tint } as React.CSSProperties}>
    <div className="book-stage">
      <div className="book">
        <div className="book-inside"><span>あなたの<br />ファイル</span></div>
        <div className="book-page" style={{ "--p": 0 } as React.CSSProperties} />
        <div className="book-page" style={{ "--p": 1 } as React.CSSProperties} />
        <div className="book-page" style={{ "--p": 2 } as React.CSSProperties} />
        <div className="book-cover"><div className="book-cover-front"><CoverArt /></div><div className="book-cover-back" /></div>
      </div>
      <div className="reveal-card">
        <div className="reveal-card-art"><Character type={type} priority /></div>
        <span className="reveal-item"><ItemIcon size={22} strokeWidth={1.6} /></span>
        <p>あなたのステラタイプは</p>
        <strong>{type.displayName}</strong>
        <p className="reveal-item-label">アイテム：{GOD_COPY[tenGod].item}</p>
      </div>
    </div>
    <p className="reveal-skip">タップでスキップ</p>
  </div>;
}
