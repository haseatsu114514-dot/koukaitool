import Link from "next/link";
export default function NotFound() { return <section className="empty-state"><h1>ページが見つかりません</h1><p>リンクが変わったか、ページが削除された可能性があります。</p><Link className="button primary" href="/">トップへ戻る →</Link></section>; }
