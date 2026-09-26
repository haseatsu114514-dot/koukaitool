import { birthDateSchema, dayPillar, monthBranch, type BirthDate } from "./calendar";
import { mainQiProvider, tenGod, type HiddenStemProvider } from "./ten-gods";
export const RULE_VERSION = "month-main-qi-1.0.0";
export function diagnose(input: BirthDate, provider: HiddenStemProvider = mainQiProvider) {
  const valid = birthDateSchema().parse(input);
  const pillar = dayPillar(valid);
  const branch = monthBranch(valid);
  const hiddenStem = provider.select(branch);
  return { ruleVersion: RULE_VERSION, pillar, monthBranch: branch, hiddenStem, tenGod: tenGod(pillar.stem, hiddenStem), scope: "month-branch" as const, providerId: provider.id };
}
export type DiagnosisResult = ReturnType<typeof diagnose>;
