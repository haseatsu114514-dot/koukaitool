import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Check, Heart, BriefcaseBusiness, Users, Dumbbell, Crown, Cookie, Rose, Mic, PiggyBank, CalendarClock, Watch, Telescope, BookOpen, type LucideIcon } from "lucide-react";
import { elementColors, typeByStem, type CharacterType } from "@/data/types";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { GOD_COPY, type TenGod } from "@/lib/diagnosis/ten-gods";
import { compatibility, type CompatibilityLevel } from "@/lib/diagnosis/compatibility";
import { Character } from "./character";
import { ShareActions } from "./share-actions";

const COMPATIBILITY_LABELS: Record<CompatibilityLevel, { label: string; note: string }> = {
  best: { label: "最高の相性", note: "自然と惹かれ合う組み合わせ。一緒にいると、お互いの足りないところを補えます。" },
  good: { label: "相性がいい", note: "あなたを後ろから支えてくれる相手。そばにいると力が出やすくなります。" },
  attracted: { label: "惹かれやすい相手", note: "つい気になって、世話を焼きたくなる相手。あなたが力を注ぐほど、相手も輝きます。" },
  caution: { label: "ちょっと注意", note: "考え方がぶつかりやすい相手。違いを知っておけば、うまく付き合えます。" },
  nemesis: { label: "天敵", note: "なぜかペースを乱されがちな相手。張り合わずに、少し距離をとるのがうまくいくコツです。" },
};
const ITEM_ICONS: Record<TenGod, LucideIcon> = { 比肩: Dumbbell, 劫財: Crown, 食神: Cookie, 傷官: Rose, 偏財: Mic, 正財: PiggyBank, 偏官: CalendarClock, 正官: Watch, 偏印: Telescope, 印綬: BookOpen };

function ItemCard({ tenGod }: { tenGod: TenGod }) {
  const copy = GOD_COPY[tenGod], Icon = ITEM_ICONS[tenGod];
  return <section className="item-card reveal"><div className="item-icon"><Icon size={34} strokeWidth={1.5} aria-hidden="true" /></div><div><span className="insight-label">あなたのアイテム</span><h2>{copy.item}</h2><h3>{copy.title}</h3><p>{copy.strength}</p><p className="gentle-tip">{copy.hint}</p></div></section>;
}

function Compatibility({ type }: { type: CharacterType }) {
  const groups = compatibility(type.stem);
  return <section className="compat-section reveal"><h2>相性</h2><div className="compat-groups">
    {(Object.keys(COMPATIBILITY_LABELS) as CompatibilityLevel[]).filter(level => groups[level].length > 0).map((level, index) => <div key={level} className={`compat-group compat-${level}`} style={{ "--i": index } as React.CSSProperties}>
      <h3>{COMPATIBILITY_LABELS[level].label}</h3><p>{COMPATIBILITY_LABELS[level].note}</p>
      <ul>{groups[level].map(stem => { const partner = typeByStem(stem); const element = elementColors(stem); return <li key={stem}><Link href={`/types/${partner.slug}/`}><span className="compat-art" style={{ background: element.tint, "--el": element.color } as React.CSSProperties}><Character type={partner} /></span><span>{partner.displayName}</span></Link></li>; })}</ul>
    </div>)}
  </div></section>;
}

export function Profile({ type, result }: { type: CharacterType; result?: DiagnosisResult }) {
  const element = elementColors(type.stem);
  return <article className="profile page-width">
    <Link className="breadcrumb" href={result ? "/diagnose/" : "/types/"}>← {result ? "もう一度診断する" : "タイプ一覧へ"}</Link>
    <div className="profile-hero">
      <ViewTransition name={`character-${type.slug}`}><div className="profile-art" style={{ background: element.tint, "--el": element.color } as React.CSSProperties}><Character type={type} priority /></div></ViewTransition>
      <div className="profile-title">
        {result && <p className="result-lead">あなたのタイプは</p>}
        <h1>{type.displayName}</h1>
        <p className="profile-catch">{type.shortCatch}</p>
        <div className="keywords">{type.keywords.map(word => <span key={word}>{word}</span>)}</div>
        <ShareActions type={type} />
      </div>
    </div>
    <div className="profile-body">
      <section><h2>どんな人？</h2><p>{type.summary}</p></section>
      <section className="strength-section reveal"><h2>強み</h2><ul className="strength-list">{type.strengths.map((item, i) => <li key={item} style={{ "--i": i } as React.CSSProperties}><Check size={18} aria-hidden="true" />{item}</li>)}</ul>
      </section>
      {result && <ItemCard tenGod={result.tenGod} />}
      <div className="tendency-grid reveal">
        <section><Heart size={22} strokeWidth={1.6} /><h2>恋愛</h2><p>{type.romance}</p></section>
        <section><BriefcaseBusiness size={22} strokeWidth={1.6} /><h2>仕事</h2><p>{type.workStyle}</p></section>
        <section><Users size={22} strokeWidth={1.6} /><h2>人間関係</h2><p>{type.relationshipStyle}</p></section>
      </div>
      <Compatibility type={type} />
      <p className="micro disclaimer">占いをもとにした診断なので、当てはまるところだけ参考にしてください。<Link href="/about/">診断のしくみ</Link></p>
      <div className="profile-bottom"><Link className="button secondary" href="/types/">ほかのタイプも見る <ArrowRight size={17} /></Link>{!result && <Link className="text-link" href="/diagnose/">自分のタイプを診断する →</Link>}</div>
    </div>
  </article>;
}
