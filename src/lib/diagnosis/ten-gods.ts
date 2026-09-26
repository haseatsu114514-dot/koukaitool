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
  比肩: { item: "ダンベル", title: "自分の力でどんどん強くなれる", strength: "誰かに頼るより、自分で鍛えて伸びていくタイプ。エネルギーが高く、ここぞという場面では底力を発揮できます。努力した分だけ、しっかり自分の力になっていく人です。", hint: "ひとりでがんばりすぎた日は、ちゃんと休むのもトレーニングのうち。" },
  劫財: { item: "王冠", title: "仲間と組むほど強くなれる", strength: "ひとりより、仲間と一緒のほうが力を発揮できる人。自然と周りをまとめて、チームの中心に立つ場面が多いはず。仲間の力を借りて、大きなことを成し遂げられます。", hint: "仲間のために張り切りすぎて、自分の分を後回しにしないように。" },
  食神: { item: "クッキー缶", title: "人生を楽しむのが上手", strength: "楽しいことを思いつくのが得意で、アイデアを出すのも、おしゃべりも上手な人。おいしいものや心地いいことを見つけるのもお手のものです。遊びやラクなほうに流れてしまう日もありますが、楽しむ力があるぶん、人生そのものが楽しくなっていきます。", hint: "気が乗らないことは、楽しめる工夫をひとつ足すと進みやすくなります。" },
  傷官: { item: "トゲのあるバラ", title: "鋭いけど、実は傷つきやすい", strength: "頭の回転が速く、思ったことをズバッと言える人。その一言が鋭すぎて、相手をドキッとさせてしまうことも。でも本当は、人一倍傷つきやすくて繊細です。その感性の鋭さは、センスや表現力として大きな武器になります。", hint: "言いすぎたかなと思ったら、あとで一言フォローするだけで印象が変わります。" },
  偏財: { item: "スマホ", title: "フットワーク軽く、人とつながれる", strength: "いろいろな人とつながって、情報やチャンスをキャッチするのが上手な人。興味のあることにはフットワーク軽く動けるので、人の輪がどんどん広がっていきます。その顔の広さが、思わぬチャンスを運んできてくれます。", hint: "つながりが増えて疲れたら、通知を切ってひとりの時間で充電を。" },
  正財: { item: "スケジュール帳", title: "先を見越して、しっかり計画できる", strength: "先のことまで見越して、しっかり計画を立てられる人。予定ややることを整理して、一歩ずつ着実に進めていけます。お金のやりくりも得意で、貯金もコツコツ続けられるタイプです。", hint: "計画どおりにいかない日があっても大丈夫。予定に少し余白を残しておくと、気持ちがラクになります。" },
  偏官: { item: "自転車", title: "動き出したら止まらない行動派", strength: "思い立ったらすぐに動ける、行動の早い人。頼まれごとや予定が重なっても、テキパキ片づけながら前に進んでいけます。じっとしているより、動いているほうが調子がいいタイプです。", hint: "疲れたら、ペダルをこぐのを少しお休みして。休んだぶん、また軽やかに走り出せます。" },
  正官: { item: "合鍵", title: "まじめさが、信頼につながる", strength: "約束やルールを大切にする、まじめで誠実な人。任されたことに責任を持って向き合う姿勢が、少しずつ周りからの信頼につながっていきます。その積み重ねが、あなたの信用の証になっていきます。", hint: "きちんとしなきゃと思いすぎた日は、少し肩の力を抜いても大丈夫です。" },
  偏印: { item: "望遠鏡", title: "人と違う発想ができる", strength: "当たり前を疑って、新しいアイデアを思いつける人。いろいろなことに興味を持つので、知識が意外なところで役立ちます。", hint: "興味がコロコロ変わるのも、視野が広い証拠です。" },
  印綬: { item: "本", title: "学ぶのが得意な物知り", strength: "理解力が高く、新しいことを学ぶのが上手な人。知識をどんどん吸収していくので自然と物知りになり、勉強の成績も伸びやすいタイプです。学んだことをわかりやすく説明するのも得意です。", hint: "学んだことは、小さく試してみるともっと身につきます。" },
};
