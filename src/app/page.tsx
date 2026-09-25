import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { Bx } from "@/components/bx";
import { Character } from "@/components/character";
import { TypeCard } from "@/components/type-card";
export default function Home() {
  const parade = [...CHARACTER_TYPES, ...CHARACTER_TYPES];
  return <>
    <section className="hero page-width">
      <div className="hero-copy">
        <h1>あなたは、<br /><span className="serif-accent">どの動物</span>タイプ？</h1>
        <p className="hero-description"><Bx>生年月日を入れるだけで、10タイプの中からあなたのタイプを診断します。</Bx><br /><Bx>性格や恋愛・仕事の傾向、相性のいいタイプまでわかります。</Bx></p>
        <Link className="button primary" href="/diagnose/">私のタイプを見つける <ArrowRight size={19} aria-hidden="true" /></Link>
        <p className="micro hero-note">無料・登録なし・30秒で結果が出ます</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-circle" />
        <div className="orbit"><span /><span /><span /></div>
        <div className="hero-animal hero-grizzly"><Character type={CHARACTER_TYPES[0]} priority /></div>
        <div className="hero-animal hero-rabbit"><Character type={CHARACTER_TYPES[1]} priority /></div>
        <div className="hero-animal hero-capybara"><Character type={CHARACTER_TYPES[9]} priority /></div>
      </div>
    </section>
    <div className="parade" aria-hidden="true"><div className="parade-track">{parade.map((type, i) => <span key={i} className="parade-item"><span className="parade-face" style={elementStyle(type.stem)}><Character type={type} /></span>{type.displayName}</span>)}</div></div>
    <section className="section page-width reveal"><div className="section-heading"><div><h2>10のタイプ</h2><p><Bx>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</Bx></p></div><Link className="text-link" href="/types/">すべて見る <ArrowRight size={17} /></Link></div><div className="preview-grid">{[0, 1, 7, 9].map(i => <TypeCard key={i} type={CHARACTER_TYPES[i]} />)}</div></section>
    <section className="how-section"><div className="page-width how-inner reveal"><div><h2>診断の流れ</h2><Link className="text-link" href="/about/">診断のしくみ <ArrowRight size={17} /></Link></div><ol className="steps"><li><span>1</span><div><h3>生年月日を入力</h3><p>生まれた時間はいりません。</p></div></li><li><span>2</span><div><h3>タイプがわかる</h3><p><Bx>性格や相性に加えて、あなただけのアイテムもわかります。</Bx></p></div></li><li><span>3</span><div><h3>友だちと見せ合う</h3><p>結果は画像で保存できます。</p></div></li></ol></div></section>
    <section className="closing page-width reveal"><h2>さっそく診断してみる</h2><Link className="button primary" href="/diagnose/">無料で診断する <ArrowRight size={18} /></Link></section>
  </>;
}
