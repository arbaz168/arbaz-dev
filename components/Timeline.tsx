"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import type { TimelineEntry } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";
import { Reveal } from "./Reveal";

/** Experience in date order. The rail fills as the reader scrolls through it. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (reduced) {
      list.style.setProperty("--progress", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.7;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      list.style.setProperty("--progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <ol ref={listRef} className="timeline" style={{ "--progress": 1 } as CSSProperties}>
      {entries.map((e, i) => (
        <li key={`${e.when}-${e.title}`} className={`tl-item tl-${e.tone}`}>
          <Reveal delay={i * 40}>
            <time className="tl-when">{e.when}</time>
            <h3 className="tl-title">
              {e.title}
              <span className="tl-org">{e.org}</span>
            </h3>
            <p>{e.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
