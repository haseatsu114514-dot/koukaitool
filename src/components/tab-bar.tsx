"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, LayoutGrid, Sparkles } from "lucide-react";

const TABS = [
  { href: "/", label: "ホーム", icon: House, match: (p: string) => p === "/" },
  { href: "/#diagnose", label: "診断", icon: Sparkles, match: () => false },
  { href: "/types/", label: "タイプ", icon: LayoutGrid, match: (p: string) => p.startsWith("/types") },
  { href: "/result/", label: "結果", icon: BookOpen, match: (p: string) => p.startsWith("/result") },
];

/** App-style bottom navigation shown on phones (the header nav is hidden there). */
export function TabBar() {
  const pathname = usePathname();
  return <nav className="tab-bar" aria-label="アプリメニュー">
    {TABS.map(({ href, label, icon: Icon, match }) => {
      const active = match(pathname);
      return <Link key={label} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}><Icon size={22} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" /><span>{label}</span></Link>;
    })}
  </nav>;
}
