"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

// Webhooks arrive at least once, on any lane, sometimes twice. The inbox lets each event through once
// and fans it out to the ledger, the overlay and chat. Redeliveries are drawn as rings and dropped at the gate.

interface Pt {
  x: number;
  y: number;
}
type Curve = [Pt, Pt, Pt, Pt];

interface Incoming {
  id: number;
  lane: number;
  t: number;
  duration: number;
  redelivery: boolean;
}

interface Outgoing {
  lane: number;
  t: number;
}

interface Burst {
  x: number;
  y: number;
  age: number;
  kind: "accept" | "drop";
}

const IN_LANES = 5;
const EXITS = ["ledger", "overlay", "chat"];
const GATE_W = 70;
const GATE_H = 34;

function bezier([a, b, c, d]: Curve, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

function geometry(w: number, h: number) {
  const gate = { x: w * 0.5, y: h * 0.5 };
  const gateLeft = gate.x - GATE_W / 2;
  const gateRight = gate.x + GATE_W / 2;
  const inLanes: Curve[] = Array.from({ length: IN_LANES }, (_, k) => {
    const y = h * (0.1 + (0.8 * k) / (IN_LANES - 1));
    return [
      { x: 0, y },
      { x: w * 0.24, y },
      { x: w * 0.3, y: gate.y },
      { x: gateLeft, y: gate.y },
    ];
  });
  const exitLanes: Curve[] = EXITS.map((_, j) => {
    const y = h * (0.2 + 0.3 * j);
    return [
      { x: gateRight, y: gate.y },
      { x: gateRight + w * 0.14, y: gate.y },
      { x: gateRight + w * 0.18, y },
      { x: w, y },
    ];
  });
  return { gate, inLanes, exitLanes };
}

export function HeroFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deliveredRef = useRef<HTMLSpanElement>(null);
  const processedRef = useRef<HTMLSpanElement>(null);
  const droppedRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const palette = {
      rule: color("--rule-2"),
      panel: color("--ink-2"),
      muted: color("--muted"),
      amber: color("--amber"),
      mint: color("--mint"),
    };
    const mono = color("--font-mono") || "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let geo = geometry(1, 1);

    let incoming: Incoming[] = [];
    let outgoing: Outgoing[] = [];
    let bursts: Burst[] = [];
    let pending: { at: number; item: Incoming }[] = [];
    const seen = new Set<number>();
    let clock = 0;
    let nextSpawn = 0;
    let nextId = 1;
    let gateGlow = 0;
    const totals = { delivered: 0, processed: 0, dropped: 0 };

    // Deterministic pseudo-random numbers so the reduced-motion still frame is the same on every load.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const spawn = () => {
      const id = nextId++;
      const lane = Math.floor(rand() * IN_LANES);
      incoming.push({ id, lane, t: 0, duration: 2300 + rand() * 900, redelivery: false });
      totals.delivered++;
      if (rand() < 0.38) {
        const other = (lane + 1 + Math.floor(rand() * (IN_LANES - 1))) % IN_LANES;
        pending.push({ at: clock + 250 + rand() * 1100, item: { id, lane: other, t: 0, duration: 2300 + rand() * 900, redelivery: true } });
      }
    };

    const step = (dt: number) => {
      clock += dt;
      if (clock >= nextSpawn) {
        spawn();
        nextSpawn = clock + 420 + rand() * 520;
      }
      const due = pending.filter((p) => p.at <= clock);
      if (due.length) {
        pending = pending.filter((p) => p.at > clock);
        for (const p of due) {
          incoming.push(p.item);
          totals.delivered++;
        }
      }

      const arrived: Incoming[] = [];
      for (const p of incoming) {
        p.t += dt / p.duration;
        if (p.t >= 1) arrived.push(p);
      }
      if (arrived.length) {
        incoming = incoming.filter((p) => p.t < 1);
        for (const p of arrived) {
          const at = { x: geo.gate.x - GATE_W / 2, y: geo.gate.y };
          if (seen.has(p.id)) {
            totals.dropped++;
            bursts.push({ ...at, age: 0, kind: "drop" });
          } else {
            seen.add(p.id);
            if (seen.size > 200) seen.delete(seen.values().next().value!);
            totals.processed++;
            gateGlow = 1;
            bursts.push({ x: geo.gate.x + GATE_W / 2, y: geo.gate.y, age: 0, kind: "accept" });
            for (let j = 0; j < EXITS.length; j++) outgoing.push({ lane: j, t: 0 });
          }
        }
      }

      for (const o of outgoing) o.t += dt / 1500;
      outgoing = outgoing.filter((o) => o.t < 1);
      for (const b of bursts) b.age += dt;
      bursts = bursts.filter((b) => b.age < 700);
      gateGlow = Math.max(0, gateGlow - dt / 600);
    };

    const stroke = (curve: Curve) => {
      ctx.beginPath();
      ctx.moveTo(curve[0].x, curve[0].y);
      ctx.bezierCurveTo(curve[1].x, curve[1].y, curve[2].x, curve[2].y, curve[3].x, curve[3].y);
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.rule;
      geo.inLanes.forEach(stroke);
      geo.exitLanes.forEach(stroke);

      for (const o of outgoing) {
        const lane = geo.exitLanes[o.lane];
        for (let k = 3; k >= 0; k--) {
          const pt = bezier(lane, Math.max(0, o.t - k * 0.018));
          ctx.globalAlpha = k === 0 ? 1 : 0.28 - k * 0.06;
          ctx.fillStyle = palette.mint;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      for (const p of incoming) {
        const pt = bezier(geo.inLanes[p.lane], p.t);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.redelivery ? 4.2 : 4, 0, Math.PI * 2);
        if (p.redelivery) {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = palette.amber;
          ctx.stroke();
        } else {
          ctx.fillStyle = palette.amber;
          ctx.fill();
        }
      }

      for (const b of bursts) {
        const k = b.age / 700;
        ctx.globalAlpha = 1 - k;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = b.kind === "accept" ? palette.mint : palette.muted;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4 + k * (b.kind === "accept" ? 18 : 12), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const gx = geo.gate.x - GATE_W / 2;
      const gy = geo.gate.y - GATE_H / 2;
      ctx.fillStyle = palette.panel;
      ctx.strokeStyle = gateGlow > 0 ? palette.mint : palette.rule;
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1 + gateGlow;
      ctx.shadowColor = palette.mint;
      ctx.shadowBlur = 18 * gateGlow;
      ctx.beginPath();
      ctx.roundRect(gx, gy, GATE_W, GATE_H, 8);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = palette.muted;
      ctx.font = `500 11px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("inbox", geo.gate.x, geo.gate.y + 0.5);

      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      geo.exitLanes.forEach((lane, j) => ctx.fillText(EXITS[j], w - 2, lane[3].y - 6));
    };

    const readout = () => {
      if (deliveredRef.current) deliveredRef.current.textContent = String(totals.delivered);
      if (processedRef.current) processedRef.current.textContent = String(totals.processed);
      if (droppedRef.current) droppedRef.current.textContent = String(totals.dropped);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = geometry(w, h);
      draw();
    };

    resize();
    // Start mid-stream rather than from an empty screen.
    for (let i = 0; i < 400; i++) step(16);
    draw();
    readout();
    document.fonts?.ready.then(draw);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    if (reduced) return () => resizeObserver.disconnect();

    let frame = 0;
    let last = 0;
    let visible = false;
    let sinceReadout = 0;

    const loop = (now: number) => {
      const dt = Math.min(48, now - (last || now));
      last = now;
      step(dt);
      draw();
      sinceReadout += dt;
      if (sinceReadout > 200) {
        readout();
        sinceReadout = 0;
      }
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    inView.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      inView.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <figure className="flow">
      <div className="flow-head" aria-hidden>
        <span>At least once in</span>
        <span>Exactly once out</span>
      </div>
      <div ref={wrapRef} className="flow-canvas">
        <canvas ref={canvasRef} aria-hidden />
      </div>
      <figcaption className="flow-readout">
        <span>
          <span ref={deliveredRef} className="num">0</span> deliveries
        </span>
        <span className="flow-ok">
          <span ref={processedRef} className="num">0</span> processed once
        </span>
        <span className="flow-drop">
          <span ref={droppedRef} className="num">0</span> redeliveries dropped
        </span>
        <span className="sr-only">
          Animation: payment webhooks arrive on several lanes, some delivered twice. An inbox lets each event through
          once and fans it out to the ledger, the stream overlay and chat. Redeliveries are dropped.
        </span>
      </figcaption>
    </figure>
  );
}
