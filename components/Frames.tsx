import type { CSSProperties } from "react";

type Shot = { src: string; w: number; h: number; travel: string };

/** A browser window showing a full-page capture that scrolls via --p or, with auto, on its own. */
export function BrowserFrame({ shot, url, alt, auto, className }: { shot: Shot; url: string; alt: string; auto?: boolean; className?: string }) {
  return (
    <div className={`browser ${className ?? ""}`}>
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
          className={`shot ${auto ? "shot-auto" : ""}`}
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={alt}
          loading={auto ? "eager" : "lazy"}
          decoding="async"
          style={{ "--travel": shot.travel } as CSSProperties}
        />
      </div>
    </div>
  );
}

export function PhoneFrame({ shot, alt, className }: { shot: Shot; alt: string; className?: string }) {
  return (
    <div className={`phone ${className ?? ""}`}>
      <div className="phone-view">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized capture */}
        <img
          className="shot shot-phone"
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ "--travel": shot.travel } as CSSProperties}
        />
      </div>
    </div>
  );
}
