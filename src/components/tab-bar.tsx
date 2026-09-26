"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, House, LayoutGrid } from "lucide-react";
import { RESULT_KEY } from "@/lib/result-key";

const TABS = [
  { href: "/", label: "ホーム", icon: House, match: (p: string) => p === "/" },
  { href: "/types/", label: "タイプ", icon: LayoutGrid, match: (p: string) => p.startsWith("/types") },
  { href: "/result/", label: "結果", icon: BookOpen, match: (p: string) => p.startsWith("/result") },
];

/** App-style bottom navigation shown on phones (the header nav is hidden there). The result tab is dimmed until this tab holds a result. */
export function TabBar() {
  const pathname = usePathname();
  const [hasResult, setHasResult] = useState(true);
  useEffect(() => { try { setHasResult(sessionStorage.getItem(RESULT_KEY) !== null); } catch { setHasResult(true); } }, [pathname]);
  return <nav className="tab-bar" aria-label="アプリメニュー">
    {TABS.map(({ href, label, icon: Icon, match }) => {
      const active = match(pathname), empty = href === "/result/" && !hasResult && !active;
      return <Link key={href} href={href} className={[active && "is-active", empty && "is-empty"].filter(Boolean).join(" ") || undefined} aria-current={active ? "page" : undefined}><Icon size={22} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" /><span>{label}</span></Link>;
    })}
  </nav>;
}
