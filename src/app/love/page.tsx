import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { LOVE_COPY } from "@/data/love-copy";
import { GOD_COPY, TEN_GODS } from "@/lib/diagnosis/ten-gods";
import { pageMetadata, SITE_NAME } from "@/lib/site";
import { Bx } from "@/components/bx";
import { Character } from "@/components/character";
import { ITEM_ICONS } from "@/components/item-icon";
import { LogoMark } from "@/components/logo";
import { LoveDiagnosis } from "@/components/love-diagnosis";
import "./love.css";

export const metadata: Metadata = pageMetadata({
  title: "恋愛運を引き寄せる診断",
  description: "恋愛運を引き寄せる人は、自分の「勝ち方」を知っている。占いの帝王・四柱推命をベースに、プロの占い師が監修。生年月日を入れるだけで、あなたのキャラ（本質）とアイテム（生まれ持ったギフト）から、魅力の引き出し方、恋の勝ちパターンと負けパターン、相性のいい相手がわかります。質問なし・約10秒・無料。",
  path: "/love/",
  image: "/og/love.jpg",
});
/** The page sits on cream paper under a night-blue header, so form controls render light. */
export const viewport: Viewport = { themeColor: "#10213b", colorScheme: "light" };

const WORRIES = ["がんばっているのに、なぜか恋が長続きしない", "「いい人」止まりで、恋愛対象として見られにくい", "好きな人の前だと、本当の自分を出せない", "自分に合う相手が、もうわからなくなってきた", "そろそろ本気で、恋愛運を引き寄せたい"];
const LEARN: [title: string, text: string][] = [
  ["あなたのキャラと恋の傾向", "10のキャラのうち、どれがあなたの本質か。あなたの恋の傾向まで、ズバリわかります。"],
  ["魅力の引き出し方", "自分では気づきにくい「選ばれる理由」と、それを相手に伝える見せ方。"],
  ["恋の勝ちパターン・負けパターン", "あなたがうまくいく恋の進め方と、ついやってしまう失敗。"],
  ["あなたのアイテムと、恋のヒント", "生まれ持ったギフトの生かし方と、今日からできること。相性のいいキャラも。"],
];
const REASONS: [title: string, text: string][] = [
  ["占いの帝王「四柱推命」がベース", "古くから「占いの帝王」と呼ばれる東洋の四柱推命をベースに、数々の占いや運命学、統計を組み合わせて作りました。"],
  ["プロの占い師が監修", "キャラの読み解きから一つひとつの文章まで、プロの占い師が監修しています。"],
  ["長い質問に答えなくていい", "よくある性格診断のように、何十問もの質問に答える必要はありません。生年月日を入れるだけ。気分や答え方で結果がぶれないから、素のあなたがそのまま出ます。"],
];
const FAQ: [question: string, answer: string][] = [
  ["生年月日だけで、本当にわかるのですか？", "ステラファイルは、占いの帝王と呼ばれる四柱推命をベースに、数々の占いや運命学、統計を組み合わせ、プロの占い師の監修のもとで作った診断です。質問に答える診断と違って、その日の気分や答え方で結果が変わることはありません。"],
  ["生まれた時間がわからなくても大丈夫？", "大丈夫です。この診断は生まれた日だけを使い、時刻は使いません。"],
  ["生年月日はどこかに送られますか？", "いいえ。入力した生年月日はお使いのブラウザの中だけで計算に使い、サーバーへの送信や保存はしません。"],
  ["無料ですか？ 登録は必要ですか？", "無料で、会員登録もいりません。公式LINEの友だち追加は、もっと詳しく知りたい方だけで大丈夫です。"],
  ["公式LINEでは、何が届きますか？", "友だち追加のあと、3分ほどの質問（今の状況や悩み、理想など）に答えていただくと、その内容と生年月日をもとに、あなた一人のための鑑定をお届けします。"],
];

/** Section heading: a small gold English label, the mincho title, an optional lead. */
function Head({ id, en, title, lead }: { id: string; en: string; title: string; lead?: string }) {
  return <header className="lv-head"><span className="lv-head-en" aria-hidden="true">{en}</span><h2 id={id}><Bx>{title}</Bx></h2>{lead && <p><Bx>{lead}</Bx></p>}</header>;
}

/** Landing page for women in their 30s and 40s: 恋愛運 is the hook, and the result shows how she wins in love.
 * The page has no way out but the official LINE (and the privacy page): no links to the app, no sharing, no friend check.
 * Everything here leads to the birth date form at the top, which opens the result on this same page; the result ends at the official LINE.
 * On this page the type is called キャラ (her essence) and the item is her gift (strengths and individuality). */
export default function LovePage() {
  const hero = <>
    <div className="lv-faces" aria-hidden="true">{CHARACTER_TYPES.map(type => <span key={type.slug} className="lv-face" style={elementStyle(type.stem)}><Character type={type} priority /></span>)}</div>
    <p className="lv-kicker">生年月日でわかる 恋愛運診断</p>
    <h1 className="lv-title"><span className="lv-title-line">恋愛運を引き寄せる人は、</span><span className="lv-title-line">自分の<em>「勝ち方」</em>を</span><span className="lv-title-line">知っている。</span></h1>
    <p className="lv-lead"><Bx>あなたの魅力の引き出し方と、恋の勝ちパターン。生年月日を入れるだけで、10秒でわかります。</Bx></p>
    <ul className="lv-meta"><li>プロ占い師監修</li><li>四柱推命ベース</li><li>質問なし・無料</li></ul>
  </>;
  const intro = <>
    <section className="lv-section" aria-labelledby="lv-worry-title">
      <div className="lv-wrap">
        <Head id="lv-worry-title" en="YOUR LOVE" title="その恋、戦い方を間違えていませんか？" />
        <div className="lv-prose">
          <p><Bx>がんばっているのに、報われない恋。恋愛の本やSNSのテクニックを試しても、しっくりこない。それは魅力が足りないからではなく、あなたに合わない戦い方をしているだけかもしれません。</Bx></p>
          <p><Bx>追いかけて輝く人もいれば、待って選ばれる人もいる。尽くして愛される人もいれば、自分を貫いて愛される人もいる。自分の勝ち方を知った人から、恋愛運は動き出します。</Bx></p>
        </div>
        <ul className="lv-checks" aria-label="こんな人におすすめ">{WORRIES.map(text => <li key={text}><Check size={18} strokeWidth={2.6} aria-hidden="true" /><Bx>{text}</Bx></li>)}</ul>
        <p className="lv-checks-note"><Bx>ひとつでも当てはまったら、いまの恋に合う「勝ち方」を知るタイミングです。</Bx></p>
      </div>
    </section>
    <section className="lv-section is-white" aria-labelledby="lv-learn-title">
      <div className="lv-wrap">
        <Head id="lv-learn-title" en="WHAT YOU GET" title="この診断でわかること" />
        <ol className="lv-learn">{LEARN.map(([title, text], i) => <li key={title}><span className="lv-learn-no">{String(i + 1).padStart(2, "0")}</span><div><h3><Bx>{title}</Bx></h3><p><Bx>{text}</Bx></p></div></li>)}</ol>
        <p className="lv-learn-more"><Lock size={16} aria-hidden="true" /><Bx>さらに公式LINEでは、あなたの今の状況や悩みをうかがって、あなた一人のための鑑定をお届けします。</Bx></p>
      </div>
    </section>
    <section className="lv-section" aria-labelledby="lv-chara-title">
      <div className="lv-wrap-wide">
        <Head id="lv-chara-title" en="CHARACTER × ITEM" title="キャラとアイテムで、あなたがわかる" />
        <div className="lv-pair">
          <div className="lv-pair-card"><p className="lv-pair-label"><b>キャラ</b>＝あなたの本質</p><p><Bx>生まれた日で決まる、10のキャラ。性格の根っこと、恋の進め方がわかります。</Bx></p></div>
          <span className="lv-pair-x" aria-hidden="true">×</span>
          <div className="lv-pair-card"><p className="lv-pair-label"><b>アイテム</b>＝生まれ持ったギフト</p><p><Bx>生まれた月でわかる、あなたの強みや個性。恋の武器になる、もうひとつの持ち味です。</Bx></p><ul className="lv-item-icons" aria-label={`10種類のアイテム：${TEN_GODS.map(god => GOD_COPY[god].item).join("、")}`}>{TEN_GODS.map(god => { const Icon = ITEM_ICONS[god]; return <li key={god} title={GOD_COPY[god].item}><Icon size={16} strokeWidth={1.8} aria-hidden="true" /></li>; })}</ul></div>
        </div>
        <h3 className="lv-strip-title">10のキャラ<span className="lv-strip-hint" aria-hidden="true">横にスクロールできます</span></h3>
        <ul className="lv-types">{CHARACTER_TYPES.map(type => <li key={type.slug} className="lv-type" style={elementStyle(type.stem)}><span className="lv-type-art"><Character type={type} /></span><h4><Bx>{type.displayName}</Bx></h4><p><Bx>{LOVE_COPY[type.slug].catch}</Bx></p></li>)}</ul>
      </div>
    </section>
    <section className="lv-section is-white" aria-labelledby="lv-why-title">
      <div className="lv-wrap">
        <Head id="lv-why-title" en="WHY STELLA FILE" title="ステラファイルが当たる理由" />
        <ol className="lv-reasons">{REASONS.map(([title, text], i) => <li key={title}><span className="lv-reason-no">{`理由 ${i + 1}`}</span><h3><Bx>{title}</Bx></h3><p><Bx>{text}</Bx></p></li>)}</ol>
        <div className="lv-statement">
          <p className="lv-statement-lead"><Bx>自分を知り、魅力を引き出して、恋愛運を引き寄せる。</Bx></p>
          <p><Bx>ステラファイルは、そのために生まれたまったく新しい分類学です。</Bx></p>
        </div>
      </div>
    </section>
    <section className="lv-section" aria-labelledby="lv-faq-title">
      <div className="lv-wrap">
        <Head id="lv-faq-title" en="FAQ" title="よくある質問" />
        <div className="lv-faq">{FAQ.map(([question, answer]) => <details key={question}><summary><Bx>{question}</Bx></summary><p><Bx>{answer}</Bx></p></details>)}</div>
      </div>
    </section>
    <section id="lv-final" className="lv-final lv-dark" aria-labelledby="lv-final-title">
      <div className="lv-wrap">
        <h2 id="lv-final-title" className="lv-final-title"><Bx>自分の勝ち方を知れば、恋はもっとラクになる。</Bx></h2>
        <p className="lv-final-text"><Bx>生年月日を入れるだけ。あなたの恋愛運を引き寄せるヒントが、10秒でわかります。</Bx></p>
        <a className="lv-cta" href="#diagnose">無料で恋愛運を診断する</a>
      </div>
    </section>
  </>;
  return <div className="love">
    <header className="lv-header lv-dark"><div className="lv-wrap-wide lv-header-inner"><span className="lv-brand"><LogoMark size={18} /><span>{SITE_NAME}</span></span><span className="lv-tag">恋愛運診断</span></div></header>
    <main id="main"><LoveDiagnosis hero={hero} intro={intro} /></main>
    <footer className="lv-footer">
      <div className="lv-wrap">
        <span className="lv-brand"><LogoMark size={16} /><span>{SITE_NAME}</span></span>
        <nav aria-label="フッター"><Link href="/privacy/">プライバシー</Link></nav>
        <p className="micro">占いをもとにした、自分を知るためのコンテンツです。© ステラファイル</p>
      </div>
    </footer>
  </div>;
}
