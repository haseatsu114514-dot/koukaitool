import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTER_TYPES, ELEMENT_COLORS, ELEMENT_NAMES } from "@/data/types";
import { Bx } from "@/components/bx";
import { TypeCard } from "@/components/type-card";
import { SectionHead } from "@/components/section-head";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata({ title: "ステラタイプ一覧", description: "ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラなど、ステラファイルの10タイプを一覧で紹介。それぞれの性格や強み、恋愛・仕事の傾向、相性がわかります。", path: "/types/" });
export default function TypesPage() {
  return <section className="page-width catalog">
    <SectionHead as="h1" label="全10タイプ" title="ステラタイプ一覧" lead="それぞれの性格や強み、相性を紹介しています。" />
    <aside className="element-legend" aria-label="カードの色について">
      <ul>{ELEMENT_NAMES.map((name, i) => <li key={name} style={{ "--el": ELEMENT_COLORS[i].color, "--tint": ELEMENT_COLORS[i].tint } as React.CSSProperties}><span className="element-orb" aria-hidden="true" />{name}</li>)}</ul>
      <p><Bx>枠の色は、それぞれのタイプの元になった5つのエレメント（木・火・土・金・水）。同じ色の2タイプは、同じエレメントから生まれた兄弟のような関係です。</Bx></p>
    </aside>
    <div className="type-grid catalog-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.stem} type={type} />)}</div>
    <div className="cta-panel frame"><p className="cta-panel-kicker">YOUR TYPE</p><h2 className="cta-panel-title"><span className="chunk">あなたは、</span><span className="chunk">どのタイプ？</span></h2><p className="cta-panel-text"><Bx>質問はありません。生年月日を入れるだけで、あなたのタイプとアイテムがわかります。</Bx></p><Link className="button primary" href="/#diagnose">生年月日から診断する <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}
