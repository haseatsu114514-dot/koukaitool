import { z } from "zod";
import { BRANCHES, STEMS } from "./diagnosis/calendar";
import { RULE_VERSION, type DiagnosisResult } from "./diagnosis";
import { mainQiProvider, tenGod } from "./diagnosis/ten-gods";
const key = "stella-result-v1";
let memoryResult: DiagnosisResult | null = null;
const storedSchema = z.object({ ruleVersion: z.literal(RULE_VERSION), pillar: z.object({ stem: z.enum(STEMS), branch: z.enum(BRANCHES), cycleIndex: z.number().int().min(0).max(59) }) });
export function saveResult(result: DiagnosisResult) {
  memoryResult = result;
  try { sessionStorage.setItem(key, JSON.stringify({ ruleVersion: result.ruleVersion, pillar: result.pillar })); } catch { /* Private browsing: client navigation still works through memory. */ }
}
export function readResult(): DiagnosisResult | null {
  if (memoryResult) return memoryResult;
  try {
    const parsed = storedSchema.safeParse(JSON.parse(sessionStorage.getItem(key) || "null"));
    if (!parsed.success) return null;
    const { pillar } = parsed.data;
    if (STEMS[pillar.cycleIndex % 10] !== pillar.stem || BRANCHES[pillar.cycleIndex % 12] !== pillar.branch) return null;
    const hiddenStem = mainQiProvider.select(pillar.branch);
    return { ...parsed.data, hiddenStem, tenGod: tenGod(pillar.stem, hiddenStem), providerId: mainQiProvider.id, scope: "day-branch" };
  } catch { return null; }
}
