import { birthDateSchema, dayPillar, type BirthDate } from "./calendar";
import { mainQiProvider, tenGod, type HiddenStemProvider } from "./ten-gods";
export const RULE_VERSION = "day-main-qi-1.0.0";
export function diagnose(input: BirthDate, provider: HiddenStemProvider = mainQiProvider) {
  const valid = birthDateSchema().parse(input);
  const pillar = dayPillar(valid);
  const hiddenStem = provider.select(pillar.branch);
  return { ruleVersion: RULE_VERSION, pillar, hiddenStem, tenGod: tenGod(pillar.stem, hiddenStem), scope: "day-branch" as const, providerId: provider.id };
}
export type DiagnosisResult = ReturnType<typeof diagnose>;
