import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { TYPE_DETAILS } from "@/data/type-details";
import { Bx } from "@/components/bx";
import { Character } from "@/components/character";
import { TypeCard } from "@/components/type-card";
import { BirthForm } from "@/components/birth-form";

/** The one あるある per type that reads best out of context, shown on the home list so visitors can guess their type before checking. */
const HOOK: Record<string, number> = { grizzly: 5, rabbit: 1, phoenix: 0, fox: 0, panda: 2, alpaca: 0, doberman: 0, hedgehog: 3, orca: 0, capybara: 1 };

export default function Home() {
  return <>
    <section className="hero page-width">
      <div className="hero-copy">
        <div className="hero-faces" aria-hidden="true">{CHARACTER_TYPES.map(type => <span key={type.slug} className="hero-face" style={elementStyle(type.stem)}><Character type={type} priority /></span>)}</div>
        <p className="hero-kicker">生年月日でわかる 10のステラタイプ診断</p>
        <h1>あなたは、<br /><span className="nowrap">どの<span className="accent">ステラタイプ</span>？</span></h1>
        <p className="hero-description"><Bx>生年月日を入れるだけ。質問はありません。</Bx><br /><Bx>性格・恋愛・仕事の傾向と、相性のいいタイプがわかります。</Bx></p>
        <div id="diagnose" className="hero-form"><BirthForm /><p className="micro hero-note">約10秒・無料・登録なし。生年月日はどこにも送信されません</p></div>
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
    <section className="section page-width home-types" aria-labelledby="home-types-title">
      <div className="section-heading"><div className="sec-head"><h2 id="home-types-title" className="sec-title">10のステラタイプ</h2><p className="sec-lead"><Bx>あるあるを読んで、自分っぽいタイプを予想してから診断してみてください。</Bx></p></div><Link className="text-link" href="/types/">図鑑で見る <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <div className="type-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.slug} type={type} aruaru={TYPE_DETAILS[type.slug].aruaru[HOOK[type.slug]]} />)}</div>
      <div className="guess-cta">
        <h2 className="guess-title">予想はできましたか？</h2>
        <p className="guess-text"><Bx>答え合わせは生年月日で。結果は画像にして、友だちと見せ合えます。</Bx></p>
        <Link className="button primary" href="#diagnose">生年月日で答え合わせ <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
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
