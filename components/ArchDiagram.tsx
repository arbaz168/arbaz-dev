"use client";

import type { CSSProperties } from "react";
import { useInView, useReducedMotion } from "@/lib/motion";

type Tone = "flow" | "ok" | "aux";

export interface DiagramNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  tone?: Tone;
}

export interface DiagramEdge {
  from: string;
  to: string;
  tone: Tone;
  label?: string;
  /** Forces the edge to leave and enter through the top or bottom. */
  via?: "v";
}

export interface DiagramLayout {
  w: number;
  h: number;
  nodeW?: number;
  nodeH?: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/** A wide layout for desktop and a tall one for phones, so labels stay readable at every width. */
export interface Diagram {
  wide: DiagramLayout;
  tall: DiagramLayout;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Route {
  d: string;
  mid: { x: number; y: number };
}

function route(a: Box, b: Box, forceVertical: boolean): Route {
  const acx = a.x + a.w / 2;
  const acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + b.h / 2;
  const hGap = b.x > a.x + a.w || a.x > b.x + b.w;
  const horizontal = !forceVertical && hGap;

  let p0, p1, p2, p3;
  if (horizontal) {
    const sx = bcx > acx ? a.x + a.w : a.x;
    const ex = bcx > acx ? b.x : b.x + b.w;
    const mx = (sx + ex) / 2;
    [p0, p1, p2, p3] = [
      { x: sx, y: acy },
      { x: mx, y: acy },
      { x: mx, y: bcy },
      { x: ex, y: bcy },
    ];
  } else {
    const sy = bcy > acy ? a.y + a.h : a.y;
    const ey = bcy > acy ? b.y : b.y + b.h;
    const my = (sy + ey) / 2;
    [p0, p1, p2, p3] = [
      { x: acx, y: sy },
      { x: acx, y: my },
      { x: bcx, y: my },
      { x: bcx, y: ey },
    ];
  }

  return {
    d: `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`,
    mid: { x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8, y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8 },
  };
}

function Layout({ layout, variant, title, live }: { layout: DiagramLayout; variant: "wide" | "tall"; title: string; live: boolean }) {
  const w = layout.nodeW ?? 160;
  const h = layout.nodeH ?? 58;
  const boxes = new Map(layout.nodes.map((n) => [n.id, { x: n.x, y: n.y, w, h }]));
  const prefix = `${title.replace(/\W+/g, "-")}-${variant}`;

  return (
    <svg className={`diagram-svg diagram-${variant}`} viewBox={`0 0 ${layout.w} ${layout.h}`} role="img" aria-label={title}>
      <defs>
        {(["flow", "ok", "aux"] as const).map((tone) => (
          <marker key={tone} id={`${prefix}-arrow-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 9 5 L 1 9" className={`arrow arrow-${tone}`} />
          </marker>
        ))}
      </defs>

      {layout.edges.map((e, i) => {
        const r = route(boxes.get(e.from)!, boxes.get(e.to)!, e.via === "v");
        const id = `${prefix}-edge-${i}`;
        return (
          <g key={id} className={`edge edge-${e.tone}`} style={{ "--i": i } as CSSProperties}>
            <path id={id} d={r.d} pathLength={1} className="edge-line" markerEnd={`url(#${prefix}-arrow-${e.tone})`} />
            {live && e.tone !== "aux" && (
              <circle r={variant === "wide" ? 4 : 3.5} className="packet">
                <animateMotion dur={`${2.2 + (i % 3) * 0.35}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
            )}
            {e.label && (
              <text x={r.mid.x} y={r.mid.y + 4} className="edge-label" textAnchor="middle">
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {layout.nodes.map((n, i) => (
        <g key={n.id} className={`node node-${n.tone ?? "plain"}`} style={{ "--i": i } as CSSProperties}>
          <rect x={n.x} y={n.y} width={w} height={h} rx={10} />
          <rect x={n.x} y={n.y + 12} width={3} height={h - 24} rx={1.5} className="node-tick" />
          <text x={n.x + 16} y={n.y + h / 2 - 3} className="node-label">
            {n.label}
          </text>
          <text x={n.x + 16} y={n.y + h / 2 + 15} className="node-sub">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Architecture diagram whose connections draw in when scrolled to, then carry moving packets while on screen. */
export function ArchDiagram({ diagram, title }: { diagram: Diagram; title: string }) {
  const [ref, inView, drawn] = useInView<HTMLDivElement>({ rootMargin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;

  return (
    <figure ref={ref} className={`diagram ${drawn ? "drawn" : ""}`}>
      <Layout layout={diagram.wide} variant="wide" title={title} live={live} />
      <Layout layout={diagram.tall} variant="tall" title={title} live={live} />
      <figcaption className="diagram-key">
        <span className="key key-flow">In flight</span>
        <span className="key key-ok">Committed or delivered</span>
        <span className="key key-aux">Background or admin</span>
      </figcaption>
    </figure>
  );
}
