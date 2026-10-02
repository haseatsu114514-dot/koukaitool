"use client";
import { useEffect, useRef, useState } from "react";
import type { DiagnosisResult } from "@/lib/diagnosis";
import { typeByStem } from "@/data/types";
import { track } from "@/lib/analytics";
import { BirthForm } from "./birth-form";
import { Phrases } from "./phrases";
import { BookReveal } from "./book-reveal";
import { LoveResult } from "./love-result";

/** Blocks marked .lv-reveal / .lv-stagger rise in once as they scroll into view. Only blocks still below the first screen are held back,
 * so nothing a visitor can already see disappears, and with reduced motion nothing is held back at all. Re-run when the view switches. */
function useReveal(view: unknown) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const waiting = [...document.querySelectorAll<HTMLElement>(".love .lv-reveal, .love .lv-stagger")].filter(node => node.getBoundingClientRect().top > innerHeight * 0.9);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.remove("is-waiting"); observer.unobserve(entry.target); }
    }, { threshold: 0.12 });
    for (const node of waiting) { node.classList.add("is-waiting"); observer.observe(node); }
    return () => { observer.disconnect(); waiting.forEach(node => node.classList.remove("is-waiting")); };
  }, [view]);
}

/** The love page's two states on one URL: the introduction with the birth date form, then the result.
 * Nothing is saved: the birth date and the result live only in this component, so a reload starts over. */
export function LoveDiagnosis({ hero, intro }: { hero: React.ReactNode; intro: React.ReactNode }) {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [reveal, setReveal] = useState(false);
  const [formGone, setFormGone] = useState(false), [finalIn, setFinalIn] = useState(false);
  const retried = useRef(false);
  // A small bar leads back to the form once it scrolls away, and steps aside at the closing call, which has its own button.
  useEffect(() => {
    const form = document.getElementById("diagnose"), final = document.getElementById("lv-final");
    if (result || !form || !final) return;
    const formObserver = new IntersectionObserver(([entry]) => setFormGone(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    const finalObserver = new IntersectionObserver(([entry]) => setFinalIn(entry.isIntersecting));
    formObserver.observe(form); finalObserver.observe(final);
    return () => { formObserver.disconnect(); finalObserver.disconnect(); setFormGone(false); };
  }, [result]);
  useEffect(() => {
    if (result) window.scrollTo({ top: 0, behavior: "instant" });
    // Back from the result: return to the form, ready for another date.
    else if (retried.current) { document.getElementById("diagnose")?.scrollIntoView({ behavior: "instant", block: "center" }); document.getElementById("love-year")?.focus({ preventScroll: true }); }
  }, [result]);
  useReveal(result);
  function show(next: DiagnosisResult) {
    track({ name: "diagnosis_complete", stella_type: typeByStem(next.pillar.stem).slug });
    setReveal(!matchMedia("(prefers-reduced-motion: reduce)").matches);
    setResult(next);
  }
  if (result) return <>
    {reveal && <BookReveal type={typeByStem(result.pillar.stem)} onDone={() => setReveal(false)} />}
    <LoveResult result={result} onRetry={() => { retried.current = true; setResult(null); }} />
  </>;
  return <>
    <section className="lv-hero lv-dark lv-sky">
      <div className="lv-wrap">
        {hero}
        <div id="diagnose" className="lv-form-card">
          <h2 className="lv-form-title">生年月日を入れて、診断スタート</h2>
          <BirthForm idPrefix="love-" submitLabel="恋愛運を診断する" onDiagnose={show} autoFill />
          <p className="micro lv-form-note">生年月日は、どこにも送信・保存されません。</p>
        </div>
      </div>
    </section>
    {intro}
    <div className={`lv-bar${formGone && !finalIn ? " is-shown" : ""}`} inert={!formGone || finalIn}>
      <div className="lv-bar-inner"><p><Phrases>生年月日を入れるだけ。約10秒・無料</Phrases></p><a className="lv-cta" href="#diagnose">無料で診断する</a></div>
    </div>
  </>;
}
