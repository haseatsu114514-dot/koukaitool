"use client";
import { useEffect, useRef, useState } from "react";

/** Sticky chapter chips. The chapter in the middle of the screen is highlighted, and its chip is kept in view as the reader scrolls. */
export function ProfileToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState("");
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);
  useEffect(() => {
    const bar = nav.current, chip = bar?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);
  return <nav ref={nav} className="profile-toc" aria-label="このページの内容">
    {items.map(item => <a key={item.id} href={`#${item.id}`} className={item.id === active ? "is-active" : undefined} aria-current={item.id === active ? "location" : undefined}>{item.label}</a>)}
  </nav>;
}
