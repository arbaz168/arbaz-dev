type Shot = { src: string; w: number; h: number };

/** A browser window around a screenshot of the live site. */
export function BrowserFrame({
  shot,
  url,
  alt,
  priority,
}: {
  shot: Shot;
  url: string;
  alt: string;
  priority?: boolean;
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
          className="shot"
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </div>
    </div>
  );
}
