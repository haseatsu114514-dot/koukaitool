import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Check, Clock, Compass, Crown, Feather, Fingerprint, Gem, Gift, type LucideIcon } from "lucide-react";
import { CHARACTER_TYPES, elementStyle } from "@/data/types";
import { LOVE_COPY } from "@/data/love-copy";
import { pageMetadata, SITE_NAME } from "@/lib/site";
import { Phrases } from "@/components/phrases";
import { Character } from "@/components/character";
import { LogoMark } from "@/components/logo";
import { LoveDiagnosis } from "@/components/love-diagnosis";
import { TypeStrip } from "@/components/love-type-strip";
import { TypeName } from "@/components/type-name";
import "./love.css";

export const metadata: Metadata = pageMetadata({
  title: "恋愛運を引き寄せる診断",
  description: "恋を引き寄せる人は、自分だけの「恋の正解」を知っている。プロの占い師が監修した、生年月日でわかる恋愛運診断。あなたのキャラ（本質）とギフト（生まれ持った強み）から、魅力の引き出し方、恋がうまくいく法則とやりがちなNG、相性のいい相手がわかります。質問なし・約10秒・無料。",
  path: "/love/",
  image: "/og/love.jpg",
});
/** The page sits on cream paper under a night-blue header, so form controls render light. */
export const viewport: Viewport = { themeColor: "#10213b", colorScheme: "light" };

const WORRIES = ["なぜか、同じような恋をくり返してしまう", "「いい人」止まりで、恋愛対象として見られにくい", "好きな人の前だと、本当の自分を出せない", "惹かれるのは、なぜか幸せになれない相手ばかり", "そろそろ本気で、恋愛運を引き寄せたい"];
const LEARN: [title: string, text: string, icon: LucideIcon][] = [
  ["あなたのキャラと恋の傾向", "10タイプから、あなたの本質を診断。恋をしたときの傾向まで、見えてきます。", Fingerprint],
  ["魅力の引き出し方", "あなたが「選ばれる理由」と、それを相手に伝える見せ方。", Gem],
  ["恋がうまくいく法則とNG", "あなたの恋がうまくいく進め方と、ついやってしまうNGパターン。", Compass],
  ["ギフトと恋のヒント", "生まれ持った強みの生かし方と、今日からできること。相性のいいキャラもわかります。", Gift],
];
const REASONS: [title: string, text: string, icon: LucideIcon][] = [
  ["東洋の「占いの帝王」がベース", "古くから「占いの帝王」と呼ばれ、長い歴史の中で体系化されてきた東洋の占術がベース。霊感や「なんとなく」ではなく、決まった理論から読み解きます。そこに数々の占いや運命学、統計を組み合わせて作りました。", Crown],
  ["鑑定1,000件以上の｜占い師が監修", "テレビ出演や政財界の顧客をもつ占い師に師事し、東洋の占術を学んで10年。名古屋・栄の占い館では、月間売上1位（2024年8月）にもなりました。キャラの読み解きから、ひとつひとつの文章まで監修しています。", Feather],
  ["気分や答え方で、結果がぶれない", "質問に答える性格診断は、その日の気分や答え方で結果が変わってしまいます。ステラファイルは生年月日だけで読み解くから、何度診断しても同じ。素のあなたが、そのまま出ます。", Clock],
];

/** Position in a staggered group: each item rises a moment after the one before (see .lv-stagger). */
const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** The ten characters in a row. In the hero they pop in one by one; `still` skips that (the closing call). */
function Faces({ still = false }: { still?: boolean }) {
  return <div className={`lv-faces${still ? " is-still" : ""}`} aria-hidden="true">{CHARACTER_TYPES.map((type, i) => <span key={type.slug} className="lv-face" style={{ ...elementStyle(type.stem), ...order(i) }}><Character type={type} priority={!still} /></span>)}</div>;
}

/** Section heading: a small gold English label, the mincho title, an optional lead. */
function Head({ id, en, title, lead }: { id: string; en: string; title: string; lead?: string }) {
  return <header className="lv-head lv-reveal"><span className="lv-head-en" aria-hidden="true">{en}</span><h2 id={id}><Phrases>{title}</Phrases></h2>{lead && <p><Phrases>{lead}</Phrases></p>}</header>;
}

/** Landing page for women in their 30s and 40s: 恋愛運 is the hook, and the result shows her own answer in love (恋の正解) and how to bring out her charm.
 * Everything here leads to the birth date form at the top, which opens the result on this same page. This first page does not mention
 * the official LINE; the result ends at it (with a placeholder button until the friend-add URL is set). There is no way out besides LINE and the privacy page: no links to the app, no sharing, no friend check,
 * and no "enter another date" (it would only lead away from LINE).
 * Sections alternate cream and white: worries → what you get → the ten characters → why it works → the closing call.
 * On this page the type is called キャラ (her essence) and the item is her ギフト (strengths and individuality).
 * Line breaks: headings, catches, labels and short list items go through Phrases (breaks after 、。！？ or at a ｜ hint);
 * running text is plain, justified and breaks like print (see love.css). */
export default function LovePage() {
  const hero = <>
    <Faces />
    <p className="lv-kicker">生年月日でわかる 10タイプ恋愛運診断</p>
    <h1 className="lv-title"><span className="lv-title-line">恋を引き寄せる人は、</span><span className="lv-title-line">自分だけの<em>「恋の正解」</em>を</span><span className="lv-title-line">知っている。</span></h1>
    <p className="lv-lead"><Phrases>魅力の引き出し方と、恋がうまくいく法則が、生年月日だけでわかります。</Phrases></p>
    <ul className="lv-meta"><li>質問なし・約10秒</li><li>10タイプで本質がわかる</li><li>無料・登録なし</li></ul>
  </>;
  const intro = <>
    <section className="lv-section" aria-labelledby="lv-worry-title">
      <div className="lv-wrap">
        <Head id="lv-worry-title" en="YOUR LOVE" title="その恋、ほかの誰かの正解を｜なぞっていませんか？" />
        <div className="lv-prose lv-reveal">
          <p>がんばっているのに、報われない恋。恋愛の本やSNSのテクニックを試しても、なぜかしっくりこない。それは、あなたに魅力が足りないからではありません。そのやり方が、ほかの誰かにとっての正解だっただけです。</p>
        </div>
        <div className="lv-stanza lv-reveal">
          <p><Phrases>追いかけて輝く人もいれば、待って選ばれる人もいる。</Phrases></p>
          <p><Phrases>尽くして愛される人もいれば、｜自分らしさを貫いて愛される人もいる。</Phrases></p>
          <p className="lv-stanza-key"><Phrases>恋の正解は、人の数だけ。｜自分だけの正解を知った人から、恋愛運は動き出します。</Phrases></p>
        </div>
        <ul className="lv-checks lv-stagger" aria-label="こんな人におすすめ">{WORRIES.map((text, i) => <li key={text} style={order(i)}><Check size={18} strokeWidth={2.6} aria-hidden="true" /><Phrases>{text}</Phrases></li>)}</ul>
        <p className="lv-checks-note lv-reveal"><Phrases>ひとつでも当てはまったら、｜合わない恋をがんばり続ける前に、｜あなただけの「恋の正解」を｜知ってください。</Phrases></p>
      </div>
    </section>
    <section className="lv-section is-white" aria-labelledby="lv-learn-title">
      <div className="lv-wrap">
        <Head id="lv-learn-title" en="WHAT YOU GET" title="この診断でわかること" />
        <ol className="lv-learn lv-stagger">{LEARN.map(([title, text, Icon], i) => <li key={title} style={order(i)}><span className="lv-learn-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span><div><span className="lv-learn-no">{String(i + 1).padStart(2, "0")}</span><h3><Phrases>{title}</Phrases></h3><p><Phrases>{text}</Phrases></p></div></li>)}</ol>
      </div>
    </section>
    <section className="lv-section" aria-labelledby="lv-types-title">
      <div className="lv-wrap-wide">
        <Head id="lv-types-title" en="10 CHARACTERS" title="あなたは、どのキャラ？" lead="恋の進め方も、愛され方も、｜キャラによってまったく違います。" />
        <TypeStrip>{CHARACTER_TYPES.map((type, i) => <li key={type.slug} className="lv-type" style={{ ...elementStyle(type.stem), ...order(i % 5) }}><span className="lv-type-art"><Character type={type} /></span><h3><TypeName name={type.displayName} /></h3><p><Phrases>{LOVE_COPY[type.slug].catch}</Phrases></p></li>)}</TypeStrip>
      </div>
    </section>
    <section className="lv-section is-white" aria-labelledby="lv-why-title">
      <div className="lv-wrap">
        <Head id="lv-why-title" en="WHY STELLA FILE" title="ステラファイルが当たる理由" />
        <ol className="lv-reasons lv-stagger">{REASONS.map(([title, text, Icon], i) => <li key={title} style={order(i)}><span className="lv-reason-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span><div><span className="lv-reason-no">{`理由 ${i + 1}`}</span><h3><Phrases>{title}</Phrases></h3><p>{text}</p></div></li>)}</ol>
        <div className="lv-statement lv-reveal">
          <p className="lv-statement-lead"><Phrases>自分を知り、魅力を引き出して、恋愛運を引き寄せる。</Phrases></p>
          <p><Phrases>ステラファイルは、東洋の占術の知恵を、｜今のあなたの恋に生かすために生まれました。</Phrases></p>
        </div>
      </div>
    </section>
    <section id="lv-final" className="lv-final lv-dark lv-sky" aria-labelledby="lv-final-title">
      <div className="lv-wrap lv-reveal">
        <Faces still />
        <h2 id="lv-final-title" className="lv-final-title"><Phrases>自分の恋の正解を知れば、恋はもっとラクになる。</Phrases></h2>
        <p className="lv-final-text"><Phrases>生年月日を入れるだけ。あなたの恋愛運を引き寄せるヒントが、10秒でわかります。</Phrases></p>
        <a className="lv-cta" href="#diagnose">無料で恋愛運を診断する</a>
      </div>
    </section>
  </>;
  return <div className="love">
    <header className="lv-header lv-dark"><div className="lv-wrap-wide lv-header-inner"><span className="lv-brand"><LogoMark size={18} /><span>{SITE_NAME}</span><span className="lv-official">公式</span></span><span className="lv-tag">恋愛運診断</span></div></header>
    <main id="main"><LoveDiagnosis hero={hero} intro={intro} /></main>
    <footer className="lv-footer">
      <div className="lv-wrap">
        <span className="lv-brand"><LogoMark size={16} /><span>{SITE_NAME}</span></span>
        <nav aria-label="フッター"><Link href="/privacy/">プライバシー</Link></nav>
        <p className="lv-footer-note"><Phrases>キャラの読み解きと文章は、｜プロの占い師が監修しています。</Phrases></p>
        <p className="micro">© ステラファイル</p>
      </div>
    </footer>
  </div>;
}
