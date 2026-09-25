import type { Metadata } from "next";
import Link from "next/link";
import { CHARACTER_TYPES } from "@/data/types";
import { TypeCard } from "@/components/type-card";
export const metadata: Metadata = { title: "タイプ一覧" };
export default function TypesPage() {
  return <section className="page-width catalog"><h1>タイプ一覧</h1><p className="page-intro">全10タイプの性格や強み、相性を紹介しています。</p><div className="catalog-grid">{CHARACTER_TYPES.map(type => <TypeCard key={type.stem} type={type} />)}</div><div className="catalog-cta"><p>自分のタイプを知りたい人はこちら</p><Link className="button primary" href="/diagnose/">生年月日から診断する →</Link></div></section>;
}
