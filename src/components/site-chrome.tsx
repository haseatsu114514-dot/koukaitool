import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TabBar } from "./tab-bar";
import { LogoMark } from "./logo";

/** The app's frame: header, bottom tab bar and footer around the page. Landing pages such as /love/ bring their own. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return <><div className="sky" aria-hidden="true" />
    <header className="site-header"><Link className="brand" href="/" aria-label={`${SITE_NAME} トップ`}><LogoMark className="brand-mark" size={20} /><span>{SITE_NAME}</span></Link>
      <nav aria-label="メインナビゲーション"><Link href="/types/">タイプ図鑑</Link><Link className="nav-cta" href="/#diagnose">診断する</Link></nav>
    </header>
    <main id="main">{children}</main>
    <TabBar />
    <footer className="site-footer">
      <div className="footer-brand"><Link href="/"><LogoMark className="brand-mark" size={16} />{SITE_NAME}</Link><p>{SITE_TAGLINE}</p></div>
      <nav aria-label="フッター"><Link href="/">ホーム</Link><Link href="/types/">タイプ図鑑</Link><Link href="/love/">恋愛運診断</Link><Link href="/privacy/">プライバシー</Link></nav>
      <p className="footer-note">占いをもとにした、自分を知るためのコンテンツです。<span>© ステラファイル</span></p>
    </footer>
  </>;
}
