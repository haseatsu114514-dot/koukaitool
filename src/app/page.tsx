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
        <p className="hero-kicker">生年月日でわかる 10のステラタイプ診断</p>
        <h1>あなたは、<br /><span className="nowrap">どの<span className="accent">ステラタイプ</span>？</span></h1>
        <p className="hero-description"><Bx>生年月日を入れるだけ。</Bx><br /><Bx>10のステラタイプから、あなたの性格・恋愛・仕事の傾向と、相性のいい相手がわかります。</Bx></p>
        <div id="diagnose" className="hero-form"><BirthForm /><p className="micro hero-note">無料・登録なし・生年月日はどこにも送信されません</p></div>
      </div>
      <div className="constellation" aria-label="10のステラタイプ">
        <div className="constellation-ring" aria-hidden="true" />
        <div className="constellation-core" aria-hidden="true"><span className="core-num">10</span><span className="core-label">のタイプ</span></div>
        <ul className="constellation-orbit">
          {CHARACTER_TYPES.map((type, i) => <li key={type.slug} style={{ "--a": `${i * 36 - 90}deg` } as React.CSSProperties}>
            <Link href={`/types/${type.slug}/`} className="constellation-star" style={elementStyle(type.stem)} aria-label={type.displayName}><Character type={type} priority /></Link>
          </li>)}
        </ul>
      </div>
    </section>
    {/* Phones: the circle is replaced by a row you can swipe through. */}
    <ul className="type-strip" aria-label="10のステラタイプ">
      {CHARACTER_TYPES.map(type => <li key={type.slug}><Link href={`/types/${type.slug}/`}><span className="strip-face" style={elementStyle(type.stem)}><Character type={type} /></span><Bx>{type.displayName}</Bx></Link></li>)}
    </ul>
    <section className="section page-width reveal"><div className="section-heading"><SectionHead title="10のステラタイプ" lead={<Bx>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</Bx>} /><Link className="text-link" href="/types/">すべて見る <ArrowRight size={16} aria-hidden="true" /></Link></div><div className="type-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.slug} type={type} />)}</div></section>
    <section className="about page-width reveal" aria-labelledby="about-title">
      <div className="about-panel">
        <div>
          <h2 id="about-title" className="sec-title">この診断について</h2>
          <p><Bx>ステラファイルは、東洋の暦（四柱推命）の考え方をもとに、生まれた日から10のタイプを出しています。診断すると、生まれたときに受け取ったギフトとして、あなたの「アイテム」もわかります。</Bx></p>
          <p><Bx>占いをもとにした読みものです。当てはまるところだけ、自分を知るヒントとして使ってください。</Bx></p>
        </div>
        <div className="about-actions">
          <Link className="button primary" href="#diagnose">生年月日を入力する <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link className="text-link" href="/privacy/">生年月日の扱いについて <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  </>;
}
