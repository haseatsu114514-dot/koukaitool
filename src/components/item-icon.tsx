import { Bike, BookOpen, CalendarCheck, Cookie, Crown, Dumbbell, KeyRound, Rose, Smartphone, Telescope, type LucideIcon } from "lucide-react";
import type { TenGod } from "@/lib/diagnosis/ten-gods";

export const ITEM_ICONS: Record<TenGod, LucideIcon> = { 比肩: Dumbbell, 劫財: Crown, 食神: Cookie, 傷官: Rose, 偏財: Smartphone, 正財: CalendarCheck, 偏官: Bike, 正官: KeyRound, 偏印: Telescope, 印綬: BookOpen };
