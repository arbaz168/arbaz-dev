"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/motion";

const DURATION_MS = 1600;
const format = (n: number) => n.toLocaleString("en-US");

/** Counts up to `value` the first time it is seen. The server renders the final number, so it reads correctly without JS. */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ once: true });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="counter">
      <span className="sr-only">
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden>
        {format(shown)}
        {suffix}
      </span>
    </span>
  );
}
