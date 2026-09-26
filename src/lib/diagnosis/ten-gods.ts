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
  比肩: { item: "ダンベル", title: "自分の力でどんどん強くなれる", strength: "誰かに頼るより、自分で鍛えて伸びていくタイプ。努力した分だけ確実にパワーアップしていくので、気づけば一人でも何でもこなせるようになっています。", hint: "ひとりで頑張りすぎた日は、ちゃんと休むのもトレーニングのうち。" },
  劫財: { item: "王冠", title: "仲間と組むほど強くなれる", strength: "ひとりより、仲間と一緒のほうが力を発揮できる人。自然とまわりをまとめて、チームの中心に立つ場面が多いはず。仲間の力を借りて、大きなことを成し遂げられます。", hint: "仲間のために張り切りすぎて、自分の分を後回しにしないように。" },
  食神: { item: "クッキー缶", title: "毎日を楽しめる", strength: "おいしいものや心地いいことを見つけるのが上手。あなたがいるだけで、場の空気がゆるみます。", hint: "好きなことをする時間が、いちばんの充電になります。" },
  傷官: { item: "ハサミ", title: "鋭いけど、実は傷つきやすい", strength: "頭の回転が速く、思ったことをズバッと言える人。その一言が鋭すぎて、毒舌と言われることも。でも本当は、人一倍傷つきやすくて繊細です。その感性の鋭さは、センスや表現力として大きな武器になります。", hint: "言いすぎたかなと思ったら、あとで一言フォローするだけで印象が変わります。" },
  偏財: { item: "スマホ", title: "誰とでも仲良くなれる人気者", strength: "初対面でもすぐに打ち解けられる、コミュニケーションの達人。話題が豊富で、いるだけで場が盛り上がります。自然と人が集まってきて、顔の広さがチャンスを運んできます。", hint: "みんなに気をつかいすぎて疲れたら、ひとりの時間で充電を。" },
  正財: { item: "貯金箱", title: "コツコツ積み上げられる", strength: "時間やお金、約束をきちんと守れる人。派手さはなくても、その確かさを見ている人は必ずいます。", hint: "予定を詰めすぎず、少し余裕を残すと続けやすくなります。" },
  偏官: { item: "パンパンのスケジュール帳", title: "いつも忙しく走り回っている", strength: "頼まれごとや予定がどんどん入ってきて、気づけばいつも忙しい人。でもそのぶん行動が早く、頼まれたことをテキパキ片づけられます。じっとしているより、動いているほうが調子がいいタイプです。", hint: "予定を詰め込みすぎたら、何もしない日をあえて作ってみて。" },
  正官: { item: "腕時計", title: "真面目で、誰からも信頼される", strength: "時間や約束をきちんと守る、真面目でまっすぐな人。ルールを大切にし、任されたことは最後までやり遂げるので、周りから「この人なら安心」と信頼されています。", hint: "うまくできない日があっても、あなたの信頼は簡単には崩れません。" },
  偏印: { item: "望遠鏡", title: "人と違う発想ができる", strength: "当たり前を疑って、新しいアイデアを思いつける人。いろいろなことに興味を持つので、知識が意外なところで役立ちます。", hint: "興味がコロコロ変わるのも、視野が広い証拠です。" },
  印綬: { item: "本", title: "学んだことを人に伝えられる", strength: "物事をしっかり理解して、わかりやすく説明できる人。あなたの経験が、誰かの助けになります。", hint: "準備が整ったら、まずは小さく試してみて。" },
};
