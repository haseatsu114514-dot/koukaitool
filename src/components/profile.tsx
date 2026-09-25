import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Check, Heart, BriefcaseBusiness, Users, CloudRain, Sparkles, TriangleAlert, Quote } from "lucide-react";
import { elementStyle, typeByStem, type CharacterType } from "@/data/types";
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
  nemesis: { label: "天敵", note: "なぜかペースを乱されがちな相手。張り合わずに、少し距離をとるのがうまくいくコツです。" },
};

function ItemBadge({ tenGod }: { tenGod: TenGod }) {
  const Icon = ITEM_ICONS[tenGod];
  return <a className="item-badge" href="#item" aria-label={`あなたのアイテム：${GOD_COPY[tenGod].item}`}><span className="item-badge-icon"><Icon size={26} strokeWidth={1.6} aria-hidden="true" /></span><span className="item-badge-label">{GOD_COPY[tenGod].item}</span></a>;
}

function ItemCard({ tenGod }: { tenGod: TenGod }) {
  const copy = GOD_COPY[tenGod], Icon = ITEM_ICONS[tenGod];
  return <section id="item" className="item-card chapter reveal"><div className="item-icon"><Icon size={34} strokeWidth={1.5} aria-hidden="true" /></div><div><span className="insight-label">あなたのアイテム</span><h2>{copy.item}</h2><h3><Bx>{copy.title}</Bx></h3><p><Bx>{copy.strength}</Bx></p><p className="gentle-tip"><Bx>{copy.hint}</Bx></p></div></section>;
}

function Compatibility({ type }: { type: CharacterType }) {
  const groups = compatibility(type.stem);
  return <section id="compat" className="chapter compat-section reveal"><h2 className="chapter-title">相性</h2><div className="compat-groups">
    {(Object.keys(COMPATIBILITY_LABELS) as CompatibilityLevel[]).filter(level => groups[level].length > 0).map(level => <div key={level} className={`compat-group compat-${level}`}>
      <h3>{COMPATIBILITY_LABELS[level].label}</h3><p><Bx>{COMPATIBILITY_LABELS[level].note}</Bx></p>
      <ul>{groups[level].map(stem => { const partner = typeByStem(stem); return <li key={stem}><Link href={`/types/${partner.slug}/`}><span className="compat-art" style={elementStyle(stem)}><Character type={partner} /></span><span><Bx>{partner.displayName}</Bx></span></Link></li>; })}</ul>
    </div>)}
  </div></section>;
}

export function Profile({ type, result }: { type: CharacterType; result?: DiagnosisResult }) {
  const detail = TYPE_DETAILS[type.slug];
  const toc = [["about", "どんな人？"], ["aruaru", "あるある"], ["strength", "強みと弱み"], ...(result ? [["item", "アイテム"]] : []), ["love", "恋愛"], ["work", "仕事"], ["friends", "人間関係"], ["care", "ストレスと対策"], ["compat", "相性"]];
  return <article className="profile page-width">
    <Link className="breadcrumb" href={result ? "/diagnose/" : "/types/"}>← {result ? "もう一度診断する" : "タイプ一覧へ"}</Link>
    <div className="profile-hero">
      <ViewTransition name={`character-${type.slug}`}><div className="profile-art" style={elementStyle(type.stem)}><Character type={type} priority />{result && <ItemBadge tenGod={result.tenGod} />}</div></ViewTransition>
      <div className="profile-title">
        {result && <p className="result-lead">あなたのタイプは</p>}
        <h1><Bx>{type.displayName}</Bx></h1>
        <p className="profile-catch"><Bx>{type.shortCatch}</Bx></p>
        <div className="keywords">{type.keywords.map(word => <span key={word}>{word}</span>)}</div>
        <ShareActions type={type} />
      </div>
    </div>
    <nav className="profile-toc" aria-label="このページの内容">{toc.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <div className="profile-body">
      <section id="about" className="chapter reveal"><h2 className="chapter-title">どんな人？</h2>{detail.intro.map(text => <p key={text} className="lead-text"><Bx>{text}</Bx></p>)}</section>
      <section id="aruaru" className="chapter reveal"><h2 className="chapter-title"><span className="chunk">{type.displayName}</span><wbr /><span className="chunk">あるある</span></h2><ol className="aruaru">{detail.aruaru.map(text => <li key={text}><Bx>{text}</Bx></li>)}</ol></section>
      <section id="strength" className="chapter strength-pair reveal">
        <div className="strength-section"><h2><Sparkles size={20} aria-hidden="true" />強み</h2><ul className="strength-list">{type.strengths.map((item, i) => <li key={item} style={{ "--i": i } as React.CSSProperties}><Check size={18} aria-hidden="true" /><Bx>{item}</Bx></li>)}</ul></div>
        <div className="weak-section"><h2><TriangleAlert size={20} aria-hidden="true" />ちょっと苦手なこと</h2><p><Bx>{detail.weakness}</Bx></p></div>
      </section>
      {result && <ItemCard tenGod={result.tenGod} />}
      <section id="love" className="chapter topic reveal"><div className="topic-icon"><Heart size={22} strokeWidth={1.6} /></div><div><h2>恋愛</h2><p><Bx>{detail.romance}</Bx></p></div></section>
      <section id="work" className="chapter topic reveal"><div className="topic-icon"><BriefcaseBusiness size={22} strokeWidth={1.6} /></div><div><h2>仕事</h2><p><Bx>{detail.work}</Bx></p><p className="jobs-label">向いている仕事</p><ul className="jobs">{detail.jobs.map(job => <li key={job}>{job}</li>)}</ul></div></section>
      <section id="friends" className="chapter topic reveal"><div className="topic-icon"><Users size={22} strokeWidth={1.6} /></div><div><h2>人間関係</h2><p><Bx>{detail.relationships}</Bx></p></div></section>
      <section id="care" className="chapter care-pair reveal">
        <div className="care-card"><h2><CloudRain size={20} aria-hidden="true" />ストレスがたまると</h2><p><Bx>{detail.stress}</Bx></p></div>
        <div className="care-card advice-card"><Quote className="advice-quote" size={34} aria-hidden="true" /><h2>もっと輝くためのヒント</h2><p><Bx>{detail.advice}</Bx></p></div>
      </section>
      <Compatibility type={type} />
      <p className="micro disclaimer">占いをもとにした診断なので、当てはまるところだけ参考にしてください。<Link href="/about/">診断のしくみ</Link></p>
      <div className="profile-bottom"><Link className="button secondary" href="/types/">ほかのタイプも見る <ArrowRight size={17} /></Link>{!result && <Link className="text-link" href="/diagnose/">自分のタイプを診断する →</Link>}</div>
    </div>
  </article>;
}
