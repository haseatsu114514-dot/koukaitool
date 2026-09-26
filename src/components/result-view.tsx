"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearRevealPending, isRevealPending, readResult } from "@/lib/result-store";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { typeByStem } from "@/data/types";
import { BookReveal } from "./book-reveal";
import { Profile } from "./profile";
export function ResultView() {
  const [result, setResult] = useState<DiagnosisResult | null>(null); const [loaded, setLoaded] = useState(false); const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setResult(readResult()); setLoaded(true);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) clearRevealPending();
    setReveal(isRevealPending());
  }, []);
  if (!loaded) return <div className="empty-state" role="status">結果を読み込んでいます…</div>;
  if (!result) return <section className="empty-state"><h1>まだ診断結果がありません</h1><p>生年月日を入力すると、あなたのタイプがわかります。</p><Link className="button primary" href="/#diagnose">診断をはじめる <ArrowRight size={17} aria-hidden="true" /></Link></section>;
  const type = typeByStem(result.pillar.stem);
  return <>{reveal && <BookReveal type={type} onDone={() => { clearRevealPending(); setReveal(false); }} />}<Profile type={type} result={result} /></>;
}
