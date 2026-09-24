import { describe, it, expect } from "vitest";
import { Solar } from "lunar-typescript";
import { birthDateSchema, dayPillar, todayInJapan, STEMS, BRANCHES } from "../src/lib/diagnosis/calendar";
import { HIDDEN_STEMS, TEN_GODS, tenGod } from "../src/lib/diagnosis/ten-gods";
import { diagnose } from "../src/lib/diagnosis";
import { CHARACTER_TYPES, generationRequest } from "../src/data/types";
describe("Gregorian day pillar", () => {
  it("matches the published 6tail fixture 1986-05-29 癸酉", () => { expect(dayPillar({ year: 1986, month: 5, day: 29 })).toMatchObject({ stem: "癸", branch: "酉" }); });
  it("uses 2000-01-07 as 甲子 and repeats after 60 days", () => {
    expect(dayPillar({ year: 2000, month: 1, day: 7 })).toEqual({ stem: "甲", branch: "子", cycleIndex: 0 });
    expect(dayPillar({ year: 2000, month: 3, day: 7 })).toEqual(dayPillar({ year: 2000, month: 1, day: 7 }));
    expect(dayPillar({ year: 2000, month: 1, day: 6 }).cycleIndex).toBe(59);
  });
  it("cross-checks every month boundary, leap day and year boundary 1900–2100 against lunar-typescript", () => {
    for (let year = 1900; year <= 2100; year++) for (let month = 1; month <= 12; month++) {
      const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
      for (const day of [1, last]) {
        const actual = dayPillar({ year, month, day });
        expect(`${actual.stem}${actual.branch}`, `${year}-${month}-${day}`).toBe(Solar.fromYmd(year, month, day).getLunar().getDayInGanZhi());
      }
    }
  });
  it("validates absent, invalid, leap and future dates with a fixed JST today", () => {
    const schema = birthDateSchema({ year: 2026, month: 9, day: 25 });
    for (const input of [{ year: 1900, month: 2, day: 29 }, { year: 2025, month: 4, day: 31 }, { year: 2026, month: 9, day: 26 }, { year: 1899, month: 1, day: 1 }, { year: NaN, month: 1, day: 1 }, { year: 2000.5, month: 1, day: 1 }]) expect(schema.safeParse(input).success).toBe(false);
    expect(schema.safeParse({ year: 2000, month: 2, day: 29 }).success).toBe(true);
    expect(schema.safeParse({ year: 2026, month: 9, day: 25 }).success).toBe(true);
    expect(todayInJapan(new Date("2026-09-24T15:00:00Z"))).toEqual({ year: 2026, month: 9, day: 25 });
  });
});
describe("本気 and ten gods", () => {
  it("maps all 100 stem relationships independently from the calendar library", () => {
    // This explicit 10x10 oracle documents Japanese traditional polarity relationships.
    const oracle = [
      "比肩 劫財 食神 傷官 偏財 正財 偏官 正官 偏印 印綬",
      "劫財 比肩 傷官 食神 正財 偏財 正官 偏官 印綬 偏印",
      "偏印 印綬 比肩 劫財 食神 傷官 偏財 正財 偏官 正官",
      "印綬 偏印 劫財 比肩 傷官 食神 正財 偏財 正官 偏官",
      "偏官 正官 偏印 印綬 比肩 劫財 食神 傷官 偏財 正財",
      "正官 偏官 印綬 偏印 劫財 比肩 傷官 食神 正財 偏財",
      "偏財 正財 偏官 正官 偏印 印綬 比肩 劫財 食神 傷官",
      "正財 偏財 正官 偏官 印綬 偏印 劫財 比肩 傷官 食神",
      "食神 傷官 偏財 正財 偏官 正官 偏印 印綬 比肩 劫財",
      "傷官 食神 正財 偏財 正官 偏官 印綬 偏印 劫財 比肩",
    ];
    STEMS.forEach((stem, i) => STEMS.forEach((target, j) => expect(tenGod(stem, target)).toBe(oracle[i].split(" ")[j])));
  });
  it("covers every branch and supports replacing the hidden-stem provider", () => {
    expect(BRANCHES.map(branch => HIDDEN_STEMS[branch].main).join("")).toBe("癸己甲乙戊丙丁己庚辛戊壬");
    const result = diagnose({ year: 2000, month: 1, day: 7 });
    expect(result.tenGod).toBe("印綬"); expect(result.scope).toBe("day-branch");
    expect(diagnose({ year: 2000, month: 1, day: 7 }, { id: "test", select: () => "丙" }).tenGod).toBe("食神");
  });
  it("contains ten unique complete profiles and a shared art guide", () => {
    expect(new Set(CHARACTER_TYPES.map(t => t.stem)).size).toBe(10);
    expect(new Set(CHARACTER_TYPES.map(t => t.slug)).size).toBe(10);
    for (const type of CHARACTER_TYPES) { expect(type.strengths.length).toBe(3); expect(type.summary.length).toBeGreaterThan(40); expect(generationRequest(type).prompt).toContain(type.imagePrompt); }
    expect(TEN_GODS.length).toBe(10);
  });
});
