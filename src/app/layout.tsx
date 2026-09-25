import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, ArrowUpRight } from "lucide-react";
import { assetPath } from "@/lib/paths";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "ステラファイル｜私らしさに、ひとつ気づく。", template: "%s｜ステラファイル" },
  description: "生年月日を入れるだけで、10タイプのキャラクターからあなたの性格と強みがわかる無料診断。",
  icons: { icon: assetPath("/favicon.svg") },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" style={{ colorScheme: "dark" }} data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">本文へスキップ</a>
    <header className="site-header"><Link className="brand" href="/" aria-label="ステラファイル トップ"><Sparkle className="brand-mark" size={28} fill="currentColor" /><span>ステラファイル<small>STELLA FILE</small></span></Link>
      <nav aria-label="メインナビゲーション"><Link className="nav-guide" href="/about/">ステラファイルとは</Link><Link href="/types/">10タイプ図鑑</Link><Link className="nav-cta" href="/diagnose/">無料で診断 <ArrowUpRight size={15} aria-hidden="true" /></Link></nav>
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer"><Link className="footer-brand" href="/">ステラファイル <span>STELLA FILE</span></Link><p>自分のいいところを見つけるための診断です。</p><div><Link href="/about/">診断について</Link><Link href="/privacy/">プライバシー</Link><span>© STELLA FILE</span></div></footer>
  </body></html>;
}
