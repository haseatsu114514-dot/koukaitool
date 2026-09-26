import { z } from "zod";
import { BRANCHES, STEMS } from "./diagnosis/calendar";
import { RULE_VERSION, type DiagnosisResult } from "./diagnosis";
import { mainQiProvider, tenGod } from "./diagnosis/ten-gods";
import { RESULT_KEY as key } from "./result-key";
let memoryResult: DiagnosisResult | null = null;
/** True only between a fresh diagnosis and the first result render, so the book-opening intro never replays on reload. */
let revealPending = false;
export const isRevealPending = () => revealPending;
export function clearRevealPending() { revealPending = false; }
const storedSchema = z.object({ ruleVersion: z.literal(RULE_VERSION), pillar: z.object({ stem: z.enum(STEMS), branch: z.enum(BRANCHES), cycleIndex: z.number().int().min(0).max(59) }), monthBranch: z.enum(BRANCHES) });
/** Kept in this browser until the visitor clears it, so "マイファイル" is still there next time. Only the derived pillar and month branch are stored. */
export function saveResult(result: DiagnosisResult) {
  memoryResult = result;
  revealPending = true;
  try { localStorage.setItem(key, JSON.stringify({ ruleVersion: result.ruleVersion, pillar: result.pillar, monthBranch: result.monthBranch })); sessionStorage.removeItem(key); } catch { /* Private browsing: client navigation still works through memory. */ }
}
export function clearResult() {
  memoryResult = null; revealPending = false;
  try { localStorage.removeItem(key); sessionStorage.removeItem(key); } catch { /* nothing stored */ }
}
/** The stored text, moving a result saved by an earlier version (sessionStorage) into localStorage. */
function storedText(): string | null {
  const saved = localStorage.getItem(key);
  if (saved !== null) return saved;
  const legacy = sessionStorage.getItem(key);
  if (legacy !== null) { localStorage.setItem(key, legacy); sessionStorage.removeItem(key); }
  return legacy;
}
export function readResult(): DiagnosisResult | null {
  if (memoryResult) return memoryResult;
  try {
    const parsed = storedSchema.safeParse(JSON.parse(storedText() || "null"));
    if (!parsed.success) return null;
    const { pillar } = parsed.data;
    if (STEMS[pillar.cycleIndex % 10] !== pillar.stem || BRANCHES[pillar.cycleIndex % 12] !== pillar.branch) return null;
    const hiddenStem = mainQiProvider.select(parsed.data.monthBranch);
    return { ...parsed.data, hiddenStem, tenGod: tenGod(pillar.stem, hiddenStem), providerId: mainQiProvider.id, scope: "month-branch" };
  } catch { return null; }
}
