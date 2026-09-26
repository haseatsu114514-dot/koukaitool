import { z } from "zod";

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export type Stem = typeof STEMS[number];
export type Branch = typeof BRANCHES[number];
export type BirthDate = { year: number; month: number; day: number };
export const mod = (n: number, m: number) => ((n % m) + m) % m;
export function todayInJapan(now = new Date()): BirthDate {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { year: jst.getUTCFullYear(), month: jst.getUTCMonth() + 1, day: jst.getUTCDate() };
}
export function birthDateSchema(today = todayInJapan()) {
  return z.object({
    year: z.number().int().min(1900, "1900年以降の生年月日を入力してください。").max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
  }).superRefine((value, ctx) => {
    const date = new Date(Date.UTC(value.year, value.month - 1, value.day));
    if (date.getUTCMonth() + 1 !== value.month || date.getUTCDate() !== value.day) {
      ctx.addIssue({ code: "custom", path: ["day"], message: "この月にはない日付です。月と日を確認してください。" });
    }
    if (Date.UTC(value.year, value.month - 1, value.day) > Date.UTC(today.year, today.month - 1, today.day)) {
      ctx.addIssue({ code: "custom", path: ["year"], message: "未来の日付になっています。生年月日を確認してください。" });
    }
  });
}

/** Gregorian civil date, midnight boundary. UTC is only an integer day counter,
 * not a conversion of a person's birth time. No device-timezone or DST dependency.
 * 2000-01-07 = 甲子 (index 0). Tests cross-check an independent calendar library.
 * Scope is 1900–2100; no year/hour pillars or solar-term approximation.
 */
export function dayPillar(date: BirthDate) {
  const days = Math.floor((Date.UTC(date.year, date.month - 1, date.day) - Date.UTC(2000, 0, 7)) / 86_400_000);
  const index = mod(days, 60);
  return { stem: STEMS[index % 10], branch: BRANCHES[index % 12], cycleIndex: index };
}
/** Month branch by calendar month (1月=丑 … 12月=子). Deliberately ignores 節入り, so days
 * before each month's 節入り keep that calendar month's branch. */
export function monthBranch(date: BirthDate): Branch {
  return BRANCHES[date.month % 12];
}
