import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Check, ArrowLeft, RotateCcw } from "lucide-react";
import { CHARACTER_TYPES, groupName, elementStyle, typeByStem, type CharacterType } from "@/data/types";
import { TYPE_DETAILS } from "@/data/type-details";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { GOD_COPY, type TenGod } from "@/lib/diagnosis/ten-gods";
import { compatibility, type CompatibilityLevel } from "@/lib/diagnosis/compatibility";
import { Bx } from "./bx";
import { Character } from "./character";
import { ITEM_ICONS } from "./item-icon";
import { ShareActions } from "./share-actions";
import { LineCta } from "./line-cta";

const COMPATIBILITY_LABELS: Record<CompatibilityLevel, { label: string; note: string }> = {
  best: { label: "最高の相性", note: "自然と惹かれ合う組み合わせ。一緒にいると、お互いの足りないところを補えます。" },
  good: { label: "相性がいい", note: "あなたを後ろから支えてくれる相手。そばにいると力が出やすくなります。" },
  attracted: { label: "惹かれやすい相手", note: "つい気になって、世話を焼きたくなる相手。あなたの応援が、相手の力になります。" },
  caution: { label: "ちょっと注意", note: "考え方がぶつかりやすい相手。違いを知っておけば、うまく付き合えます。" },
};

function ItemBadge({ tenGod }: { tenGod: TenGod }) {
  const Icon = ITEM_ICONS[tenGod];
  return <a className="item-badge" href="#item" aria-label={`あなたのアイテム：${GOD_COPY[tenGod].item}`}><span className="item-badge-icon"><Icon size={26} strokeWidth={1.6} aria-hidden="true" /></span><span className="item-badge-label">{GOD_COPY[tenGod].item}</span></a>;
}

function ItemCard({ tenGod }: { tenGod: TenGod }) {
  const copy = GOD_COPY[tenGod], Icon = ITEM_ICONS[tenGod];
  return <>
    <p className="chapter-lead"><Bx>同じタイプでも、生まれた季節によってアイテムは10通り。あなただけの持ち味を表しています。</Bx></p>
    <div className="item-card"><div className="item-icon"><Icon size={34} strokeWidth={1.5} aria-hidden="true" /></div><div><h3 className="item-name">{copy.item}</h3><p className="item-title"><Bx>{copy.title}</Bx></p><p><Bx>{copy.strength}</Bx></p><p className="gentle-tip"><Bx>{copy.hint}</Bx></p></div></div>
  </>;
}

function Compatibility({ type }: { type: CharacterType }) {
  const groups = compatibility(type.stem);
  return <div className="compat-groups">
    {(Object.keys(COMPATIBILITY_LABELS) as CompatibilityLevel[]).filter(level => groups[level].length > 0).map(level => <div key={level} className={`compat-group compat-${level}`}>
      <h3>{COMPATIBILITY_LABELS[level].label}</h3><p><Bx>{COMPATIBILITY_LABELS[level].note}</Bx></p>
      <ul>{groups[level].map(stem => { const partner = typeByStem(stem); return <li key={stem}><Link href={`/types/${partner.slug}/`}><span className="compat-art" style={elementStyle(stem)}><Character type={partner} /></span><span><Bx>{partner.displayName}</Bx></span></Link></li>; })}</ul>
    </div>)}
  </div>;
}

function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="chapter reveal" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className="chapter-title">{title}</h2>
    <div className="chapter-body">{children}</div>
  </section>;
}

/** Shared by the diagnosis result and the public type page. Only the result shows the item and result sharing; the public page leads visitors to their own diagnosis. */
export function Profile({ type, result }: { type: CharacterType; result?: DiagnosisResult }) {
  const detail = TYPE_DETAILS[type.slug];
  const number = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0");
  const chapters: { id: string; toc: string; title: string; body: React.ReactNode }[] = [
    { id: "about", toc: "性格", title: "どんな人？", body: detail.intro.map(text => <p key={text} className="lead-text"><Bx>{text}</Bx></p>) },
    { id: "aruaru", toc: "あるある", title: "あるある", body: <ol className="aruaru">{detail.aruaru.map(text => <li key={text}><Bx>{text}</Bx></li>)}</ol> },
    { id: "strength", toc: "強み", title: "強みと苦手なこと", body: <div className="strength-pair">
      <div className="strength-section"><h3>強み</h3><ul className="strength-list">{type.strengths.map(item => <li key={item}><Check size={18} aria-hidden="true" /><Bx>{item}</Bx></li>)}</ul></div>
      <div className="weak-section"><h3>ちょっと苦手なこと</h3><p><Bx>{detail.weakness}</Bx></p></div>
    </div> },
    ...(result ? [{ id: "item", toc: "アイテム", title: "あなたのアイテム", body: <ItemCard tenGod={result.tenGod} /> }] : []),
    { id: "love", toc: "恋愛", title: "恋愛の傾向", body: <p><Bx>{detail.romance}</Bx></p> },
    { id: "work", toc: "仕事", title: "仕事の傾向", body: <><p><Bx>{detail.work}</Bx></p><h3 className="jobs-label">向いている仕事</h3><ul className="jobs">{detail.jobs.map(job => <li key={job}>{job}</li>)}</ul></> },
    { id: "friends", toc: "人間関係", title: "人との付き合い方", body: <p><Bx>{detail.relationships}</Bx></p> },
    { id: "care", toc: "ストレス", title: "疲れたときは", body: <p><Bx>{detail.stress}</Bx></p> },
    { id: "advice", toc: "アドバイス", title: "アドバイス", body: <div className="advice-box"><p><Bx>{detail.advice}</Bx></p></div> },
    { id: "compat", toc: "相性", title: "相性", body: <Compatibility type={type} /> },
  ];
  return <article className="profile page-width">
    {!result && <Link className="breadcrumb" href="/types/"><ArrowLeft size={15} aria-hidden="true" />ステラタイプ一覧へ</Link>}
    <div className="profile-hero">
      <ViewTransition name={`character-${type.slug}`}><div className="profile-art" style={elementStyle(type.stem)}><Character type={type} priority />{result && <ItemBadge tenGod={result.tenGod} />}</div></ViewTransition>
      <div className="profile-title">
        <p className="profile-meta"><span className="profile-no">No.{number}<small>/ 10</small></span><span className="element-chip" style={elementStyle(type.stem)}><span className="element-orb" aria-hidden="true" />{groupName(type.stem)}</span></p>
        {result && <p className="result-lead">あなたのステラタイプは</p>}
        <h1><Bx>{type.displayName}</Bx></h1>
        <p className="profile-catch"><Bx>{type.shortCatch}</Bx></p>
        <ul className="keywords">{type.keywords.map(word => <li key={word}>{word}</li>)}</ul>
        {result ? <ShareActions type={type} mode="result" /> : <div className="profile-cta">
          <p className="profile-cta-lead">あなたは何タイプ？</p>
          <Link className="button primary" href="/#diagnose">生年月日で診断する <ArrowRight size={18} aria-hidden="true" /></Link>
          <ShareActions type={type} mode="type" />
        </div>}
      </div>
    </div>
    {result && <LineCta variant="bar" />}
    <nav className="profile-toc" aria-label="このページの内容">{chapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.toc}</a>)}</nav>
    <div className="profile-body">
      {chapters.map(chapter => <Chapter key={chapter.id} id={chapter.id} title={chapter.title}>{chapter.body}</Chapter>)}
      {result && <LineCta variant="panel" />}
      <p className="micro disclaimer">占いをもとにした診断なので、当てはまるところだけ参考にしてください。</p>
      {result ? <section className="cta-panel" aria-labelledby="share-title">
        <span className="cta-panel-art" style={elementStyle(type.stem)} aria-hidden="true"><Character type={type} /></span>
        <h2 id="share-title" className="cta-panel-title">結果をシェアしよう</h2>
        <p className="cta-panel-text"><Bx>画像を保存してSNSに、リンクで友だちに。友だちのタイプがわかれば、ふたりの相性も確かめられます。</Bx></p>
        <ShareActions type={type} mode="result" />
        <div className="cta-panel-links"><Link className="text-link" href="/#diagnose"><RotateCcw size={15} aria-hidden="true" />もう一度診断する</Link><Link className="text-link" href="/types/">ほかのタイプも見る <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section> : <section className="cta-panel" aria-labelledby="cta-title">
        <span className="cta-panel-art" style={elementStyle(type.stem)} aria-hidden="true"><Character type={type} /></span>
        <h2 id="cta-title" className="cta-panel-title">あなたのタイプを調べる</h2>
        <p className="cta-panel-text"><Bx>生年月日を入れるだけで、あなたのタイプとアイテムがわかります。</Bx></p>
        <Link className="button primary" href="/#diagnose">生年月日で診断する <ArrowRight size={18} aria-hidden="true" /></Link>
        <div className="cta-panel-links"><Link className="text-link" href="/types/">ほかのタイプも見る <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section>}
    </div>
  </article>;
}
