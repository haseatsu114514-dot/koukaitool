import { LINE_FRIEND_URL } from "@/lib/site";
import { Bx } from "./bx";

/** After a diagnosis only: invites the visitor to the official LINE account for more detail. Renders nothing until NEXT_PUBLIC_LINE_URL is set.
 * A plain text button in LINE green (no LINE logo, which has its own usage rules). */
export function LineCta({ variant }: { variant: "bar" | "panel" }) {
  if (!LINE_FRIEND_URL) return null;
  const button = <a className="button line-button" href={LINE_FRIEND_URL} target="_blank" rel="noopener noreferrer">LINEで友だち追加</a>;
  if (variant === "bar") return <aside className="line-cta line-bar" aria-label="公式LINEのご案内">
    <div><p className="line-title">さらに詳しく見たい方へ</p><p className="line-text"><Bx>公式LINEで、あなたのタイプをもっと詳しくお届けします。</Bx></p></div>
    {button}
  </aside>;
  return <section className="line-cta line-panel" aria-labelledby="line-title">
    <h2 id="line-title" className="line-heading">もっと詳しく知りたい方へ</h2>
    <p className="line-text"><Bx>ステラファイル公式LINEを友だち追加すると、あなたのタイプについて、さらに詳しい内容を受け取れます。</Bx></p>
    {button}
    <p className="micro">LINEが開きます。入力した生年月日がLINEに送られることはありません。</p>
  </section>;
}
