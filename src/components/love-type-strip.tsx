"use client";
import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

/** The ten characters: a swipeable row on phones, a plain grid on wide screens (see love.css).
 * Three cues tell a phone visitor the row scrolls: the third card peeks in at the edge; the first time the row is well in view,
 * the cards slide a little and back once (not with reduced motion, not once she has touched the row);
 * and a short progress line with "スワイプ" sits underneath and follows her position. */
export function TypeStrip({ children }: { children: React.ReactNode }) {
  const list = useRef<HTMLUListElement>(null), thumb = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = list.current; if (!node) return;
    const measure = () => { if (thumb.current) thumb.current.style.cssText = `left:${node.scrollLeft / node.scrollWidth * 100}%;width:${node.clientWidth / node.scrollWidth * 100}%`; };
    let touched = false;
    const touch = () => { touched = true; node.classList.remove("is-peeking"); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!touched && node.scrollLeft === 0 && node.scrollWidth > node.clientWidth && !matchMedia("(prefers-reduced-motion: reduce)").matches) node.classList.add("is-peeking");
    }, { threshold: 0.7 });
    measure();
    node.addEventListener("scroll", measure, { passive: true }); node.addEventListener("pointerdown", touch); addEventListener("resize", measure);
    observer.observe(node);
    return () => { node.removeEventListener("scroll", measure); node.removeEventListener("pointerdown", touch); removeEventListener("resize", measure); observer.disconnect(); };
  }, []);
  return <>
    <ul ref={list} className="lv-types lv-stagger">{children}</ul>
    <p className="lv-types-hint" aria-hidden="true"><span className="lv-types-track"><span ref={thumb} /></span>スワイプで10タイプを見る<ChevronRight size={14} strokeWidth={2.4} /></p>
  </>;
}
