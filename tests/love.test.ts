import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { CHARACTER_TYPES } from "../src/data/types";
import { LOVE_COMPAT, LOVE_COPY, LOVE_GIFTS, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS } from "../src/data/love-copy";
import { TEN_GODS } from "../src/lib/diagnosis/ten-gods";
import { NAME_ANIMALS } from "../src/components/type-name";

describe("love page copy", () => {
  it("covers every type with the same shape", () => {
    expect(Object.keys(LOVE_COPY).sort()).toEqual(CHARACTER_TYPES.map(type => type.slug).sort());
    for (const [slug, copy] of Object.entries(LOVE_COPY)) {
      expect(copy.traits, slug).toHaveLength(4);
      expect(copy.keywords, slug).toHaveLength(3);
      for (const text of [copy.catch, copy.charm, copy.win, copy.lose, copy.hint, ...copy.traits, ...copy.keywords]) expect(text.trim(), slug).not.toBe("");
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
  it("keeps to the page's words: ギフト not アイテム, no fighting talk, no school names or other tests, no timing", () => {
    const page = ["src/app/love/page.tsx", "src/components/love-result.tsx", "src/components/love-diagnosis.tsx", "src/data/love-copy.ts"].map(path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")).join("");
    for (const word of ["MBTI", "四柱推命", "アイテム", "勝ち", "負け", "武器", "戦い"]) expect(page, word).not.toContain(word);
    expect(LOVE_LINE_BENEFITS.join("")).not.toContain("時期");
  });
  it("can break every type name between its modifier and its animal", () => {
    for (const type of CHARACTER_TYPES) expect(NAME_ANIMALS.some(animal => type.displayName.endsWith(animal) && type.displayName !== animal), type.displayName).toBe(true);
  });
});
describe("love page line breaks", () => {
  it("breaks short lines after punctuation and at ｜ hints, keeping closing brackets with their punctuation", async () => {
    const { phraseSegments } = await import("../src/components/phrases");
    expect(phraseSegments("見た目より、生き方を尊敬できる人に惹かれる")).toEqual(["見た目より、", "生き方を尊敬できる人に惹かれる"]);
    expect(phraseSegments("その恋、ほかの誰かの正解を｜なぞっていませんか？")).toEqual(["その恋、", "ほかの誰かの正解を", "なぞっていませんか？"]);
    expect(phraseSegments("「一緒にいて楽しい。」が魅力")).toEqual(["「一緒にいて楽しい。」", "が魅力"]);
  });
});
