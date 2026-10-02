import { BookOpen, BrickWall, Crown, Dumbbell, FerrisWheel, KeyRound, Lightbulb, MessagesSquare, Rocket, Rose, type LucideIcon } from "lucide-react";
import type { TenGod } from "@/lib/diagnosis/ten-gods";

/** The love page's gift images (LOVE_GIFTS[god].motif), one icon each. Where the image keeps the app's item, so does the icon (item-icon.tsx). */
export const GIFT_ICONS: Record<TenGod, LucideIcon> = { 比肩: Dumbbell, 劫財: Crown, 食神: FerrisWheel, 傷官: Rose, 偏財: MessagesSquare, 正財: BrickWall, 偏官: Rocket, 正官: KeyRound, 偏印: Lightbulb, 印綬: BookOpen };
