import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Check, Quote, ArrowLeft } from "lucide-react";
import { CHARACTER_TYPES, elementStyle, typeByStem, type CharacterType } from "@/data/types";
import { TYPE_DETAILS } from "@/data/type-details";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { GOD_COPY, type TenGod } from "@/lib/diagnosis/ten-gods";
import { compatibility, type CompatibilityLevel } from "@/lib/diagnosis/compatibility";
import { Bx } from "./bx";
import { Character } from "./character";
import { ITEM_ICONS } from "./item-icon";
import { ShareActions } from "./share-actions";

const COMPATIBILITY_LABELS: Record<CompatibilityLevel, { label: string; note: string }> = {
  best: { label: "最高の相性", note: "自然と惹かれ合う組み合わせ。一緒にいると、お互いの足りないところを補えます。" },
  good: { label: "相性がいい", note: "あなたを後ろから支えてくれる相手。そばにいると力が出やすくなります。" },
  attracted: { label: "惹かれやすい相手", note: "つい気になって、世話を焼きたくなる相手。あなたが力を注ぐほど、相手も輝きます。" },
  caution: { label: "ちょっと注意", note: "考え方がぶつかりやすい相手。違いを知っておけば、うまく付き合えます。" },
};

function ItemBadge({ tenGod }: { tenGod: TenGod }) {
  const Icon = ITEM_ICONS[tenGod];
  return <a className="item-badge" href="#item" aria-label={`あなたのアイテム：${GOD_COPY[tenGod].item}`}><span className="item-badge-icon"><Icon size={26} strokeWidth={1.6} aria-hidden="true" /></span><span className="item-badge-label">{GOD_COPY[tenGod].item}</span></a>;
}

function ItemCard({ tenGod }: { tenGod: TenGod }) {
  const copy = GOD_COPY[tenGod], Icon = ITEM_ICONS[tenGod];
  return <div className="item-card"><div className="item-icon"><Icon size={34} strokeWidth={1.5} aria-hidden="true" /></div><div><h3 className="item-name">{copy.item}</h3><p className="item-title"><Bx>{copy.title}</Bx></p><p><Bx>{copy.strength}</Bx></p><p className="gentle-tip"><Bx>{copy.hint}</Bx></p></div></div>;
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

/** Editorial two-column chapter: numbered heading on the left, content on the right. */
function Chapter({ id, num, label, title, children }: { id: string; num: number; label: string; title: React.ReactNode; children: React.ReactNode }) {
  return <section id={id} className="chapter reveal">
    <header className="chapter-head"><span className="chapter-num">{String(num).padStart(2, "0")}</span><span className="chapter-label">{label}</span><h2 className="chapter-title">{title}</h2></header>
    <div className="chapter-body">{children}</div>
  </section>;
}

export function Profile({ type, result }: { type: CharacterType; result?: DiagnosisResult }) {
  const detail = TYPE_DETAILS[type.slug];
  const number = String(CHARACTER_TYPES.indexOf(type) + 1).padStart(2, "0");
  const chapters: { id: string; label: string; title: React.ReactNode; body: React.ReactNode }[] = [
    { id: "about", label: "どんな人？", title: "性格", body: detail.intro.map(text => <p key={text} className="lead-text"><Bx>{text}</Bx></p>) },
    { id: "aruaru", label: "あるある", title: "よくあること", body: <ol className="aruaru">{detail.aruaru.map(text => <li key={text}><Bx>{text}</Bx></li>)}</ol> },
    { id: "strength", label: "強みと弱み", title: "強み・苦手なこと", body: <div className="strength-pair">
      <div className="strength-section"><h3>強み</h3><ul className="strength-list">{type.strengths.map((item, i) => <li key={item} style={{ "--i": i } as React.CSSProperties}><Check size={18} aria-hidden="true" /><Bx>{item}</Bx></li>)}</ul></div>
      <div className="weak-section"><h3>ちょっと苦手なこと</h3><p><Bx>{detail.weakness}</Bx></p></div>
    </div> },
    ...(result ? [{ id: "item", label: "アイテム", title: "あなたのアイテム", body: <ItemCard tenGod={result.tenGod} /> }] : []),
    { id: "love", label: "恋愛", title: "恋愛の傾向", body: <p><Bx>{detail.romance}</Bx></p> },
    { id: "work", label: "仕事", title: "仕事の傾向", body: <><p><Bx>{detail.work}</Bx></p><p className="jobs-label">向いている仕事</p><ul className="jobs">{detail.jobs.map(job => <li key={job}>{job}</li>)}</ul></> },
    { id: "friends", label: "人間関係", title: "人との付き合い方", body: <p><Bx>{detail.relationships}</Bx></p> },
    { id: "care", label: "ストレスと対策", title: "疲れたときは", body: <div className="care-pair">
      <div className="care-card"><h3>ストレスがたまると</h3><p><Bx>{detail.stress}</Bx></p></div>
      <div className="care-card advice-card"><Quote className="advice-quote" size={34} aria-hidden="true" /><h3>もっと輝くためのヒント</h3><p><Bx>{detail.advice}</Bx></p></div>
    </div> },
    { id: "compat", label: "相性", title: "相性のいいタイプ", body: <Compatibility type={type} /> },
  ];
  return <article className="profile page-width">
    <Link className="breadcrumb" href={result ? "/#diagnose" : "/types/"}><ArrowLeft size={15} aria-hidden="true" />{result ? "もう一度診断する" : "ステラタイプ一覧へ"}</Link>
    <div className="profile-hero">
      <ViewTransition name={`character-${type.slug}`}><div className="profile-art" style={elementStyle(type.stem)}><Character type={type} priority />{result && <ItemBadge tenGod={result.tenGod} />}</div></ViewTransition>
      <div className="profile-title">
        <p className="profile-no"><span>No.</span>{number}<small>/ 10</small></p>
        {result && <p className="result-lead">あなたのステラタイプは</p>}
        <h1><Bx>{type.displayName}</Bx></h1>
        <p className="profile-catch"><Bx>{type.shortCatch}</Bx></p>
        <div className="keywords">{type.keywords.map(word => <span key={word}>{word}</span>)}</div>
        <ShareActions type={type} />
      </div>
    </div>
    <nav className="profile-toc" aria-label="このページの内容">{chapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.label}</a>)}</nav>
    <div className="profile-body">
      {chapters.map((chapter, i) => <Chapter key={chapter.id} id={chapter.id} num={i + 1} label={chapter.label} title={chapter.title}>{chapter.body}</Chapter>)}
      <p className="micro disclaimer">占いをもとにした診断なので、当てはまるところだけ参考にしてください。</p>
      <div className="profile-bottom"><Link className="button secondary" href="/types/">ほかのタイプも見る <ArrowRight size={17} /></Link>{!result && <Link className="text-link" href="/#diagnose">自分のタイプを診断する <ArrowRight size={17} aria-hidden="true" /></Link>}</div>
    </div>
  </article>;
}
