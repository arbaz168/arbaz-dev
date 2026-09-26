"use client";

import { useEffect, useReducer } from "react";
import {
  type DeliverySpec,
  type SimState,
  MAX_ATTEMPTS,
  deliver,
  deliverLater,
  initialState,
  isActive,
  newEventId,
  tick,
} from "@/lib/webhookSim";

const TICK_MS = 100;

type Scenario = "normal" | "duplicate" | "twoIds" | "early" | "wrongAmount" | "crash";

type Action = { type: "scenario"; scenario: Scenario } | { type: "tick" } | { type: "reset" };

const SCENARIOS: { id: Scenario; label: string; hint: string }[] = [
  { id: "normal", label: "Deliver a payment", hint: "Stored first, processed by a worker" },
  { id: "duplicate", label: "Provider retries", hint: "Same event delivered twice" },
  { id: "twoIds", label: "Same payment, two event ids", hint: "Handler has to be idempotent" },
  { id: "early", label: "Arrives before checkout", hint: "Retried with backoff" },
  { id: "wrongAmount", label: "Wrong amount", hint: "Permanent failure, no retries" },
  { id: "crash", label: "Worker crashes", hint: "Lease expires, another worker takes over" },
];

function run(state: SimState, scenario: Scenario): SimState {
  const paymentId = `pay_${100 + state.nextEvent}`;
  const [eventId, s] = newEventId(state);
  const spec: DeliverySpec = { eventId, paymentId };

  switch (scenario) {
    case "normal":
      return deliver(s, spec);
    case "duplicate":
      return deliverLater(deliver(s, spec), spec, 600);
    case "twoIds": {
      const [secondId, s2] = newEventId(s);
      return deliverLater(deliver(s2, spec), { eventId: secondId, paymentId }, 2_000);
    }
    case "early":
      return deliver(s, { ...spec, transientFailures: 2 });
    case "wrongAmount":
      return deliver(s, { ...spec, permanentFailure: true });
    case "crash":
      return deliver(s, { ...spec, crashOnFirstClaim: true });
  }
}

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case "scenario":
      return run(state, action.scenario);
    case "tick":
      return tick(state, TICK_MS);
    case "reset":
      return initialState();
  }
}

export function WebhookSimulator() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const active = isActive(state);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <div className="sim">
      <div className="sim-controls">
        {SCENARIOS.map((s) => (
          <button key={s.id} className="sim-button" onClick={() => dispatch({ type: "scenario", scenario: s.id })}>
            <span>{s.label}</span>
            <small>{s.hint}</small>
          </button>
        ))}
        <button className="sim-reset" onClick={() => dispatch({ type: "reset" })} disabled={state.rows.length === 0}>
          Reset
        </button>
      </div>

      <div className="sim-panels">
        <div className="sim-panel">
          <div className="sim-panel-head">
            <h3>Inbox table</h3>
            <span className="sim-workers">
              {state.workers.map((w) => (
                <span key={w.id} className={`sim-worker ${w.downUntil > 0 ? "down" : ""}`} title={w.downUntil > 0 ? "Down" : "Polling"}>
                  {w.id}
                </span>
              ))}
            </span>
          </div>
          {state.rows.length === 0 ? (
            <p className="sim-empty">Pick a scenario to send a signed webhook.</p>
          ) : (
            <div className="sim-table-wrap">
              <table className="sim-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Tries</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {[...state.rows].reverse().map((row) => (
                    <tr key={row.eventId}>
                      <td className="mono">{row.eventId}</td>
                      <td className="mono">
                        {row.paymentId}
                        <span className={`sim-pay ${state.payments[row.paymentId] === "Paid" ? "paid" : ""}`}>
                          {state.payments[row.paymentId]}
                        </span>
                      </td>
                      <td>
                        <span className={`sim-status ${row.status.toLowerCase()}`}>{row.status === "DeadLettered" ? "Dead letter" : row.status}</span>
                      </td>
                      <td className="mono">
                        {row.attempts}/{MAX_ATTEMPTS}
                      </td>
                      <td className="sim-detail">{detail(row, state.now)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="sim-panel">
          <div className="sim-panel-head">
            <h3>What happened</h3>
          </div>
          <ol className="sim-log" aria-live="polite">
            {state.log.map((line) => (
              <li key={line.id} className={line.tone}>
                <span className="mono">{(line.at / 1000).toFixed(1)}s</span> {line.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function detail(row: SimState["rows"][number], now: number): string {
  if (row.status === "Processing") {
    return row.lockedUntil > now ? `${row.lockedBy}, lease ${((row.lockedUntil - now) / 1000).toFixed(1)}s` : "lease expired";
  }
  if (row.status === "Pending" && row.nextAttemptAt > now) {
    return `retry in ${((row.nextAttemptAt - now) / 1000).toFixed(1)}s`;
  }
  if (row.status === "Pending") return "waiting for a worker";
  if (row.status === "DeadLettered") return "needs an operator";
  return "done";
}
