"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { clearResult } from "@/lib/result-store";

/** Removes the saved result from this browser (the birth date was never saved) and returns to the start. */
export function ClearResultButton() {
  const router = useRouter();
  function clear() {
    if (!window.confirm("この端末に保存した診断結果を消しますか？")) return;
    clearResult();
    router.push("/");
  }
  return <button type="button" className="text-link clear-result" onClick={clear}><Trash2 size={15} aria-hidden="true" />この結果を消す</button>;
}
