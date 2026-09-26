"use client";

import { type ReactNode, useEffect, useRef } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A product section whose preview scrolls with the page. Sets --p (0 to 1) on the section:
 * while the stage is sticky, progress runs across the time it stays pinned; on small screens,
 * where it is not sticky, progress runs while the stage crosses the viewport.
 */
export function ScrollShot({ id, className, labelledBy, children }: { id: string; className?: string; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const stage = el?.querySelector<HTMLElement>("[data-stage]");
    const track = el?.querySelector<HTMLElement>("[data-track]");
    if (!el || !stage || !track || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const s = getComputedStyle(stage);
      let p: number;
      if (s.position === "sticky") {
        const r = track.getBoundingClientRect();
        const top = parseFloat(s.top) || 0;
        p = (top - r.top) / Math.max(1, r.height - stage.offsetHeight);
      } else {
        const r = stage.getBoundingClientRect();
        p = (vh * 0.85 - r.top) / (vh * 0.7 + r.height);
      }
      el.style.setProperty("--p", clamp01(p).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
