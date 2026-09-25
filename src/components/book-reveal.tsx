"use client";
import { useEffect, useRef, useState } from "react";
import { elementColors, type CharacterType } from "@/data/types";
import { GOD_COPY, type TenGod } from "@/lib/diagnosis/ten-gods";
import { ITEM_ICONS } from "./item-icon";
import { Character } from "./character";

const SPARKS = Array.from({ length: 14 }, (_, i) => ({ angle: (360 / 14) * i + (i % 3) * 9, distance: 140 + (i % 4) * 45, delay: (i % 5) * 60 }));

function CoverArt() {
  return <svg viewBox="0 0 200 260" className="book-cover-art" aria-hidden="true">
    <rect x="10" y="10" width="180" height="240" rx="6" fill="none" stroke="#e3b45a" strokeWidth="1.5" />
    <rect x="18" y="18" width="164" height="224" rx="4" fill="none" stroke="#e3b45a" strokeWidth=".6" opacity=".6" />
    <circle cx="100" cy="112" r="46" fill="none" stroke="#e3b45a" strokeWidth=".8" strokeDasharray="2 5" />
    <path d="M118 84a34 34 0 1 0 0 56a28 28 0 1 1 0-56Z" fill="#e8bd62" />
    <path d="M100 40l3 12 12 3-12 3-3 12-3-12-12-3 12-3Z" fill="#f3d08a" />
    <path d="M100 172l2 8 8 2-8 2-2 8-2-8-8-2 8-2Z" fill="#f3d08a" />
    <path d="M44 112a6 6 0 1 0 0 8a5 5 0 1 1 0-8ZM156 108a6 6 0 1 1 0 8a5 5 0 1 0 0-8Z" fill="#e3b45a" />
    <path d="M24 24l14 0-14 14ZM176 24l-14 0 14 14ZM24 236l14 0-14-14ZM176 236l-14 0 14-14Z" fill="#e3b45a" />
  </svg>;
}

export function BookReveal({ type, tenGod, onDone }: { type: CharacterType; tenGod: TenGod; onDone: () => void }) {
  const ItemIcon = ITEM_ICONS[tenGod];
  const [leaving, setLeaving] = useState(false);
  const element = elementColors(type.stem);
  const done = useRef(onDone); done.current = onDone;
  const timers = useRef<number[]>([]);
  useEffect(() => {
    timers.current.push(window.setTimeout(() => setLeaving(true), 4300), window.setTimeout(() => done.current(), 4900));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  function skip() { timers.current.forEach(clearTimeout); setLeaving(true); timers.current.push(window.setTimeout(() => done.current(), 400)); }
  return <div className={`book-reveal${leaving ? " is-leaving" : ""}`} onClick={skip} aria-hidden="true" style={{ "--el": element.color, "--tint": element.tint } as React.CSSProperties}>
    <div className="book-stage">
      <div className="book-glow" />
      <div className="book">
        <div className="book-inside"><span>あなたの<br />ファイル</span></div>
        <div className="book-page" style={{ "--p": 0 } as React.CSSProperties} />
        <div className="book-page" style={{ "--p": 1 } as React.CSSProperties} />
        <div className="book-page" style={{ "--p": 2 } as React.CSSProperties} />
        <div className="book-cover"><div className="book-cover-front"><CoverArt /></div><div className="book-cover-back" /></div>
      </div>
      <div className="book-burst" />
      {SPARKS.map((spark, i) => <i key={i} className="book-spark" style={{ "--a": `${spark.angle}deg`, "--d": `${spark.distance}px`, "--delay": `${spark.delay}ms` } as React.CSSProperties} />)}
      <div className="reveal-card">
        <div className="reveal-card-art"><Character type={type} priority /></div>
        <span className="reveal-item"><ItemIcon size={22} strokeWidth={1.6} /></span>
        <p>あなたのタイプは</p>
        <strong>{type.displayName}</strong>
        <p className="reveal-item-label">アイテム：{GOD_COPY[tenGod].item}</p>
      </div>
    </div>
    <p className="reveal-skip">タップでスキップ</p>
  </div>;
}
