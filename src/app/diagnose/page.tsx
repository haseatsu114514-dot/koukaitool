import type { Metadata } from "next";
import Link from "next/link";
import { BirthForm } from "@/components/birth-form";
export const metadata: Metadata = { title: "無料診断" };
export default function DiagnosePage() {
  return <section className="form-page page-width"><h1>生年月日を入力</h1><p>入力した生年月日はどこにも送信されません。</p><div className="form-card"><BirthForm /></div><p className="micro">1900年1月1日から今日までの日付に対応しています。<Link href="/about/">診断のしくみ</Link></p></section>;
}
