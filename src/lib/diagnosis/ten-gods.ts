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
export const GOD_COPY: Record<TenGod, { title: string; strength: string; hint: string }> = {
  比肩: { title: "自分の軸を、静かに持つ", strength: "周りの声を聞きながらも、自分で決めて進む力。小さな約束を守る積み重ねが、あなたらしい信頼になります。", hint: "人と違う選択も、あなたに合っていれば大丈夫。" },
  劫財: { title: "ひとりの力を、みんなの力へ", strength: "人の得意を見つけて、仲間と形にする力。ひとりでは届かない目標も、関係を育てながら近づけそう。", hint: "引き受ける前に、自分の余力にも目を向けて。" },
  食神: { title: "日常に、小さなよろこびを", strength: "心地よいものを見つけ、場を和ませる力。自然体のひと言や工夫が、誰かの緊張をほどいています。", hint: "好きなことを味わう時間が、あなたの充電に。" },
  傷官: { title: "小さな違いに、気づける人", strength: "見過ごされがちな違和感を拾い、よりよい形に整える力。繊細な感性は、表現や改善の頼もしい味方です。", hint: "完成度だけでなく、ここまでできたことも数えて。" },
  偏財: { title: "ご縁を、次の可能性につなぐ", strength: "相手が喜ぶことを察し、人と情報をつなぐ力。気さくなやり取りから、新しい選択肢を生み出せそう。", hint: "誰かへの気遣いと同じくらい、自分にもやさしく。" },
  正財: { title: "ていねいな積み重ねが、実になる", strength: "時間や約束を大切にして、安心を積み上げる力。派手さがなくても、あなたの確かさを見ている人がいます。", hint: "予定に少し余白を残すと、続けやすくなりそう。" },
  偏官: { title: "必要なときに、一歩を出せる", strength: "困っている人や停滞した場面で、先に動ける力。決断の速さと面倒見のよさが、周囲の支えになりそう。", hint: "すぐに答えを出さず、一呼吸おく日があってもいい。" },
  正官: { title: "誠実さで、安心をつくる", strength: "役割を丁寧に果たし、人の信頼に応える力。誰かが見ていない場所での気配りも、あなたの魅力です。", hint: "きちんとできない日にも、あなたの価値は変わりません。" },
  偏印: { title: "違う角度から、ひらめく", strength: "当たり前を少し離れて眺め、新しい発想を見つける力。好奇心で集めた知識が、意外な場面でつながります。", hint: "興味が移るのも、視野が広がっているサインかも。" },
  印綬: { title: "学びを、誰かの安心に変える", strength: "背景を丁寧に理解し、わかりやすく伝える力。経験を言葉にすることで、誰かが進む手がかりになります。", hint: "十分に準備したら、小さく試すことも学びのひとつ。" },
};
