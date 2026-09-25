import { STEMS, mod, type Stem, type Branch } from "./calendar";

export type HiddenStemSet = { main: Stem; middle?: Stem; residual?: Stem };
/** Fixed 本気 table. 中気/余気 fields are extension points only: not inferred or weighted.
 * Future providers may select by seasonal rule; v1 deliberately uses only main. */
export const HIDDEN_STEMS: Record<Branch, HiddenStemSet> = {
  子: { main: "癸" }, 丑: { main: "己" }, 寅: { main: "甲" }, 卯: { main: "乙" },
  辰: { main: "戊" }, 巳: { main: "丙" }, 午: { main: "丁" }, 未: { main: "己" },
  申: { main: "庚" }, 酉: { main: "辛" }, 戌: { main: "戊" }, 亥: { main: "壬" },
};
export interface HiddenStemProvider {
  id: string;
  select(branch: Branch): Stem;
}
export const mainQiProvider: HiddenStemProvider = { id: "main-qi-v1", select: branch => HIDDEN_STEMS[branch].main };
export const TEN_GODS = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "印綬"] as const;
export type TenGod = typeof TEN_GODS[number];
/** Five elements are 木火土金水; adjacent elements generate, +2 controls.
 * Polarity is even=陽, odd=陰. 印 reverses the usual same/opposite naming:
 * same=偏印, opposite=印綬(正印). 日本語表記: 七殺→偏官, 正印→印綬. */
export function tenGod(dayStem: Stem, target: Stem): TenGod {
  const a = STEMS.indexOf(dayStem), b = STEMS.indexOf(target);
  const relation = mod(Math.floor(b / 2) - Math.floor(a / 2), 5);
  return TEN_GODS[relation * 2 + (a % 2 === b % 2 ? 0 : 1)];
}
/** Each relationship is presented to users as an "item" the type carries; no technical names are shown. */
export const GOD_COPY: Record<TenGod, { item: string; title: string; strength: string; hint: string }> = {
  比肩: { item: "コンパス", title: "自分で決めて進める", strength: "人の意見を聞きつつ、最後は自分で決められる人。小さな約束をきちんと守るので、周りから信頼されます。", hint: "人と違う道を選んでも、自分に合っていればOK。" },
  劫財: { item: "おそろいのミサンガ", title: "仲間と力を合わせられる", strength: "人の得意なことを見つけて、チームで結果を出せる人。ひとりでは難しいことも、仲間となら実現できます。", hint: "引き受けすぎには注意。自分の余裕も確認しましょう。" },
  食神: { item: "クッキー缶", title: "毎日を楽しめる", strength: "おいしいものや心地いいことを見つけるのが上手。あなたがいるだけで、場の空気がゆるみます。", hint: "好きなことをする時間が、いちばんの充電になります。" },
  傷官: { item: "虫めがね", title: "細かい違いに気づける", strength: "ほかの人が見落とすことに気づいて、もっと良くできる人。その感覚は、ものづくりや改善で大きな武器になります。", hint: "完璧じゃなくても、できたところをちゃんと認めて。" },
  偏財: { item: "レターセット", title: "人と人をつなげられる", strength: "相手が喜ぶことを察して、人や情報をつなぐのが得意。気軽な会話から、新しいチャンスが生まれます。", hint: "人に気をつかうのと同じくらい、自分も大事に。" },
  正財: { item: "貯金箱", title: "コツコツ積み上げられる", strength: "時間やお金、約束をきちんと守れる人。派手さはなくても、その確かさを見ている人は必ずいます。", hint: "予定を詰めすぎず、少し余裕を残すと続けやすくなります。" },
  偏官: { item: "剣", title: "いざというとき動ける", strength: "困っている人がいたら、真っ先に動ける人。決断の早さと面倒見のよさで、周りを助けます。", hint: "すぐに答えを出さず、ひと呼吸おく日があってもいい。" },
  正官: { item: "腕時計", title: "真面目さで信頼される", strength: "任されたことをきちんとやり遂げる人。人が見ていないところでの気づかいも、あなたの魅力です。", hint: "うまくできない日があっても、あなたの価値は変わりません。" },
  偏印: { item: "望遠鏡", title: "人と違う発想ができる", strength: "当たり前を疑って、新しいアイデアを思いつける人。いろいろなことに興味を持つので、知識が意外なところで役立ちます。", hint: "興味がコロコロ変わるのも、視野が広い証拠です。" },
  印綬: { item: "本", title: "学んだことを人に伝えられる", strength: "物事をしっかり理解して、わかりやすく説明できる人。あなたの経験が、誰かの助けになります。", hint: "準備が整ったら、まずは小さく試してみて。" },
};
