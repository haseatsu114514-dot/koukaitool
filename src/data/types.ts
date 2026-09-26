import { STEMS, type Stem } from "@/lib/diagnosis/calendar";
import { ART_STYLE, type CharacterAsset, type ImageGenerationRequest } from "./art-direction";
/** Five-element colours: wood=green, fire=red, earth=yellow, metal=silver on pearl, water=blue.
 * `tint` is the light card background behind a character; `color` is the vivid accent. */
export const ELEMENT_COLORS = [
  { color: "#4cbb5e", tint: "#d3ecca" },
  { color: "#e5484d", tint: "#f8d0cb" },
  { color: "#f2c230", tint: "#f7e6a4" },
  { color: "#c3ccd8", tint: "#ece7df" },
  { color: "#3b8fe6", tint: "#c9def6" },
] as const;
/** Plain names for the legend; each element holds a yang/yin pair of types. */
export const ELEMENT_NAMES = ["木", "火", "土", "金", "水"] as const;
export const elementIndex = (stem: Stem) => Math.floor(STEMS.indexOf(stem) / 2);
export const elementColors = (stem: Stem) => ELEMENT_COLORS[elementIndex(stem)];
export const elementName = (stem: Stem) => ELEMENT_NAMES[elementIndex(stem)];
/** CSS custom properties (--tint / --el) consumed by the stylesheet for character backgrounds and rings. */
export const elementStyle = (stem: Stem) => { const { tint, color } = elementColors(stem); return { "--tint": tint, "--el": color } as React.CSSProperties; };
export type CharacterType = {
  stem: Stem; slug: string; displayName: string; shortCatch: string; summary: string;
  strengths: string[];
  keywords: string[]; motif: string; props: string[]; backgroundMotifs: string[]; imagePrompt: string;
};
export const CHARACTER_TYPES: CharacterType[] = [
  { stem: "甲", slug: "grizzly", displayName: "ほめ待ちグリズリー", shortCatch: "頼れるしっかり者。でも本当は、ほめてほしい。", summary: "まっすぐで、決めたことをコツコツ積み上げるタイプ。さっぱりした性格で、曲がったことやずるいことが大嫌いです。リーダーを任されるのは嫌いじゃないけれど、シャイなので自分から名乗り出るのは少し苦手。任されてほめられると、実はとてもうれしい。頼もしさと、素直でかわいいところのギャップが魅力です。", strengths: ["コツコツ努力を積み重ねられる", "曲がったことをしないまっすぐさ", "しんどくても投げ出さない忍耐力"], keywords: ["まっすぐ", "さっぱり", "コツコツ"], motif: "大きな木", props: ["小さな胸のリボン"], backgroundMotifs: ["若葉", "控えめな花丸"], imagePrompt: "A sturdy soft moss-green grizzly with a pale cream bib, sitting upright, paws shyly together, tiny cream-gold ribbon on chest, quietly waiting for praise; one small green sprout beside it." },
  { stem: "乙", slug: "rabbit", displayName: "ちゃっかりうさぎ", shortCatch: "人に合わせるのが上手。気づけば、いいポジションにいる。", summary: "人に合わせるのが上手で、自然とかわいがられるタイプ。「面倒を見てあげたい」「守ってあげたい」と思われやすく、人と仲良くなったことがきっかけで、得をしたりチャンスをもらえたりします。友だちも多くなりやすい、人間関係に恵まれやすい人です。", strengths: ["相手に合わせるのが上手", "かわいがられて、助けてもらいやすい", "人との縁をチャンスに変えられる"], keywords: ["人に合わせ上手", "かわいがられ上手", "ちゃっかり"], motif: "草花", props: ["小さな花のアクセサリー"], backgroundMotifs: ["クローバー"], imagePrompt: "An ivory rabbit with long rounded ears, one foot lifted lightly, a tiny four-leaf clover tucked behind one ear, a small clover at its feet, knowing but kind expression." },
  { stem: "丙", slug: "phoenix", displayName: "勝手に主役フェニックス", shortCatch: "いるだけで場が明るくなる、生まれつきの主役。", summary: "根っから明るい、太陽のようなタイプ。ほかのタイプと比べても圧倒的にポジティブで、一緒にいる人まで元気で前向きな気持ちにしてくれます。顔や名前を覚えてもらいやすく、目立ってこそ輝く、まさに人生の主役です。", strengths: ["根っからのポジティブさ", "周りを元気で前向きな気持ちにできる", "顔や名前を覚えてもらいやすい"], keywords: ["ポジティブ", "目立ってなんぼ", "ムードメーカー"], motif: "太陽", props: ["小さな丸いステージ"], backgroundMotifs: ["短い光の線"], imagePrompt: "A small coral-red phoenix with a cream belly and golden beak, a simple three-feather crest, wings open on a tiny round gold stage, three short sunshine rays, cheerfully unaware it is the star." },
  { stem: "丁", slug: "fox", displayName: "とろ火の妖狐", shortCatch: "人一倍よく見ている。だから、誰より気がきく。", summary: "観察力が人一倍強く、ほかの人が見落とす細かいところまで見えているタイプ。だからこそ、言われる前に相手の変化に気づけて、気がきく人と言われます。目の前のものをじっくり見るのが得意で、好きなことにはマニアックなほどこだわる職人気質です。", strengths: ["ほかの人が気づかないことに気づける", "細かいところまでこだわれる職人気質", "人間観察が上手"], keywords: ["観察力", "気がきく", "職人気質"], motif: "灯火", props: ["小さな灯り"], backgroundMotifs: ["細い三日月"], imagePrompt: "A calm vermilion-red fox with a cream face and chest, a single large curled deeper-red tail and rounded ears, sitting beside a tiny warm candle in a clay holder, one small crescent moon, modest closed-mouth smile." },
  { stem: "戊", slug: "panda", displayName: "親分パンダ", shortCatch: "どっしり構えて、ぶれない。頼れるみんなの親分。", summary: "どっしり構えて、自分の軸をぶらさないタイプ。流行に流されず、好きなものはずっと好き。親分肌で、頼られるとうれしくなって面倒を見てしまいます。ふだんは穏やかですが、内側にはマグマのような激しさを秘めていて、いざというときの度胸はピカイチです。", strengths: ["自分の軸をぶらさない", "いざというときの度胸", "頼ってくれる人を最後まで守れる"], keywords: ["どっしり", "親分肌", "度胸"], motif: "山", props: ["お茶のカップ"], backgroundMotifs: ["小さな丘"], imagePrompt: "A round ivory and charcoal panda sitting with a broad reassuring posture, holding a tiny mustard-yellow teacup, a simple low hill line behind, gentle dependable expression." },
  { stem: "己", slug: "kangaroo", displayName: "ほっとけないカンガルー", shortCatch: "困っている人を、ほっとけない。家族みたいなお世話係。", summary: "献身的で面倒見がよく、家族のようにみんなのお世話をしてしまうタイプ。和を大事にするバランサーで、人を育てるのが得意です。ただ、心配しすぎて大変な役まで引き受け、我慢をためこんでしまうことも。どこか独特な雰囲気を持つ、愛されキャラです。", strengths: ["家族のように人を思いやれる献身さ", "場の和を保つバランス感覚", "人をじっくり育てられる"], keywords: ["献身的", "バランサー", "育て上手"], motif: "畑", props: ["お腹の袋からのぞく子ども"], backgroundMotifs: ["芽吹き"], imagePrompt: "A warm golden-ochre kangaroo with a cream belly, sitting softly upright with tall rounded ears, a tiny joey peeking out of its pouch, one small paw raised in a caring gesture, one sprout beside it, gentle worried-but-kind expression." },
  { stem: "庚", slug: "doberman", displayName: "正々堂々ドーベルマン", shortCatch: "遠回しな言い方は苦手。でも、誰より義理がたい。", summary: "白黒はっきりさせたい、筋の通ったタイプ。ずるや嘘が本当に苦手で、義理は何より大切にします。ストレートなぶん衝突も多く、好き嫌いがはっきり分かれやすい人。でも、好きになってくれる人からはとことん好かれます。", strengths: ["何より義理を守れる", "ずるや嘘をしないまっすぐさ", "問題から逃げずに向き合える"], keywords: ["義理がたい", "まっすぐ", "好き嫌いが分かれる"], motif: "鉄", props: ["小さな盾のバッジ"], backgroundMotifs: ["一本の旗"], imagePrompt: "A friendly silver-gray doberman with a white muzzle and natural soft floppy ears, upright but rounded posture, a small gold shield badge on a steel-blue collar, tiny white flag planted next to it, earnest expression, never aggressive." },
  { stem: "辛", slug: "hedgehog", displayName: "ガラスハートハリネズミ", shortCatch: "トゲトゲは、繊細な心を守るためのガード。", summary: "繊細でデリケート、何より傷つきたくないタイプ。だからこそ針で守りを固め、ときには口がちょっと悪くなることも。本当はケンカもしたくないし、人の痛みがよくわかる人です。完璧主義寄りで、こだわりを形にする職人気質。特別扱いされると、とてもうれしくなります。", strengths: ["完璧を目指せる職人気質", "人の痛みがわかる繊細さ", "こだわりを妥協せず形にできる"], keywords: ["繊細", "完璧主義", "高嶺の花"], motif: "宝石", props: ["透き通るハート"], backgroundMotifs: ["小さな白い花"], imagePrompt: "A small pearl-white hedgehog with a few large rounded silver spines, gently cradling a pale translucent-looking flat blue heart, shy dot eyes, one tiny white flower, protective and tender pose." },
  { stem: "壬", slug: "orca", displayName: "恋も野望も全力シャチ", shortCatch: "好きなことも、やりたいことも、全部本気。", summary: "エネルギッシュで、スケールの大きいタイプ。いろいろな人や価値観を受け入れられる懐の深さがあり、隠していてもどこか目立ってしまう存在感を持っています。興味の向くまま動くので、気づけば人生経験が豊富になっている人です。", strengths: ["尽きないエネルギー", "いろいろな人や価値観を受け入れられる", "経験の多さからくる引き出しの豊富さ"], keywords: ["エネルギッシュ", "懐が深い", "経験豊富"], motif: "海", props: ["小さなハート"], backgroundMotifs: ["丸い波"], imagePrompt: "A friendly small navy-blue-and-ivory orca leaping gently above two simple blue waves, rounded fins, tiny dusty-pink heart beside it, energetic forward pose, minimal flat shapes." },
  { stem: "癸", slug: "capybara", displayName: "温泉カピバラ", shortCatch: "穏やかで、繊細。そばにいるだけで癒しがうつる人。", summary: "穏やかで繊細、そばにいるだけで周りに癒しが伝染していくタイプ。好きなことにはオタク気質でのめり込みます。優しそうに見えて、実は溜め込みがすごく、ある日突然疲れきってしまう一面も。人に寄り添いたいし、自分も寄り添ってほしい人です。", strengths: ["そばにいる人を自然と癒せる", "人の気持ちに寄り添える", "好きなことをとことん深められる"], keywords: ["癒し系", "オタク気質", "寄り添い"], motif: "雨露", props: ["頭の葉っぱ"], backgroundMotifs: ["湯気", "やさしい水面"], imagePrompt: "A relaxed misty-blue capybara soaking in a simple clear-blue oval hot spring, one small green leaf on its head, two soft steam curls, tiny peaceful eyes, broad rounded nose." },
];
export const typeByStem = (stem: Stem) => CHARACTER_TYPES.find(type => type.stem === stem)!;
export const typeBySlug = (slug: string) => CHARACTER_TYPES.find(type => type.slug === slug);
export function characterAsset(type: CharacterType): CharacterAsset {
  return { slug: type.slug, status: "placeholder", src: `/characters/${type.slug}.svg`, alt: `${type.displayName}のイラスト`, styleVersion: ART_STYLE.version, width: 320, height: 320, provenance: { kind: "original-svg" } };
}
export function generationRequest(type: CharacterType): ImageGenerationRequest {
  return { slug: type.slug, prompt: `${ART_STYLE.positive}\n${type.imagePrompt}`, negativePrompt: ART_STYLE.negative, styleVersion: ART_STYLE.version, ...ART_STYLE.size };
}
