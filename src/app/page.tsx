import Link from "next/link";
import { ArrowRight, MoveDown, Sparkle } from "lucide-react";
import { CHARACTER_TYPES } from "@/data/types";
import { Character } from "@/components/character";
import { TypeCard } from "@/components/type-card";
export default function Home() {
  return <><section className="hero page-width"><div className="hero-copy"><p className="eyebrow"><span /> BIRTHDAY × PERSONALITY</p><h1>私らしさに、<br />ひとつ<span className="serif-accent">気づく。</span></h1><p className="hero-description">しっかり者の私も、ちょっと繊細な私も。<br />生年月日をひもとくと、<br />まだ知らない「私のいいところ」が見えてくる。</p><Link className="button primary" href="/diagnose/">私のタイプを見つける <ArrowRight size={19} aria-hidden="true" /></Link><p className="micro hero-note">約30秒 · 無料 · 会員登録なし</p></div>
    <div className="hero-art" aria-label="ステラファイルのキャラクターたち"><span className="art-kicker">MEET YOUR LITTLE SELF.</span><div className="hero-circle" /><div className="hero-animal hero-grizzly"><Character type={CHARACTER_TYPES[0]} priority /><span>実は、ほめられたい。</span></div><div className="hero-animal hero-rabbit"><Character type={CHARACTER_TYPES[1]} priority /></div><div className="hero-animal hero-capybara"><Character type={CHARACTER_TYPES[9]} priority /><span>私のペースで、いこう。</span></div><Sparkle className="art-spark" size={27} strokeWidth={1} /><span className="art-footnote">あなたの中にも、きっといる。</span></div>
  </section>
  <div className="intro-strip page-width"><p>むずかしい占いを、<strong>やさしい自分発見</strong>に。</p><span>四柱推命をヒントにした、10タイプの簡略診断</span><MoveDown size={20} aria-hidden="true" /></div>
  <section className="section page-width"><div className="section-heading"><div><p className="eyebrow">THE 10 PERSONALITIES</p><h2>どの子も、ちょっと私っぽい。</h2><p>名前を見て、思わずふふっと。あなたはどのタイプ？</p></div><Link className="text-link" href="/types/">10タイプをすべて見る <ArrowRight size={17} /></Link></div><div className="preview-grid">{[0,1,7,9].map(i => <TypeCard key={i} type={CHARACTER_TYPES[i]} index={i} />)}</div></section>
  <section className="how-section"><div className="page-width how-inner"><div><p className="eyebrow">A SMALL DISCOVERY</p><h2>知るだけで、<br />少しやさしくなれる。</h2><Link className="text-link" href="/about/">診断のことをもう少し <ArrowRight size={17} /></Link></div><ol className="steps"><li><span>01</span><div><h3>生年月日を、ひとつ。</h3><p>生まれた時間はわからなくても大丈夫。</p></div></li><li><span>02</span><div><h3>あなたらしいキャラクターに出会う。</h3><p>性格だけでなく、恋愛や仕事のヒントも。</p></div></li><li><span>03</span><div><h3>「私、これかも」をシェア。</h3><p>友だちと見比べると、新しい発見があるかも。</p></div></li></ol></div></section>
  <section className="closing page-width"><p className="eyebrow">HELLO, ANOTHER SIDE OF ME.</p><h2>自分のこと、もう少し好きになろう。</h2><Link className="button primary" href="/diagnose/">無料で診断する <ArrowRight size={18} /></Link><p className="micro">診断は自己理解を楽しむためのヒントです。</p></section></>;
}
