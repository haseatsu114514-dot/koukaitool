import { LINE_FRIEND_URL } from "@/lib/site";
import { Bx } from "./bx";

/** After a diagnosis only, below the explanation: invites the visitor to the official LINE account for more detail.
 * Renders nothing until NEXT_PUBLIC_LINE_URL is set. A plain text button in LINE green (no LINE logo, which has its own usage rules). */
export function LineCta() {
  if (!LINE_FRIEND_URL) return null;
  return <section className="line-panel" aria-labelledby="line-title">
    <h2 id="line-title" className="line-heading">もっと詳しく知りたい方へ</h2>
    <p className="line-text"><Bx>ステラファイル公式LINEを友だち追加すると、あなたのタイプについて、さらに詳しい内容を受け取れます。</Bx></p>
    <a className="button line-button" href={LINE_FRIEND_URL} target="_blank" rel="noopener noreferrer">LINEで友だち追加</a>
    <p className="micro">LINEが開きます。入力した生年月日がLINEに送られることはありません。</p>
  </section>;
}
