import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "診断について" };
export default function AboutPage() {
  return <article className="prose page-width"><p className="eyebrow">ABOUT STELLA FILE</p><h1>診断について</h1><p>ステラファイルは、生年月日から性格タイプがわかる無料の診断です。中国に古くから伝わる生年月日の占いをもとに、10のキャラクターにまとめました。占いの知識がなくても楽しめます。</p><h2>タイプの決め方</h2><p>生まれた「日」をもとに、10タイプのどれかに分けます。同じ日に生まれた人は、同じタイプになります。</p><h2>「もうひとつの強み」について</h2><p>結果ページでは、タイプとは別の角度から、もうひとつの長所も紹介しています。これも生まれた日から出していて、タイプ名には影響しません。</p><h2>知っておいてほしいこと</h2><ul><li>生まれた日だけで判断する、かんたん版の診断です。生まれた年・月・時間は使いません。</li><li>日付は夜0時で切り替わるものとして計算しています。夜11時台に生まれた方は、ほかの占いと結果が違うことがあります。</li><li>1900年1月1日から今日までの日付に対応しています。</li></ul><h2>結果の受け取り方</h2><p>科学的な性格検査や、未来の予言ではありません。当てはまるところだけ、参考にしてください。</p><section id="next"><h2>もっと楽しむには</h2><p>結果の「強み」を読んで、最近それが活きた場面を思い出してみてください。</p><p>生まれた時間まで使うくわしい診断や、結果の保存機能は、今後追加を検討しています。</p></section><Link className="button primary" href="/diagnose/">私のタイプを見つける →</Link></article>;
}
