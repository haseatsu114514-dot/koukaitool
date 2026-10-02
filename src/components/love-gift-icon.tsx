import { BrickWall, Brush, FerrisWheel, Lighthouse, Lightbulb, Magnet, MountainSnow, Puzzle, RadioTower, Rocket, type LucideIcon } from "lucide-react";
import type { TenGod } from "@/lib/diagnosis/ten-gods";

/** The love page's gift motifs (LOVE_GIFTS[god].motif), one icon each. The app keeps its own items (item-icon.tsx). */
export const GIFT_ICONS: Record<TenGod, LucideIcon> = { 比肩: MountainSnow, 劫財: Puzzle, 食神: FerrisWheel, 傷官: Brush, 偏財: RadioTower, 正財: BrickWall, 偏官: Rocket, 正官: Lighthouse, 偏印: Lightbulb, 印綬: Magnet };
