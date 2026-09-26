import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTER_TYPES, ELEMENT_COLORS, GROUP_NAMES } from "@/data/types";
import { Bx } from "@/components/bx";
import { TypeCard } from "@/components/type-card";
import { SectionHead } from "@/components/section-head";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata({ title: "ステラタイプ図鑑", description: "ほめ待ちグリズリー、ちゃっかりうさぎ、温泉カピバラなど、ステラファイルの10タイプを一覧で紹介。それぞれの性格や強み、恋愛・仕事の傾向、相性がわかります。", path: "/types/" });
export default function TypesPage() {
  return <section className="page-width catalog">
    <SectionHead as="h1" title="ステラタイプ図鑑" lead="全10タイプの性格や強み、相性を紹介しています。" />
    <aside className="element-legend" aria-label="カードの色について">
      <ul>{GROUP_NAMES.map((name, i) => <li key={name} style={{ "--el": ELEMENT_COLORS[i].color, "--tint": ELEMENT_COLORS[i].tint } as React.CSSProperties}><span className="element-orb" aria-hidden="true" />{name}</li>)}</ul>
      <p><Bx>10タイプは、枠の色で緑・赤・黄・白・青の5つのグループに分かれています。同じグループの2タイプは、兄弟のような関係です。</Bx></p>
    </aside>
    <div className="type-grid catalog-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.stem} type={type} />)}</div>
    <div className="cta-panel"><h2 className="cta-panel-title">あなたのタイプを調べる</h2><p className="cta-panel-text"><Bx>質問はありません。生年月日を入れるだけで、あなたのタイプとアイテムがわかります。</Bx></p><Link className="button primary" href="/#diagnose">生年月日から診断する <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}
