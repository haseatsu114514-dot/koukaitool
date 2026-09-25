import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTER_TYPES } from "@/data/types";
import { TypeCard } from "@/components/type-card";
export const metadata: Metadata = { title: "10タイプ図鑑" };
export default function TypesPage() {
  return <section className="page-width catalog"><p className="eyebrow">THE STELLA COLLECTION</p><h1>10タイプ図鑑</h1><p className="page-intro">それぞれのタイプの性格や強みを紹介しています。</p><div className="catalog-grid">{CHARACTER_TYPES.map((type,i) => <TypeCard key={type.stem} type={type} index={i} />)}</div><div className="catalog-cta"><p>あなたは、どのタイプ？</p><Link className="button primary" href="/diagnose/">生年月日から診断する →</Link></div></section>;
}
