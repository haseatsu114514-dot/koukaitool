import { z } from "zod";
import { SETSUIRI_FIRST_YEAR, SETSUIRI_JST } from "./setsuiri";

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
 * Scope is 1900–2100; no year/hour pillars.
 */
export function dayPillar(date: BirthDate) {
  const days = Math.floor((Date.UTC(date.year, date.month - 1, date.day) - Date.UTC(2000, 0, 7)) / 86_400_000);
  const index = mod(days, 60);
  return { stem: STEMS[index % 10], branch: BRANCHES[index % 12], cycleIndex: index };
}
export type BirthTime = { hour: number; minute: number };
/** Birth time is not asked, so a birth on the 節入り day itself is judged as if born at noon. */
export const UNKNOWN_BIRTH_TIME: BirthTime = { hour: 12, minute: 0 };
/** JST moment of the 節 that falls in this calendar month (1月小寒, 2月立春 … 12月大雪). */
export function setsuiri(year: number, month: number) {
  const entry = SETSUIRI_JST[year - SETSUIRI_FIRST_YEAR].split(" ")[month - 1];
  return { day: Number(entry.slice(0, 2)), hour: Number(entry.slice(2, 4)), minute: Number(entry.slice(4, 6)) };
}
/** Month branch switches at each month's JST 節入り (小寒=丑, 立春=寅 … 大雪=子);
 * days before it still belong to the previous month's branch. */
export function monthBranch(date: BirthDate, time: BirthTime = UNKNOWN_BIRTH_TIME): Branch {
  const start = setsuiri(date.year, date.month);
  const started = date.day > start.day || (date.day === start.day && time.hour * 60 + time.minute >= start.hour * 60 + start.minute);
  return BRANCHES[mod(date.month - (started ? 0 : 1), 12)];
}
