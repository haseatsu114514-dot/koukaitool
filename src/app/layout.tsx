import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Sparkle } from "lucide-react";
import { assetPath } from "@/lib/paths";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&family=Shippori+Mincho+B1:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap";
export const metadata: Metadata = {
  title: { default: "ステラファイル｜生年月日でわかる10のステラタイプ診断", template: "%s｜ステラファイル" },
  description: "生年月日を入れるだけで、10のステラタイプからあなたの性格タイプを診断。恋愛・仕事の傾向や、相性のいいタイプもわかります。",
  icons: { icon: assetPath("/favicon.svg"), apple: assetPath("/icons/apple-touch-icon.png") },
  manifest: assetPath("/manifest.webmanifest"),
  appleWebApp: { capable: true, title: "ステラファイル", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};
/** App-ready viewport: edge-to-edge under the notch (safe areas handled in CSS), no zoom-on-focus jumps. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b1729", colorScheme: "dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" style={{ colorScheme: "dark" }} data-scroll-behavior="smooth"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />{/* Loaded at runtime (not via next/font) so builds never depend on downloading ~200 Japanese font subsets. */}<link rel="stylesheet" href={FONTS_URL} /></head><body><div className="sky" aria-hidden="true"><i className="stars stars-far" /><i className="stars stars-near" /><i className="shooting-star" /></div><a className="skip-link" href="#main">本文へスキップ</a>
    <header className="site-header"><Link className="brand" href="/" aria-label="ステラファイル トップ"><Sparkle className="brand-mark" size={22} fill="currentColor" /><span>ステラファイル</span></Link>
      <nav aria-label="メインナビゲーション"><Link href="/types/">ステラタイプ一覧</Link><Link className="nav-cta" href="/#diagnose">診断する</Link></nav>
    </header>
    <main id="main">{children}</main>
    <TabBar />
    <footer className="site-footer"><Link className="footer-brand" href="/">ステラファイル</Link><div><Link href="/privacy/">プライバシー</Link><span>© Stella File</span></div></footer>
  </body></html>;
}
