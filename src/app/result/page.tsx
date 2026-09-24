import type { Metadata } from "next";
import { ResultView } from "@/components/result-view";
export const metadata: Metadata = { title: "あなたの診断結果", robots: { index: false, follow: true } };
export default function ResultPage() { return <ResultView />; }
