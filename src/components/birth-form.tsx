"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { birthDateSchema, todayInJapan } from "@/lib/diagnosis/calendar";
import { diagnose } from "@/lib/diagnosis";
import { saveResult } from "@/lib/result-store";
export function BirthForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (["year", "month", "day"].some(key => !form.get(key))) { setError("生まれた年・月・日をすべて入力してください。"); return; }
    const result = birthDateSchema().safeParse({ year: Number(form.get("year")), month: Number(form.get("month")), day: Number(form.get("day")) });
    if (!result.success) { setError(result.error.issues[0]?.message || "生年月日を確認してください。"); return; }
    setBusy(true); setError("");
    saveResult(diagnose(result.data)); // Persist only derived result, never the birth date.
    router.push("/result/");
  }
  return <form className="birth-form" onSubmit={submit} noValidate><fieldset aria-describedby={error ? "birth-error birth-help" : "birth-help"}><legend className="visually-hidden">生年月日</legend><div className="date-fields"><label htmlFor="year">年<input id="year" name="year" placeholder="例：1990" type="number" inputMode="numeric" autoComplete="bday-year" min="1900" max={todayInJapan().year} required aria-invalid={!!error} /></label><label htmlFor="month">月<select id="month" name="month" defaultValue="" autoComplete="bday-month" required aria-invalid={!!error}><option value="" disabled>月</option>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1}月</option>)}</select></label><label htmlFor="day">日<select id="day" name="day" defaultValue="" autoComplete="bday-day" required aria-invalid={!!error}><option value="" disabled>日</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}日</option>)}</select></label></div></fieldset><p id="birth-help" className="micro">西暦で入力してください。</p><div aria-live="polite" id="birth-error">{error && <p className="form-error" role="alert">{error}</p>}</div><button type="submit" className="button primary full-width" disabled={busy}>{busy ? "診断しています…" : "診断する"}<ArrowRight size={18} /></button></form>;
}
