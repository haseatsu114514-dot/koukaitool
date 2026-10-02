"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Heart, Lock, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { CHARACTER_TYPES, elementStyle, typeByStem, type CharacterType } from "@/data/types";
import { LOVE_COMPAT, LOVE_COPY, LOVE_GIFTS, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS } from "@/data/love-copy";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { stellaCompatibility } from "@/lib/diagnosis/compatibility";
import { GOD_COPY } from "@/lib/diagnosis/ten-gods";
import { loveLineUrlFor } from "@/lib/line";
import { track } from "@/lib/analytics";
import { Phrases } from "./phrases";
import { Character } from "./character";
import { ITEM_ICONS } from "./item-icon";
import { TypeName } from "./type-name";

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return <section className="lv-r-sec lv-reveal" aria-labelledby={id}>
    <h2 id={id} className="lv-r-title"><Phrases>{title}</Phrases></h2>
    {lead && <p className="lv-r-lead">{lead}</p>}
    {children}
  </section>;
}

function Partners({ stems }: { stems: CharacterType["stem"][] }) {
  return <ul className="lv-compat-types">{stems.map(stem => { const partner = typeByStem(stem); return <li key={stem}><span className="lv-mini-art" style={elementStyle(stem)}><Character type={partner} /></span><TypeName name={partner.displayName} /></li>; })}</ul>;
}

/** The love result: キャラ (the type), her tendencies in love, charm, what works and the usual misstep, ギフト (the item, read for love), one hint, compatibility, then the official LINE.
 * Running text is plain (print-style breaks); headings and short items break between phrases.
 * A bar with the LINE button follows the reader once the type card scrolls away, and steps aside while the full invitation is on screen.
 * Until a friend-add URL is configured, the invitation and buttons are still shown; pressing one says the official LINE is being prepared. */
export function LoveResult({ result, onRetry }: { result: DiagnosisResult; onRetry: () => void }) {
  const type = typeByStem(result.pillar.stem), love = LOVE_COPY[type.slug];
  const gift = LOVE_GIFTS[result.tenGod], GiftIcon = ITEM_ICONS[result.tenGod];
  const groups = stellaCompatibility(type.stem), url = loveLineUrlFor(type.slug);
  const card = useRef<HTMLDivElement>(null), panel = useRef<HTMLElement>(null);
  const number = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0"), today = new Date();
  const diagnosedOn = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  const [cardGone, setCardGone] = useState(false), [panelIn, setPanelIn] = useState(false), [pending, setPending] = useState(false);
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
  const barShown = cardGone && !panelIn;
  const lineLink = (placement: "panel" | "bar") => url
    ? { href: url, target: "_blank", rel: "noopener noreferrer", onClick: () => track({ name: "line_click", stella_type: type.slug, placement }) }
    : { href: "#line", onClick: (event: React.MouseEvent) => { event.preventDefault(); track({ name: "line_click", stella_type: type.slug, placement }); setPending(true); panel.current?.scrollIntoView({ block: "center" }); } };
  return <article className="lv-result">
    <div className="lv-wrap">
      {/* Set like a certificate: double gold rule, file number and date, and the supervisor's seal on the portrait. */}
      <div ref={card} className="lv-type-card lv-dark" style={elementStyle(type.stem)}>
        <p className="lv-cert-head"><span>STELLA FILE No.{number}</span><span>診断日 {diagnosedOn}</span></p>
        <p className="lv-result-label" aria-hidden="true">YOUR CHARACTER</p>
        <div className="lv-type-card-art"><Character type={type} priority /><span className="lv-seal" aria-label="プロ占い師監修">プロ占い師<b>監修</b></span></div>
        <p className="lv-result-lead">あなたのキャラは</p>
        <h1><TypeName name={type.displayName} /></h1>
        <p className="lv-type-card-catch"><Phrases>{love.catch}</Phrases></p>
        <ul className="lv-keywords">{love.keywords.map(word => <li key={word}>{word}</li>)}</ul>
      </div>

      <Section id="lv-r-traits" title="ステラファイルが見抜く、あなたの恋の傾向">
        <ul className="lv-traits lv-stagger">{love.traits.map((text, i) => <li key={text} style={{ "--i": i } as React.CSSProperties}><Check size={16} strokeWidth={3} aria-hidden="true" /><Phrases>{text}</Phrases></li>)}</ul>
      </Section>

      <Section id="lv-r-charm" title="あなたの魅力と、その引き出し方">
        <p className="lv-text">{love.charm}</p>
      </Section>

      <Section id="lv-r-pattern" title="恋がうまくいく法則と、やりがちなNG">
        <div className="lv-winlose">
          <div className="lv-win"><h3><ThumbsUp size={17} aria-hidden="true" />うまくいく法則</h3><p>{love.win}</p></div>
          <div className="lv-lose"><h3><ThumbsDown size={17} aria-hidden="true" />やりがちなNG</h3><p>{love.lose}</p></div>
        </div>
      </Section>

      <Section id="lv-r-gift" title="あなたのギフト" lead="ギフトは、生まれたときに受け取った強みや個性。キャラ（本質）とは別の、もうひとつの持ち味です。同じキャラでも、ここが人によって違います。">
        <div className="lv-gift"><div className="lv-gift-head"><span className="lv-gift-icon"><GiftIcon size={28} strokeWidth={1.6} aria-hidden="true" /></span><div><h3 className="lv-gift-name">{GOD_COPY[result.tenGod].item}</h3><p className="lv-gift-title"><Phrases>{gift.title}</Phrases></p></div></div><p className="lv-gift-text">{gift.text}</p></div>
      </Section>

      <Section id="lv-r-hint" title="恋愛運を引き寄せるヒント">
        <div className="lv-hint lv-dark"><Heart size={20} aria-hidden="true" /><p>{love.hint}</p></div>
      </Section>

      <Section id="lv-r-compat" title="恋の相性">
        <div className="lv-compat">
          <div className="lv-compat-row is-best"><span className="lv-compat-label">{LOVE_COMPAT.best.label}</span><div><Partners stems={groups.best} /><p className="lv-compat-note">{LOVE_COMPAT.best.note}</p></div></div>
          <div className="lv-compat-row is-good"><span className="lv-compat-label">{LOVE_COMPAT.good.label}</span><div><Partners stems={groups.good} /><p className="lv-compat-note">{LOVE_COMPAT.good.note}</p></div></div>
          <div className="lv-compat-row is-foe"><span className="lv-compat-label">{LOVE_COMPAT.foe.label}</span><div><p className="lv-compat-lock"><span className="lv-compat-q" aria-hidden="true">?</span><Lock size={14} aria-hidden="true" /><span>どのキャラかは<a href="#line">LINEで見られます</a></span></p></div></div>
        </div>
      </Section>

      <section ref={panel} id="line" className="lv-line lv-dark lv-sky lv-reveal" aria-labelledby="lv-line-title">
        <p className="lv-line-kickers"><span className="lv-line-kicker">公式LINE限定</span><span className="lv-free-kicker">友だち追加 無料</span></p>
        <h2 id="lv-line-title" className="lv-line-title"><Phrases>あなたの恋愛運、続きはLINEで</Phrases></h2>
        <p className="lv-line-lead"><Phrases>ここまでは、まだ入り口。公式LINEでは、あなたの今の状況や悩みをうかがって、あなた一人のための鑑定をお届けします。</Phrases></p>
        <ul className="lv-line-list">{LOVE_LINE_BENEFITS.map(text => <li key={text}><Lock size={15} aria-hidden="true" /><Phrases>{text}</Phrases></li>)}</ul>
        <ol className="lv-steps" aria-label="受け取り方">{LOVE_LINE_STEPS.map(text => <li key={text}><Phrases>{text}</Phrases></li>)}</ol>
        <p className="lv-free-callout" aria-hidden="true">＼ 友だち追加は無料 ／</p>
        <a className="lv-line-button" {...lineLink("panel")}><span className="lv-free-tag">無料</span>LINEで詳しく見る</a>
        <p className="lv-line-pending" role="status">{pending ? "公式LINEは準備中です。まもなく、ここから友だち追加できるようになります。" : ""}</p>
        <p className="lv-line-note"><Phrases>友だち追加は無料です。いつでもブロックできます。入力した生年月日が、このサイトからLINEに送られることはありません。</Phrases></p>
      </section>

      {/* No share box or outbound links here: after the result, the only way forward is the official LINE. */}
      <button type="button" className="lv-retry" onClick={onRetry}><RotateCcw size={14} aria-hidden="true" />生年月日を入れ直す</button>
      <p className="micro lv-disclaimer">※ステラファイルは、占いをもとにしたコンテンツです。</p>
    </div>
    <div className="lv-bar-space" aria-hidden="true" />
    <div className={`lv-bar${barShown ? " is-shown" : ""}`} inert={!barShown}>
      <div className="lv-bar-inner"><p><Phrases>友だち追加は無料。｜恋愛運の続きは、公式LINEで</Phrases></p><a className="lv-line-button" {...lineLink("bar")}><span className="lv-free-tag">無料</span>LINEで詳しく見る</a></div>
    </div>
  </article>;
}
