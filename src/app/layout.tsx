import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { assetPath, siteUrl } from "@/lib/paths";
import { pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TabBar } from "@/components/tab-bar";
import { LogoMark } from "@/components/logo";
import { Analytics } from "@/components/analytics";
import "./globals.css";
/** Only the weights the stylesheet uses: mincho headings (700) and gothic body (400/700). */
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${SITE_NAME}｜${SITE_TAGLINE}`, template: `%s｜${SITE_NAME}` },
  ...pageMetadata({ description: "生年月日を入れるだけで、10のステラタイプからあなたのタイプを診断。性格・恋愛・仕事の傾向と、相性のいい相手がわかります。質問ゼロ・登録なし。", path: "/" }),
  icons: { icon: assetPath("/favicon.svg"), apple: assetPath("/icons/apple-touch-icon.png") },
  manifest: assetPath("/manifest.webmanifest"),
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};
/** App-ready viewport: edge-to-edge under the notch (safe areas handled in CSS), no zoom-on-focus jumps. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b1729", colorScheme: "dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" style={{ colorScheme: "dark" }} data-scroll-behavior="smooth"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />{/* Loaded at runtime (not via next/font) so builds never depend on downloading ~200 Japanese font subsets. Disclosed on the privacy page. */}<link rel="stylesheet" href={FONTS_URL} /></head><body><div className="sky" aria-hidden="true" /><a className="skip-link" href="#main">本文へスキップ</a>
    <header className="site-header"><Link className="brand" href="/" aria-label={`${SITE_NAME} トップ`}><LogoMark className="brand-mark" size={20} /><span>{SITE_NAME}</span></Link>
      <nav aria-label="メインナビゲーション"><Link href="/types/">ステラタイプ一覧</Link><Link className="nav-cta" href="/#diagnose">診断する</Link></nav>
    </header>
    <main id="main">{children}</main>
    <TabBar />
    <footer className="site-footer">
      <div className="footer-brand"><Link href="/"><LogoMark className="brand-mark" size={16} />{SITE_NAME}</Link><p>{SITE_TAGLINE}</p></div>
      <nav aria-label="フッター"><Link href="/">ホーム</Link><Link href="/types/">ステラタイプ一覧</Link><Link href="/privacy/">プライバシー</Link></nav>
      <p className="footer-note">占いをもとにした、自分を知るためのコンテンツです。<span>© Stella File</span></p>
    </footer>
    <Analytics />
  </body></html>;
}
