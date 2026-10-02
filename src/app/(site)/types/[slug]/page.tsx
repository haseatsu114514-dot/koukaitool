import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CHARACTER_TYPES, typeBySlug } from "@/data/types";
import { Profile } from "@/components/profile";
import { pageMetadata } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() { return CHARACTER_TYPES.map(type => ({ slug: type.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const type = typeBySlug((await params).slug); if (!type) return {};
  return pageMetadata({ title: type.displayName, description: `${type.shortCatch}${type.summary}`, path: `/types/${type.slug}/`, image: `/og/${type.slug}.jpg` });
}
export default async function TypePage({ params }: { params: Promise<{ slug: string }> }) {
  const type = typeBySlug((await params).slug); if (!type) notFound();
  return <Profile type={type} />;
}
