import { STEMS, mod, type Stem } from "./calendar";
import { tenGod } from "./ten-gods";

/** Compatibility by day stem.
 * best     = 干合 partner (甲己・乙庚・丙辛・丁壬・戊癸, i.e. index +5).
 * good     = stems whose element generates mine (相生: 水→木→火→土→金→水).
 * attracted = stems whose element mine generates (e.g. 火 for 木).
 * nemesis  = the stem that is 偏官 to me (controls me with the same polarity, e.g. 丁 for 辛).
 * caution  = the stem that is 正官 to me, unless it is the 干合 partner (a combination outranks the clash). */
export type CompatibilityLevel = "best" | "good" | "attracted" | "caution" | "nemesis";
const element = (stem: Stem) => Math.floor(STEMS.indexOf(stem) / 2);
export const combinationPartner = (stem: Stem): Stem => STEMS[mod(STEMS.indexOf(stem) + 5, 10)];
export function compatibility(stem: Stem): Record<CompatibilityLevel, Stem[]> {
  const partner = combinationPartner(stem), generator = mod(element(stem) - 1, 5), generated = mod(element(stem) + 1, 5);
  return {
    best: [partner],
    good: STEMS.filter(target => element(target) === generator),
    attracted: STEMS.filter(target => element(target) === generated),
    caution: STEMS.filter(target => tenGod(stem, target) === "正官" && target !== partner),
    nemesis: STEMS.filter(target => tenGod(stem, target) === "偏官"),
  };
}
