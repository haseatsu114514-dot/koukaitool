import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CHARACTER_TYPES, typeBySlug } from "@/data/types";
import { Profile } from "@/components/profile";
export const dynamicParams = false;
export function generateStaticParams() { return CHARACTER_TYPES.map(type => ({ slug: type.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const type = typeBySlug((await params).slug); if (!type) return {};
  return { title: type.displayName, description: type.shortCatch, openGraph: { title: `${type.displayName}｜ステラファイル`, description: type.shortCatch }, twitter: { card: "summary", title: type.displayName, description: type.shortCatch } };
}
export default async function TypePage({ params }: { params: Promise<{ slug: string }> }) {
  const type = typeBySlug((await params).slug); if (!type) notFound();
  return <Profile type={type} />;
}
