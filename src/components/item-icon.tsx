import { BookOpen, CalendarCheck, CalendarClock, Cookie, Crown, Dumbbell, Rose, Smartphone, Telescope, Watch, type LucideIcon } from "lucide-react";
import type { TenGod } from "@/lib/diagnosis/ten-gods";

export const ITEM_ICONS: Record<TenGod, LucideIcon> = { 比肩: Dumbbell, 劫財: Crown, 食神: Cookie, 傷官: Rose, 偏財: Smartphone, 正財: CalendarCheck, 偏官: CalendarClock, 正官: Watch, 偏印: Telescope, 印綬: BookOpen };
