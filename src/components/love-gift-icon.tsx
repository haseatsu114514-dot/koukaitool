import { BookOpenText, BrickWall, Crown, Dumbbell, FerrisWheel, KeyRound, Lightbulb, Pencil, Rocket, Smartphone, type LucideIcon } from "lucide-react";
import type { TenGod } from "@/lib/diagnosis/ten-gods";

/** The love page's gift motifs (LOVE_GIFTS[god].motif), one icon each. The dumbbell is turned level in love.css so it reads at a small size;
 * the book is the open book with lines of text, which reads as a book better than the bare outline. */
export const GIFT_ICONS: Record<TenGod, LucideIcon> = { 比肩: Dumbbell, 劫財: Crown, 食神: FerrisWheel, 傷官: Pencil, 偏財: Smartphone, 正財: BrickWall, 偏官: Rocket, 正官: KeyRound, 偏印: Lightbulb, 印綬: BookOpenText };
