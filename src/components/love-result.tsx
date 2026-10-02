"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Heart, Lock, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { elementStyle, typeByStem, type CharacterType } from "@/data/types";
import { LOVE_COMPAT, LOVE_COPY, LOVE_GIFTS, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS } from "@/data/love-copy";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { stellaCompatibility } from "@/lib/diagnosis/compatibility";
import { GOD_COPY } from "@/lib/diagnosis/ten-gods";
import { loveLineUrlFor } from "@/lib/line";
import { track } from "@/lib/analytics";
import { Bx } from "./bx";
import { Character } from "./character";
import { ITEM_ICONS } from "./item-icon";

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return <section className="lv-r-sec" aria-labelledby={id}>
    <h2 id={id} className="lv-r-title"><Bx>{title}</Bx></h2>
    {lead && <p className="lv-r-lead"><Bx>{lead}</Bx></p>}
    {children}
  </section>;
}

function Partners({ stems }: { stems: CharacterType["stem"][] }) {
  return <ul className="lv-compat-types">{stems.map(stem => { const partner = typeByStem(stem); return <li key={stem}><span className="lv-mini-art" style={elementStyle(stem)}><Character type={partner} /></span><Bx>{partner.displayName}</Bx></li>; })}</ul>;
}

/** The love result: キャラ (the type), her tendencies in love, charm, win/lose patterns, アイテム (the item, read as a gift for love), one hint, compatibility, then the official LINE.
 * A bar with the LINE button follows the reader once the type card scrolls away, and steps aside while the full invitation is on screen. */
export function LoveResult({ result, onRetry }: { result: DiagnosisResult; onRetry: () => void }) {
  const type = typeByStem(result.pillar.stem), love = LOVE_COPY[type.slug];
  const gift = LOVE_GIFTS[result.tenGod], GiftIcon = ITEM_ICONS[result.tenGod];
  const groups = stellaCompatibility(type.stem), url = loveLineUrlFor(type.slug);
  const card = useRef<HTMLDivElement>(null), panel = useRef<HTMLElement>(null);
  const [cardGone, setCardGone] = useState(false), [panelIn, setPanelIn] = useState(false);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (card.current) { const o = new IntersectionObserver(([entry]) => setCardGone(!entry.isIntersecting && entry.boundingClientRect.top < 0)); o.observe(card.current); observers.push(o); }
    if (panel.current) {
      const o = new IntersectionObserver(([entry]) => setPanelIn(entry.isIntersecting), { rootMargin: "0px 0px -15% 0px" }); o.observe(panel.current); observers.push(o);
      // Count how many people actually reach the invitation, so the click rate can be read against it.
      const seen = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { track({ name: "line_view", stella_type: type.slug }); seen.disconnect(); } }, { threshold: 0.5 }); seen.observe(panel.current); observers.push(seen);
    }
    return () => observers.forEach(o => o.disconnect());
  }, [type.slug]);
  const barShown = !!url && cardGone && !panelIn;
  const lineLink = (placement: "panel" | "bar") => ({ href: url, target: "_blank", rel: "noopener noreferrer", onClick: () => track({ name: "line_click", stella_type: type.slug, placement }) });
  return <article className="lv-result">
    <div className="lv-wrap">
      <div ref={card} className="lv-type-card lv-dark" style={elementStyle(type.stem)}>
        <p className="lv-result-label" aria-hidden="true">YOUR CHARACTER</p>
        <div className="lv-type-card-art"><Character type={type} priority /></div>
        <p className="lv-result-lead">あなたのキャラは</p>
        <h1><Bx>{type.displayName}</Bx></h1>
        <p className="lv-type-card-catch"><Bx>{love.catch}</Bx></p>
        <ul className="lv-keywords">{love.keywords.map(word => <li key={word}>{word}</li>)}</ul>
      </div>

      <Section id="lv-r-traits" title="ステラファイルが見抜く、あなたの恋の傾向">
        <ul className="lv-traits">{love.traits.map(text => <li key={text}><Check size={16} strokeWidth={3} aria-hidden="true" /><Bx>{text}</Bx></li>)}</ul>
      </Section>

      <Section id="lv-r-charm" title="あなたの魅力と、その引き出し方">
        <p className="lv-text"><Bx>{love.charm}</Bx></p>
      </Section>

      <Section id="lv-r-pattern" title="恋の勝ちパターン・負けパターン">
        <div className="lv-winlose">
          <div className="lv-win"><h3><ThumbsUp size={17} aria-hidden="true" />勝ちパターン</h3><p><Bx>{love.win}</Bx></p></div>
          <div className="lv-lose"><h3><ThumbsDown size={17} aria-hidden="true" />負けパターン</h3><p><Bx>{love.lose}</Bx></p></div>
        </div>
      </Section>

      <Section id="lv-r-gift" title="あなたのアイテム" lead="アイテムは、あなたが生まれたときに受け取ったギフト。キャラ（本質）とは別の、強みや個性です。同じキャラでも、ここが人によって違います。">
        <div className="lv-gift"><div className="lv-gift-head"><span className="lv-gift-icon"><GiftIcon size={28} strokeWidth={1.6} aria-hidden="true" /></span><div><h3 className="lv-gift-name">{GOD_COPY[result.tenGod].item}</h3><p className="lv-gift-title"><Bx>{gift.title}</Bx></p></div></div><p className="lv-gift-text"><Bx>{gift.text}</Bx></p></div>
      </Section>

      <Section id="lv-r-hint" title="恋愛運を引き寄せるヒント">
        <div className="lv-hint lv-dark"><Heart size={20} aria-hidden="true" /><p><Bx>{love.hint}</Bx></p></div>
      </Section>

      <Section id="lv-r-compat" title="恋の相性">
        <div className="lv-compat">
          <div className="lv-compat-row is-best"><span className="lv-compat-label">{LOVE_COMPAT.best.label}</span><div><Partners stems={groups.best} /><p className="lv-compat-note"><Bx>{LOVE_COMPAT.best.note}</Bx></p></div></div>
          <div className="lv-compat-row is-good"><span className="lv-compat-label">{LOVE_COMPAT.good.label}</span><div><Partners stems={groups.good} /><p className="lv-compat-note"><Bx>{LOVE_COMPAT.good.note}</Bx></p></div></div>
          <div className="lv-compat-row is-foe"><span className="lv-compat-label">{LOVE_COMPAT.foe.label}</span><div>{url
            ? <p className="lv-compat-lock"><span className="lv-compat-q" aria-hidden="true">?</span><Lock size={14} aria-hidden="true" /><span>どのキャラかは<a href="#line">LINEで見られます</a></span></p>
            : <><Partners stems={groups.foe} /><p className="lv-compat-note"><Bx>{LOVE_COMPAT.foe.note}</Bx></p></>}</div></div>
        </div>
      </Section>

      {url && <section ref={panel} id="line" className="lv-line lv-dark" aria-labelledby="lv-line-title">
        <p className="lv-line-kicker">公式LINE限定</p>
        <h2 id="lv-line-title" className="lv-line-title"><Bx>あなたの恋愛運、続きはLINEで</Bx></h2>
        <p className="lv-line-lead"><Bx>ここまでは、まだ入り口。公式LINEでは、あなたの今の状況や悩みをうかがって、あなた一人のための鑑定をお届けします。</Bx></p>
        <ul className="lv-line-list">{LOVE_LINE_BENEFITS.map(text => <li key={text}><Lock size={15} aria-hidden="true" /><Bx>{text}</Bx></li>)}</ul>
        <ol className="lv-steps" aria-label="受け取り方">{LOVE_LINE_STEPS.map(text => <li key={text}><Bx>{text}</Bx></li>)}</ol>
        <a className="lv-line-button" {...lineLink("panel")}>LINEで詳しく見る</a>
        <p className="lv-line-note"><Bx>友だち追加は無料です。入力した生年月日が、このサイトからLINEに送られることはありません。</Bx></p>
      </section>}

      {/* No share box or outbound links here: after the result, the only way forward is the official LINE. */}
      <button type="button" className="lv-retry" onClick={onRetry}><RotateCcw size={14} aria-hidden="true" />生年月日を入れ直す</button>
      <p className="micro lv-disclaimer">※ステラファイルは、占いをもとにしたコンテンツです。</p>
    </div>
    {url && <>
      <div className="lv-bar-space" aria-hidden="true" />
      <div className={`lv-bar${barShown ? " is-shown" : ""}`} inert={!barShown}>
        <div className="lv-bar-inner"><p><Bx>恋愛運の続きは、公式LINEで</Bx></p><a className="lv-line-button" {...lineLink("bar")}>LINEで詳しく見る</a></div>
      </div>
    </>}
  </article>;
}
