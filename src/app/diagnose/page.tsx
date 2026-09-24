import type { Metadata } from "next";
import Link from "next/link";
import { BirthForm } from "@/components/birth-form";
export const metadata: Metadata = { title: "無料診断" };
export default function DiagnosePage() {
  return <section className="form-page page-width"><p className="eyebrow">OPEN YOUR FILE</p><h1>あなたらしさに、<br className="mobile-only" />会いにいこう。</h1><p>まずは、生年月日を教えてください。<br />10のキャラクターから、あなたのタイプを見つけます。</p><div className="form-card"><span className="form-index">STELLA FILE / PERSONALITY CHECK</span><BirthForm /></div><p className="micro">入力できるのは1900年1月1日〜今日（日本時間）です。</p><p className="micro">日付は0:00区切り。<Link href="/about/">診断のルールについて</Link></p></section>;
}
