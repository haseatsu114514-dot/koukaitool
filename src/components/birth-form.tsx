"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { birthDateSchema, todayInJapan } from "@/lib/diagnosis/calendar";
import { diagnose, type DiagnosisResult } from "@/lib/diagnosis";
import { saveResult } from "@/lib/result-store";

/** Birth date → diagnosis. By default it saves the visitor's own result and opens it.
 * With onDiagnose (the friend check), the result is handed back instead: nothing is saved and the visitor's own result stays as it is. */
export function BirthForm({ onDiagnose, submitLabel = "診断する", idPrefix = "" }: { onDiagnose?: (result: DiagnosisResult) => void; submitLabel?: string; idPrefix?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = (name: string) => `${idPrefix}${name}`;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (["year", "month", "day"].some(key => !form.get(key))) { setError("生まれた年・月・日をすべて入力してください。"); return; }
    const result = birthDateSchema().safeParse({ year: Number(form.get("year")), month: Number(form.get("month")), day: Number(form.get("day")) });
    if (!result.success) { setError(result.error.issues[0]?.message || "生年月日を確認してください。"); return; }
    setError("");
    if (onDiagnose) { onDiagnose(diagnose(result.data)); return; }
    setBusy(true);
    saveResult(diagnose(result.data)); // Persist only derived result, never the birth date.
    router.push("/result/");
  }
  return <form className="birth-form" onSubmit={submit} noValidate><fieldset aria-describedby={error ? `${id("birth-error")} ${id("birth-help")}` : id("birth-help")}><legend className="visually-hidden">生年月日</legend><div className="date-fields"><label htmlFor={id("year")}>年<input id={id("year")} name="year" placeholder="例：1990" type="number" inputMode="numeric" autoComplete={onDiagnose ? "off" : "bday-year"} min="1900" max={todayInJapan().year} required aria-invalid={!!error} /></label><label htmlFor={id("month")}>月<select id={id("month")} name="month" defaultValue="" autoComplete={onDiagnose ? "off" : "bday-month"} required aria-invalid={!!error}><option value="" disabled>月</option>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1}月</option>)}</select></label><label htmlFor={id("day")}>日<select id={id("day")} name="day" defaultValue="" autoComplete={onDiagnose ? "off" : "bday-day"} required aria-invalid={!!error}><option value="" disabled>日</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}日</option>)}</select></label></div></fieldset><p id={id("birth-help")} className="micro">西暦で入力してください。</p><div aria-live="polite" id={id("birth-error")}>{error && <p className="form-error" role="alert">{error}</p>}</div><button type="submit" className="button primary full-width" disabled={busy}>{busy ? "診断しています…" : submitLabel}<ArrowRight size={18} /></button></form>;
}
