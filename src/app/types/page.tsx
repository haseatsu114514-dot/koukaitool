import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTER_TYPES } from "@/data/types";
import { TypeCard } from "@/components/type-card";
import { SectionHead } from "@/components/section-head";
export const metadata: Metadata = { title: "ステラタイプ一覧" };
export default function TypesPage() {
  return <section className="page-width catalog"><SectionHead as="h1" label="全10タイプ" title="ステラタイプ一覧" lead="それぞれの性格や強み、相性を紹介しています。" /><div className="catalog-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.stem} type={type} />)}</div><div className="catalog-cta"><p>自分のタイプを知りたい人はこちら</p><Link className="button primary" href="/#diagnose">生年月日から診断する <ArrowRight size={17} aria-hidden="true" /></Link></div></section>;
}
