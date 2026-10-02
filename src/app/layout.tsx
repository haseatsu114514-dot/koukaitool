import type { Metadata, Viewport } from "next";
import { assetPath, siteUrl } from "@/lib/paths";
import { pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { Analytics } from "@/components/analytics";
import "./globals.css";
/** Only the weights the stylesheet uses: mincho headings (700) and gothic body (400/700). */
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap";
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
/** The document shell only. The app frame (header, tab bar, footer) lives in (site)/layout.tsx; landing pages such as /love/ bring their own. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />{/* Loaded at runtime (not via next/font) so builds never depend on downloading ~200 Japanese font subsets. Disclosed on the privacy page. */}<link rel="stylesheet" href={FONTS_URL} /></head><body><a className="skip-link" href="#main">本文へスキップ</a>
    {children}
    <Analytics />
  </body></html>;
}
