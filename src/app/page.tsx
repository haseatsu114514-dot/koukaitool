import Link from "next/link";
import { ArrowRight, BatteryCharging, BriefcaseBusiness, Gem, Heart, HeartHandshake, MessageCircleHeart, Sparkles, Swords, Users } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { Bx } from "@/components/bx";
import { Character } from "@/components/character";
import { SectionHead } from "@/components/section-head";
import { TypeCard } from "@/components/type-card";
import { BirthForm } from "@/components/birth-form";

/** Everything one birthday unlocks, in the order the result page shows it. */
const FEATURES = [
  { icon: Sparkles, title: "あなたのステラタイプ", text: "10タイプの中から、あなたの性格を表すキャラクターが決まります。" },
  { icon: MessageCircleHeart, title: "あるある", text: "「わかる！」と言いたくなる、タイプ別の「あるある」を5つ。" },
  { icon: Swords, title: "強みと苦手なこと", text: "自分の武器と、ちょっと気をつけたいところ。" },
  { icon: Gem, title: "あなたのアイテム", text: "同じタイプでも生まれた日で変わる、もうひとつの長所。" },
  { icon: Heart, title: "恋愛の傾向", text: "好きになる人のタイプや、長続きのコツ。" },
  { icon: BriefcaseBusiness, title: "仕事の傾向", text: "力を発揮できる場面と、向いている仕事。" },
  { icon: Users, title: "人との付き合い方", text: "友だちや職場での、あなたらしい距離感。" },
  { icon: BatteryCharging, title: "ストレスと対策", text: "疲れたときに出るサインと、回復のしかた。" },
  { icon: HeartHandshake, title: "相性", text: "最高の相性から天敵まで、5段階でわかります。" },
];

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
    <section className="section page-width features reveal">
      <SectionHead num="01" label="診断でわかること" title={<>生年月日だけで、<wbr /><span className="chunk">こんなにわかる！</span></>} lead={<Bx>入力するのは生まれた年・月・日の3つだけ。結果ページでは、9つの項目であなたを読み解きます。</Bx>} />
      <div className="feature-stats"><p><strong>10</strong><span>タイプ</span></p><p><strong>10</strong><span>アイテム</span></p><p><strong>100</strong><span>通りの組み合わせ</span></p><p><strong>5</strong><span>段階の相性</span></p></div>
      <ol className="feature-grid">{FEATURES.map(({ icon: Icon, title, text }, i) => <li key={title}><span className="feature-no">{String(i + 1).padStart(2, "0")}</span><span className="feature-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><h3><Bx>{title}</Bx></h3><p><Bx>{text}</Bx></p></li>)}</ol>
      <div className="features-cta"><Link className="button primary" href="#diagnose">生年月日を入力する <ArrowRight size={18} /></Link></div>
    </section>
    <section className="section page-width reveal"><div className="section-heading"><SectionHead num="02" label="ステラタイプ紹介" title="10のステラタイプ" lead={<Bx>ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラ……あなたはどれ？</Bx>} /><Link className="text-link" href="/types/">すべて見る <ArrowRight size={17} /></Link></div><div className="preview-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.slug} type={type} />)}</div></section>
    <section className="closing page-width reveal"><SectionHead num="03" label="さあ、はじめよう" title="さっそく診断してみる" /><Link className="button primary" href="#diagnose">生年月日を入力する <ArrowRight size={18} /></Link></section>
  </>;
}
