import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { CHARACTER_TYPES, groupName } from "../src/data/types";
import { LOVE_COMPAT, LOVE_COPY, LOVE_GIFTS, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS, LOVE_READER, LOVE_TEASERS } from "../src/data/love-copy";
import { TEN_GODS } from "../src/lib/diagnosis/ten-gods";
import { NAME_ANIMALS } from "../src/components/type-name";

describe("love page copy", () => {
  it("covers every type with the same shape", () => {
    expect(Object.keys(LOVE_COPY).sort()).toEqual(CHARACTER_TYPES.map(type => type.slug).sort());
    for (const [slug, copy] of Object.entries(LOVE_COPY)) {
      expect(copy.traits, slug).toHaveLength(4);
      expect(copy.keywords, slug).toHaveLength(3);
      for (const text of [copy.catch, copy.charm, copy.win, copy.lose, copy.hint, ...copy.traits, ...copy.keywords]) expect(text.trim(), slug).not.toBe("");
      // The keywords sit right under the catch on the result card, so each one adds something the catch does not already say.
      for (const keyword of copy.keywords) expect(copy.catch, `${slug}: ${keyword}`).not.toContain(keyword);
    }
  });
  it("names in the result what only the LINE reading tells, and promises it in the invitation", () => {
    const plain = (text: string) => text.replaceAll("｜", "");
    expect(LOVE_LINE_BENEFITS.map(plain)).toContain(plain(LOVE_TEASERS.brake.title));
  });
  it("reads every item as a gift for love", () => {
    expect(Object.keys(LOVE_GIFTS).sort()).toEqual([...TEN_GODS].sort());
    for (const gift of Object.values(LOVE_GIFTS)) { expect(gift.title).not.toBe(""); expect(gift.text).not.toBe(""); }
  });
  it("names every gift as a talent, so the app's item reads as its motif and not as a lucky item", () => {
    const names = Object.values(LOVE_GIFTS).map(gift => gift.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) { expect(name).toMatch(/才能$/); expect([...name].length, name).toBeLessThanOrEqual(10); }
    // The motif is a short object name shown small ("モチーフ：〇〇"); the talent's name carries the meaning.
    const motifs = Object.values(LOVE_GIFTS).map(gift => gift.motif);
    expect(new Set(motifs).size).toBe(motifs.length);
    for (const motif of motifs) expect([...motif].length, motif).toBeLessThanOrEqual(6);
    expect(JSON.stringify(LOVE_GIFTS)).not.toContain("ラッキー");
  });
  it("names every compatibility level positively", () => {
    for (const { label } of Object.values(LOVE_COMPAT)) expect(label).toMatch(/相性$/);
    const all = JSON.stringify([LOVE_COMPAT, LOVE_LINE_BENEFITS, LOVE_TEASERS]);
    for (const word of ["すれ違", "悪い", "苦手", "注意"]) expect(all, word).not.toContain(word);
  });
  it("never assumes the partner's gender and uses plain words", () => {
    const all = JSON.stringify([LOVE_COPY, LOVE_GIFTS, LOVE_COMPAT, LOVE_LINE_BENEFITS, LOVE_LINE_STEPS, LOVE_TEASERS]);
    for (const word of ["彼氏", "彼女", "男性", "女性", "彼が", "彼の", "日干", "通変星", "五行", "エレメント"]) expect(all, word).not.toContain(word);
  });
  it("keeps to the page's words: ギフト not アイテム, no fighting talk, no school names or other tests, no timing", () => {
    const page = ["src/app/love/page.tsx", "src/components/love-result.tsx", "src/components/love-diagnosis.tsx", "src/data/love-copy.ts"].map(path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")).join("");
    for (const word of ["MBTI", "四柱推命", "アイテム", "勝ち", "負け", "武器", "戦い"]) expect(page, word).not.toContain(word);
    expect(JSON.stringify([LOVE_LINE_BENEFITS, LOVE_TEASERS])).not.toContain("時期");
  });
  it("can break every type name between its modifier and its animal", () => {
    for (const type of CHARACTER_TYPES) expect(NAME_ANIMALS.some(animal => type.displayName.endsWith(animal) && type.displayName !== animal), type.displayName).toBe(true);
  });
});
describe("love page line breaks", () => {
  it("breaks between phrases (so lines can be balanced), after punctuation and at ｜ hints, and keeps the text whole", async () => {
    const { phraseSegments } = await import("../src/components/phrases");
    const segments = phraseSegments("見た目より、生き方を尊敬できる人に惹かれる");
    expect(segments.join("")).toBe("見た目より、生き方を尊敬できる人に惹かれる");
    expect(segments[0]).toBe("見た目より、");
    expect(segments.length).toBeGreaterThan(2);
    expect(phraseSegments("その恋、ほかの誰かの正解を｜なぞっていませんか？").join("")).toBe("その恋、ほかの誰かの正解をなぞっていませんか？");
    expect(phraseSegments("その恋、ほかの誰かの正解を｜なぞっていませんか？").at(-1)).toBe("なぞっていませんか？");
    expect(phraseSegments("「一緒にいて楽しい。」が魅力").some(part => part.startsWith("」"))).toBe(false);
  });
  it("never breaks inside a kept word or a short quote, before closing punctuation, or into a one-character piece, anywhere in the copy", async () => {
    const { phraseSegments, KEEP_WHOLE } = await import("../src/components/phrases");
    const copy = [
      ...Object.values(LOVE_COPY).flatMap(c => [c.catch, c.charm, c.win, c.lose, c.hint, ...c.traits]),
      ...Object.values(LOVE_GIFTS).flatMap(g => [g.title, g.text]), ...Object.values(LOVE_COMPAT).map(c => c.note),
      ...LOVE_LINE_BENEFITS, ...LOVE_LINE_STEPS, ...Object.values(LOVE_TEASERS).flatMap(t => Object.values(t)), LOVE_READER.note,
    ];
    for (const text of copy) {
      const segments = phraseSegments(text), plain = text.replaceAll("｜", "");
      expect(segments.join(""), text).toBe(plain);
      const cuts = new Set<number>(); let at = 0;
      for (const part of segments.slice(0, -1)) cuts.add(at += part.length);
      for (const word of [...KEEP_WHOLE, "「恋の正解」"]) for (let i = plain.indexOf(word); i >= 0; i = plain.indexOf(word, i + 1))
        for (let c = i + 1; c < i + word.length; c++) expect(cuts.has(c), `${text}: ${word}`).toBe(false);
      for (const part of segments) { expect("、。！？」』）ー".includes(part[0]), `${text}: ${part}`).toBe(false); expect([...part].length > 1 || segments.length === 1, `${text}: ${part}`).toBe(true); }
    }
  });
});
describe("character order", () => {
  it("lists the ten characters in five-element order: green, red, yellow, white, blue (every row of faces follows it)", () => {
    expect(CHARACTER_TYPES.map(type => groupName(type.stem).replace("グループ", "")).join("")).toBe("緑緑赤赤黄黄白白青青");
  });
});
