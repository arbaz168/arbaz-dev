import type { CSSProperties } from "react";

type Shot = { src: string; w: number; h: number; travel?: string };

/** A browser window around a screenshot of the live site. */
export function BrowserFrame({
  shot,
  url,
  alt,
  priority,
  auto,
}: {
  shot: Shot;
  url: string;
  alt: string;
  priority?: boolean;
  /** Scrolls the capture on its own, like someone reading the page. */
  auto?: boolean;
}) {
  return (
    <div className="browser">
      <div className="browser-bar" aria-hidden>
        <span className="browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-url">{url}</span>
      </div>
      <div className="browser-view">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized capture */}
        <img
          className={`shot${auto ? " shot-auto" : ""}`}
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          style={auto ? ({ "--travel": shot.travel } as CSSProperties) : undefined}
        />
      </div>
    </div>
  );
}
