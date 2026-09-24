"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readResult } from "@/lib/result-store";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { typeByStem } from "@/data/types";
import { Profile } from "./profile";
export function ResultView() {
  const [result, setResult] = useState<DiagnosisResult | null>(null); const [loaded, setLoaded] = useState(false);
  useEffect(() => { setResult(readResult()); setLoaded(true); }, []);
  if (!loaded) return <div className="empty-state" role="status">あなたのファイルを開いています…</div>;
  if (!result) return <section className="empty-state"><p className="eyebrow">YOUR FILE IS WAITING</p><h1>まずは、あなたのタイプを見つけよう。</h1><p>このタブには、まだ診断結果がありません。<br />生年月日から、いつでも無料で診断できます。</p><Link className="button primary" href="/diagnose/">診断をはじめる →</Link></section>;
  return <Profile type={typeByStem(result.pillar.stem)} result={result} />;
}
