import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHARACTER_TYPES } from "@/data/types";
import { Character } from "@/components/character";
import { TypeCard } from "@/components/type-card";
export default function Home() {
  return <>
    <section className="hero page-width">
      <div className="hero-copy">
        <h1>あなたは、<br /><span className="serif-accent">どの動物</span>タイプ？</h1>
        <p className="hero-description">生年月日を入れるだけで、10タイプの中からあなたのタイプを診断します。性格や恋愛・仕事の傾向、相性のいいタイプまでわかります。</p>
        <Link className="button primary" href="/diagnose/">私のタイプを見つける <ArrowRight size={19} aria-hidden="true" /></Link>
        <p className="micro hero-note">無料・登録なし・30秒で結果が出ます</p>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="hero-circle" /><div className="hero-animal hero-grizzly"><Character type={CHARACTER_TYPES[0]} priority /></div><div className="hero-animal hero-rabbit"><Character type={CHARACTER_TYPES[1]} priority /></div><div className="hero-animal hero-capybara"><Character type={CHARACTER_TYPES[9]} priority /></div></div>
    </section>
    <section className="section page-width"><div className="section-heading"><div><h2>10のタイプ</h2><p>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</p></div><Link className="text-link" href="/types/">すべて見る <ArrowRight size={17} /></Link></div><div className="preview-grid">{[0, 1, 7, 9].map(i => <TypeCard key={i} type={CHARACTER_TYPES[i]} />)}</div></section>
    <section className="how-section"><div className="page-width how-inner"><div><h2>診断の流れ</h2><Link className="text-link" href="/about/">診断のしくみ <ArrowRight size={17} /></Link></div><ol className="steps"><li><span>1</span><div><h3>生年月日を入力</h3><p>生まれた時間はいりません。</p></div></li><li><span>2</span><div><h3>タイプがわかる</h3><p>性格、恋愛、仕事、人間関係、相性をまとめて見られます。</p></div></li><li><span>3</span><div><h3>友だちと見せ合う</h3><p>結果は画像で保存できます。</p></div></li></ol></div></section>
    <section className="closing page-width"><h2>さっそく診断してみる</h2><Link className="button primary" href="/diagnose/">無料で診断する <ArrowRight size={18} /></Link></section>
  </>;
}
