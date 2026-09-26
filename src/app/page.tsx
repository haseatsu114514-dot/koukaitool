import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { Bx } from "@/components/bx";
import { Character } from "@/components/character";
import { SectionHead } from "@/components/section-head";
import { TypeCard } from "@/components/type-card";
import { BirthForm } from "@/components/birth-form";

export default function Home() {
  return <>
    <section className="hero page-width">
      <div className="hero-copy">
        <p className="hero-kicker"><span>生年月日でわかる</span>10のステラタイプ診断</p>
        <h1>あなたは、<br /><span className="nowrap">どの<span className="serif-accent">ステラタイプ</span>？</span></h1>
        <p className="hero-description"><Bx>生年月日を入れるだけ。</Bx><br /><Bx>10のステラタイプから、あなたの性格・恋愛・仕事の傾向と、相性のいい相手がわかります。</Bx></p>
        <div id="diagnose" className="hero-form"><BirthForm /><p className="micro hero-note">無料・登録なし・生年月日はどこにも送信されません</p></div>
      </div>
      <div className="constellation" aria-label="10のステラタイプ">
        <div className="constellation-ring" aria-hidden="true" />
        <div className="constellation-core" aria-hidden="true"><span className="core-num">10</span><span className="core-label">STELLA TYPES</span></div>
        <ul className="constellation-orbit">
          {CHARACTER_TYPES.map((type, i) => <li key={type.slug} style={{ "--a": `${i * 36 - 90}deg` } as React.CSSProperties}>
            <Link href={`/types/${type.slug}/`} className="constellation-star" style={elementStyle(type.stem)} aria-label={type.displayName}><Character type={type} priority /></Link>
          </li>)}
        </ul>
      </div>
    </section>
    {/* Phones: a light parade replaces the orbit, since the full grid follows right below. */}
    <div className="parade" aria-hidden="true"><div className="parade-track">
      {[0, 1].map(round => CHARACTER_TYPES.map(type => <span key={`${round}-${type.slug}`} className="parade-item"><span className="parade-face" style={elementStyle(type.stem)}><Character type={type} /></span>{type.displayName}</span>))}
    </div></div>
    <section className="instant page-width reveal">
      <p className="instant-lead">質問は、ひとつもありません。</p>
      <h2 className="instant-title"><span className="chunk">生まれた日が、</span><wbr /><span className="chunk serif-accent">そのまま答え。</span></h2>
      <dl className="instant-facts"><div><dt>質問</dt><dd><strong>0</strong>問</dd></div><div><dt>入力</dt><dd><strong>3</strong>項目</dd></div><div><dt>結果まで</dt><dd><strong>1</strong>タップ</dd></div></dl>
    </section>
    <section className="section page-width reveal"><div className="section-heading"><SectionHead num="01" label="ステラタイプ紹介" title="10のステラタイプ" lead={<Bx>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</Bx>} /><Link className="text-link" href="/types/">すべて見る <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="type-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.slug} type={type} />)}</div></section>
    <section className="closing page-width reveal">
      <div className="closing-card frame">
        <div className="closing-faces" aria-hidden="true">{CHARACTER_TYPES.filter((_, i) => i % 2 === 0).map(type => <span key={type.slug} className="closing-face" style={elementStyle(type.stem)}><Character type={type} /></span>)}</div>
        <SectionHead num="02" label="さあ、はじめよう" title="あなたのファイルを、ひらこう。" lead={<Bx>生年月日を入れると、あなただけの1冊がひらきます。</Bx>} />
        <Link className="button primary" href="#diagnose">生年月日を入力する <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  </>;
}
