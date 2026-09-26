import type { StellaLevel } from "@/lib/diagnosis/compatibility";

/** Labels and one-line notes for each compatibility level, shared by the 相性 chapter and the friend check. */
export const COMPATIBILITY_COPY: Record<StellaLevel | "same", { label: string; note: string }> = {
  best: { label: "最高の相性", note: "自然と惹かれ合う組み合わせ。一緒にいると、お互いの足りないところを補えます。" },
  good: { label: "相性がいい", note: "あなたを後ろから支えてくれる相手。そばにいると力が出やすくなります。" },
  mid: { label: "そこそこ", note: "付かず離れずの関係。無理に合わせなくて大丈夫です。" },
  foe: { label: "天敵", note: "考え方がぶつかりやすい相手。言い方をひと工夫するだけで、ずいぶんラクになります。" },
  same: { label: "同じタイプ", note: "似た者同士。わかり合いやすいぶん、つまずくところも同じです。" },
};

/** Levels the site always shows; the others wait on the official LINE once it is set up. */
export const OPEN_LEVELS: (StellaLevel | "same")[] = ["best", "good", "same"];
