import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { CHARACTER_TYPES } from "../src/data/types";
import { LOVE_COMPAT, LOVE_COPY, LOVE_GIFTS, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS } from "../src/data/love-copy";
import { TEN_GODS } from "../src/lib/diagnosis/ten-gods";

describe("love page copy", () => {
  it("covers every type with the same shape", () => {
    expect(Object.keys(LOVE_COPY).sort()).toEqual(CHARACTER_TYPES.map(type => type.slug).sort());
    for (const [slug, copy] of Object.entries(LOVE_COPY)) {
      expect(copy.aruaru, slug).toHaveLength(4);
      expect(copy.keywords, slug).toHaveLength(3);
      for (const text of [copy.catch, copy.charm, copy.win, copy.lose, copy.hint, ...copy.aruaru, ...copy.keywords]) expect(text.trim(), slug).not.toBe("");
    }
  });
  it("reads every item as a gift for love", () => {
    expect(Object.keys(LOVE_GIFTS).sort()).toEqual([...TEN_GODS].sort());
    for (const gift of Object.values(LOVE_GIFTS)) { expect(gift.title).not.toBe(""); expect(gift.text).not.toBe(""); }
  });
  it("never assumes the partner's gender and uses plain words", () => {
    const all = JSON.stringify([LOVE_COPY, LOVE_GIFTS, LOVE_COMPAT, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS]);
    for (const word of ["彼氏", "彼女", "男性", "女性", "彼が", "彼の", "日干", "通変星", "五行", "エレメント"]) expect(all, word).not.toContain(word);
  });
  it("names no other test and promises no timing, to match the LINE form", () => {
    const page = ["src/app/love/page.tsx", "src/components/love-result.tsx", "src/data/love-copy.ts"].map(path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")).join("");
    expect(page).not.toMatch(/MBTI/i);
    expect(LOVE_LINE_BENEFITS.join("")).not.toContain("時期");
  });
});
