"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/motion";

/** Fades its content in the first time it scrolls into view. Hidden only once JS has run, and never under reduced motion (see globals.css). */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true });
  return (
    <div ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
