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
        <h1>あなたは、<br /><span className="serif-accent">どのステラ</span><wbr />タイプ？</h1>
        <p className="hero-description"><Bx>生年月日を入れるだけで、10のステラタイプの中からあなたのタイプを診断します。</Bx><br /><Bx>性格や恋愛・仕事の傾向、相性のいいタイプまでわかります。</Bx></p>
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
    <section className="instant page-width reveal">
      <p className="instant-lead">質問は、ひとつもありません。</p>
      <h2 className="instant-title"><span className="chunk">生まれた日が、</span><wbr /><span className="chunk serif-accent">そのまま答え。</span></h2>
      <dl className="instant-facts"><div><dt>質問</dt><dd><strong>0</strong>問</dd></div><div><dt>入力</dt><dd><strong>3</strong>項目</dd></div><div><dt>結果まで</dt><dd><strong>1</strong>タップ</dd></div></dl>
    </section>
    <section className="section page-width reveal"><div className="section-heading"><SectionHead num="01" label="ステラタイプ紹介" title="10のステラタイプ" lead={<Bx>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</Bx>} /><Link className="text-link" href="/types/">すべて見る <ArrowRight size={17} /></Link></div><div className="preview-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.slug} type={type} />)}</div></section>
    <section className="closing page-width reveal"><SectionHead num="02" label="さあ、はじめよう" title="さっそく診断してみる" /><Link className="button primary" href="#diagnose">生年月日を入力する <ArrowRight size={18} /></Link></section>
  </>;
}
