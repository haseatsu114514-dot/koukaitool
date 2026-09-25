import type { Metadata } from "next";
import Link from "next/link";
import { BirthForm } from "@/components/birth-form";
import { SectionHead } from "@/components/section-head";
export const metadata: Metadata = { title: "無料診断" };
export default function DiagnosePage() {
  return <section className="form-page page-width"><SectionHead as="h1" label="無料診断" title="生年月日を入力" lead="入力した生年月日は、どこにも送信されません。" /><div className="form-card"><BirthForm /></div><p className="micro">1900年1月1日から今日までの日付に対応しています。<Link href="/about/">診断のしくみ</Link></p></section>;
}
