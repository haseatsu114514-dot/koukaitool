import type { Metadata } from "next";
import Link from "next/link";
import { Zen_Kaku_Gothic_New, Shippori_Mincho_B1 } from "next/font/google";
import { Sparkle } from "lucide-react";
import { assetPath } from "@/lib/paths";
import "./globals.css";
const sans = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false });
const serif = Shippori_Mincho_B1({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-serif", display: "swap", preload: false });
export const metadata: Metadata = {
  title: { default: "ステラファイル｜生年月日でわかる10タイプ性格診断", template: "%s｜ステラファイル" },
  description: "生年月日を入れるだけで、10タイプの動物キャラからあなたの性格タイプを診断。恋愛・仕事の傾向や、相性のいいタイプもわかります。",
  icons: { icon: assetPath("/favicon.svg") },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" className={`${sans.variable} ${serif.variable}`} style={{ colorScheme: "dark" }} data-scroll-behavior="smooth"><body><div className="sky" aria-hidden="true"><i className="stars stars-far" /><i className="stars stars-near" /><i className="shooting-star" /></div><a className="skip-link" href="#main">本文へスキップ</a>
    <header className="site-header"><Link className="brand" href="/" aria-label="ステラファイル トップ"><Sparkle className="brand-mark" size={22} fill="currentColor" /><span>ステラファイル</span></Link>
      <nav aria-label="メインナビゲーション"><Link className="nav-guide" href="/about/">診断について</Link><Link href="/types/">タイプ一覧</Link><Link className="nav-cta" href="/diagnose/">診断する</Link></nav>
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer"><Link className="footer-brand" href="/">ステラファイル</Link><div><Link href="/about/">診断について</Link><Link href="/privacy/">プライバシー</Link><span>© Stella File</span></div></footer>
  </body></html>;
}
