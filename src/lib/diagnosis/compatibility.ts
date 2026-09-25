import { STEMS, mod, type Stem } from "./calendar";

/** Compatibility by day stem.
 * best    = 干合 partner (甲己・乙庚・丙辛・丁壬・戊癸, i.e. index +5).
 * good    = stems whose element generates mine (相生: 水→木→火→土→金→水).
 * caution = stems whose element controls mine (相剋), except the 干合 partner,
 *           because a combination outranks the clash. */
export type CompatibilityLevel = "best" | "good" | "caution";
const element = (stem: Stem) => Math.floor(STEMS.indexOf(stem) / 2);
const stemsOf = (el: number) => [STEMS[el * 2], STEMS[el * 2 + 1]];
export const combinationPartner = (stem: Stem): Stem => STEMS[mod(STEMS.indexOf(stem) + 5, 10)];
export function compatibility(stem: Stem): Record<CompatibilityLevel, Stem[]> {
  const partner = combinationPartner(stem), el = element(stem);
  return {
    best: [partner],
    good: stemsOf(mod(el - 1, 5)),
    caution: stemsOf(mod(el - 2, 5)).filter(target => target !== partner),
  };
}
