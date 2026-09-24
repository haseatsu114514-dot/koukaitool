import Link from "next/link";
export default function NotFound() { return <section className="empty-state"><p className="eyebrow">FILE NOT FOUND</p><h1>このファイルは、見つかりませんでした。</h1><p>リンクが変わったか、存在しないページのようです。</p><Link className="button primary" href="/">トップへ戻る →</Link></section>; }
