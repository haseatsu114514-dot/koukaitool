import type { Metadata } from "next";
import Link from "next/link";
import { BirthForm } from "@/components/birth-form";
export const metadata: Metadata = { title: "無料診断" };
export default function DiagnosePage() {
  return <section className="form-page page-width"><p className="eyebrow">OPEN YOUR FILE</p><h1>生年月日を入力してください</h1><p>10タイプのうち、あなたがどのタイプかを診断します。</p><div className="form-card"><span className="form-index">STELLA FILE / PERSONALITY CHECK</span><BirthForm /></div><p className="micro">1900年1月1日〜今日の日付を入力できます。<Link href="/about/">診断のしくみ</Link></p></section>;
}
