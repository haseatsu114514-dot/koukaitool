import { describe, it, expect } from "vitest";
import { Solar } from "lunar-typescript";
import { birthDateSchema, dayPillar, monthBranch, setsuiri, todayInJapan, STEMS, BRANCHES } from "../src/lib/diagnosis/calendar";
import { HIDDEN_STEMS, TEN_GODS, tenGod } from "../src/lib/diagnosis/ten-gods";
import { diagnose } from "../src/lib/diagnosis";
import { compatibility, stellaCompatibility, stellaLevel } from "../src/lib/diagnosis/compatibility";
import { CHARACTER_TYPES, generationRequest } from "../src/data/types";
import { TYPE_DETAILS } from "../src/data/type-details";
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
    expect(result.pillar.branch).toBe("子"); expect(result.monthBranch).toBe("丑"); expect(result.hiddenStem).toBe("己");
    expect(result.tenGod).toBe("正財"); expect(result.scope).toBe("month-branch");
    expect(diagnose({ year: 2000, month: 1, day: 7 }, { id: "test", select: () => "丙" }).tenGod).toBe("食神");
  });
  it("contains ten unique complete profiles and a shared art guide", () => {
    expect(new Set(CHARACTER_TYPES.map(t => t.stem)).size).toBe(10);
    expect(new Set(CHARACTER_TYPES.map(t => t.slug)).size).toBe(10);
    for (const type of CHARACTER_TYPES) { expect(type.strengths.length).toBe(3); expect(type.summary.length).toBeGreaterThan(40); expect(generationRequest(type).prompt).toContain(type.imagePrompt); }
    expect(TEN_GODS.length).toBe(10);
  });
  it("keeps every long-form profile the same shape", () => {
    for (const type of CHARACTER_TYPES) {
      const detail = TYPE_DETAILS[type.slug];
      expect(detail.aruaru, type.slug).toHaveLength(6); expect(detail.jobs, type.slug).toHaveLength(8);
      // The card heading already says "ストレスがたまると", so the body must not repeat it.
      expect(detail.stress.startsWith("ストレスがたま"), type.slug).toBe(false);
    }
  });
});
describe("節入り and month branch", () => {
  const minutes = (year: number, month: number, t: { day: number; hour: number; minute: number }) => Date.UTC(year, month - 1, t.day, t.hour, t.minute) / 60_000;
  it("matches lunar-typescript (UTC+8 shifted to JST, nearest minute) for every 節 1900–2100", () => {
    const terms = ["小寒", "立春", "惊蛰", "清明", "立夏", "芒种", "小暑", "立秋", "白露", "寒露", "立冬", "大雪"];
    for (let year = 1900; year <= 2100; year++) {
      const table = Solar.fromYmd(year, 6, 1).getLunar().getJieQiTable();
      terms.forEach((name, i) => {
        const t = table[name];
        const expected = Math.round(Date.UTC(t.getYear(), t.getMonth() - 1, t.getDay(), t.getHour(), t.getMinute(), t.getSecond()) / 60_000) + 60;
        expect(minutes(year, i + 1, setsuiri(year, i + 1)), `${year} ${name}`).toBe(expected);
      });
    }
  });
  it("stays within one minute of the NAOJ 暦要項", () => {
    // 国立天文台 暦要項 二十四節気 (JST, DDHHMM for 小寒 … 大雪).
    const naoj: Record<number, string> = {
      2005: "051503 040243 052045 050134 051853 052302 070917 071903 072157 081333 071642 070933",
      2024: "060549 041727 051123 041602 050910 051310 062320 070909 071211 080400 070720 070017",
      2025: "051133 032310 051707 042149 051457 051857 070505 071452 071752 080941 071304 070605",
      2026: "051723 040502 052259 050340 052049 060048 071057 072043 072341 081529 071852 071153",
    };
    for (const [year, row] of Object.entries(naoj)) row.split(" ").forEach((entry, i) => {
      const published = { day: +entry.slice(0, 2), hour: +entry.slice(2, 4), minute: +entry.slice(4) };
      expect(Math.abs(minutes(+year, i + 1, setsuiri(+year, i + 1)) - minutes(+year, i + 1, published)), `${year}-${i + 1}`).toBeLessThanOrEqual(1);
    });
  });
  it("stays within 15 minutes of an independent solar-longitude formula for every 節 1900–2100", () => {
    // Meeus, Astronomical Algorithms ch. 25 (low precision, about 0.01°); UT is used for TT.
    const rad = Math.PI / 180;
    const longitude = (ms: number) => {
      const T = (ms / 86_400_000 + 2440587.5 - 2451545) / 36525;
      const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
      const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
      return 280.46646 + 36000.76983 * T + 0.0003032 * T * T + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * rad);
    };
    for (let year = 1900; year <= 2100; year++) for (let month = 1; month <= 12; month++) {
      const tableMs = minutes(year, month, setsuiri(year, month)) * 60_000 - 9 * 3_600_000;
      const target = 285 + 30 * (month - 1);
      let lo = tableMs - 2 * 86_400_000, hi = tableMs + 2 * 86_400_000;
      for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (((longitude(mid) - target) % 360 + 540) % 360 - 180 >= 0) hi = mid; else lo = mid; }
      expect(Math.abs(tableMs - hi) / 60_000, `${year}-${month}`).toBeLessThan(15);
    }
  });
  it("switches the month branch at 節入り and treats the 節入り day as noon", () => {
    expect(Array.from({ length: 12 }, (_, i) => monthBranch({ year: 2024, month: i + 1, day: 15 })).join("")).toBe("丑寅卯辰巳午未申酉戌亥子");
    expect(Array.from({ length: 12 }, (_, i) => monthBranch({ year: 2024, month: i + 1, day: 1 })).join("")).toBe("子丑寅卯辰巳午未申酉戌亥");
    // 2024 立春 is 02-04 17:27 JST: noon on that day is still 丑, a known later time is 寅.
    expect(monthBranch({ year: 2024, month: 2, day: 4 })).toBe("丑");
    expect(monthBranch({ year: 2024, month: 2, day: 4 }, { hour: 17, minute: 27 })).toBe("寅");
    expect(monthBranch({ year: 2024, month: 2, day: 5 })).toBe("寅");
    // 2024 大雪 is 12-07 00:17 JST (12-06 in UTC+8).
    expect(monthBranch({ year: 2024, month: 12, day: 6 })).toBe("亥");
    expect(monthBranch({ year: 2024, month: 12, day: 7 })).toBe("子");
    // 2025 立春 is 02-03 23:10 JST.
    expect(monthBranch({ year: 2025, month: 2, day: 3 })).toBe("丑");
    expect(diagnose({ year: 2025, month: 2, day: 4 }).monthBranch).toBe("寅");
    expect(diagnose({ year: 1900, month: 1, day: 1 }).monthBranch).toBe("子");
    // 2000 小寒 is 01-06 10:01 JST, before noon, so the 節入り day itself is already 丑.
    expect(diagnose({ year: 2000, month: 1, day: 5 }).monthBranch).toBe("子");
    expect(diagnose({ year: 2000, month: 1, day: 6 }).monthBranch).toBe("丑");
  });
});
describe("compatibility", () => {
  it("uses 干合 as best, the generating element as good and 偏官 as caution", () => {
    expect(compatibility("甲")).toEqual({ best: ["己"], good: ["壬", "癸"], attracted: ["丙", "丁"], caution: ["庚"] });
    expect(compatibility("己")).toEqual({ best: ["甲"], good: ["丙", "丁"], attracted: ["庚", "辛"], caution: ["乙"] });
    expect(compatibility("丙")).toEqual({ best: ["辛"], good: ["甲", "乙"], attracted: ["戊", "己"], caution: ["壬"] });
    expect(compatibility("辛")).toEqual({ best: ["丙"], good: ["戊", "己"], attracted: ["壬", "癸"], caution: ["丁"] });
  });
  it("never lists a type twice or pairs a type with itself", () => {
    for (const stem of STEMS) {
      const all = Object.values(compatibility(stem)).flat();
      expect(new Set(all).size).toBe(all.length); expect(all).not.toContain(stem);
      expect(compatibility(stem).caution).toHaveLength(1);
    }
  });
});
describe("four-level compatibility shown on the site", () => {
  it("puts every other type in exactly one of 最高・いい・そこそこ・天敵", () => {
    expect(stellaCompatibility("甲")).toEqual({ best: ["己"], good: ["壬", "癸"], mid: ["乙", "丙", "丁", "戊", "辛"], foe: ["庚"] });
    for (const stem of STEMS) {
      const all = Object.values(stellaCompatibility(stem)).flat();
      expect(all).toHaveLength(9); expect(new Set(all).size).toBe(9); expect(all).not.toContain(stem);
      expect(stellaCompatibility(stem).foe).toEqual(compatibility(stem).caution);
    }
  });
  it("places a friend: 甲 with 己 is 最高, with 庚 is 天敵, with 甲 is the same type", () => {
    expect(stellaLevel("甲", "己")).toBe("best"); expect(stellaLevel("甲", "癸")).toBe("good");
    expect(stellaLevel("甲", "丙")).toBe("mid"); expect(stellaLevel("甲", "庚")).toBe("foe"); expect(stellaLevel("甲", "甲")).toBe("same");
    for (const stem of STEMS) for (const partner of STEMS) expect(stellaLevel(stem, partner)).toBeTruthy();
  });
});
