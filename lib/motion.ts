"use client";

import { type RefObject, useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(REDUCED);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True when the visitor asked for reduced motion. Assumed true during server rendering so nothing animates before hydration. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => true,
  );
}

/**
 * Tracks whether an element is on screen, and whether it has ever been.
 * With `once`, observation stops at the first sighting.
 */
export function useInView<T extends Element>(
  { once = false, rootMargin = "0px 0px -10% 0px", threshold = 0 }: { once?: boolean; rootMargin?: string; threshold?: number } = {},
): [RefObject<T | null>, boolean, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) return;
        setSeen(true);
        if (once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView, seen];
}
