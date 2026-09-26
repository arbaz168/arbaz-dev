// A browser-only model of the webhook inbox pattern from github.com/arbaz168/aspnetcore-webhook-inbox.
// Times are compressed so each behaviour plays out in a few seconds.

export type RowStatus = "Pending" | "Processing" | "Processed" | "DeadLettered";

export interface InboxRow {
  eventId: string;
  paymentId: string;
  status: RowStatus;
  attempts: number;
  nextAttemptAt: number;
  lockedBy: string | null;
  lockedUntil: number;
  finishAt: number;
  transientFailuresLeft: number;
  permanentFailure: boolean;
  crashOnNextClaim: boolean;
}

export interface Worker {
  id: string;
  downUntil: number;
}

export type LogTone = "info" | "ok" | "warn" | "error";

export interface LogLine {
  id: number;
  at: number;
  text: string;
  tone: LogTone;
}

export interface SimState {
  now: number;
  rows: InboxRow[];
  payments: Record<string, "Pending" | "Paid">;
  workers: Worker[];
  log: LogLine[];
  nextLogId: number;
  nextEvent: number;
  scheduled: { at: number; spec: DeliverySpec }[];
}

export interface DeliverySpec {
  eventId: string;
  paymentId: string;
  transientFailures?: number;
  permanentFailure?: boolean;
  crashOnFirstClaim?: boolean;
}

export const MAX_ATTEMPTS = 4;
const HANDLER_MS = 900;
const LEASE_MS = 3_000;
const BASE_RETRY_MS = 1_500;
const WORKER_RESTART_MS = 6_000;

export function initialState(): SimState {
  return {
    now: 0,
    rows: [],
    payments: {},
    workers: [
      { id: "worker-1", downUntil: 0 },
      { id: "worker-2", downUntil: 0 },
    ],
    log: [],
    nextLogId: 1,
    nextEvent: 1,
    scheduled: [],
  };
}

function log(state: SimState, text: string, tone: LogTone = "info"): SimState {
  const line = { id: state.nextLogId, at: state.now, text, tone };
  return { ...state, nextLogId: state.nextLogId + 1, log: [line, ...state.log].slice(0, 40) };
}

/** The provider POSTs an event. The endpoint only verifies and stores; a unique key makes redelivery harmless. */
export function deliver(state: SimState, spec: DeliverySpec): SimState {
  if (state.rows.some((r) => r.eventId === spec.eventId)) {
    return log(state, `${spec.eventId} delivered again: 200, already stored, nothing to do`, "ok");
  }

  const row: InboxRow = {
    eventId: spec.eventId,
    paymentId: spec.paymentId,
    status: "Pending",
    attempts: 0,
    nextAttemptAt: state.now,
    lockedBy: null,
    lockedUntil: 0,
    finishAt: 0,
    transientFailuresLeft: spec.transientFailures ?? 0,
    permanentFailure: spec.permanentFailure ?? false,
    crashOnNextClaim: spec.crashOnFirstClaim ?? false,
  };

  const next = {
    ...state,
    rows: [...state.rows, row],
    payments: { ...state.payments, [spec.paymentId]: state.payments[spec.paymentId] ?? "Pending" },
  };
  return log(next, `${spec.eventId} received: signature ok, stored, 202 Accepted`);
}

/** Queues a delivery for later, the way a provider retries after its own timeout. */
export function deliverLater(state: SimState, spec: DeliverySpec, delayMs: number): SimState {
  return { ...state, scheduled: [...state.scheduled, { at: state.now + delayMs, spec }] };
}

export function newEventId(state: SimState): [string, SimState] {
  return [`evt_${String(state.nextEvent).padStart(3, "0")}`, { ...state, nextEvent: state.nextEvent + 1 }];
}

function backoff(attempts: number): number {
  return BASE_RETRY_MS * 2 ** (attempts - 1);
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

/** True while anything is still in flight, so the page can stop ticking when idle. */
export function isActive(state: SimState): boolean {
  return (
    state.scheduled.length > 0 ||
    state.workers.some((w) => w.downUntil > 0) ||
    state.rows.some((r) => r.status === "Pending" || r.status === "Processing")
  );
}

/** Advances the clock: finishes handlers, expires leases, restarts crashed workers, then lets idle workers claim. */
export function tick(state: SimState, dt: number): SimState {
  let s: SimState = { ...state, now: state.now + dt, rows: state.rows.map((r) => ({ ...r })), workers: state.workers.map((w) => ({ ...w })) };

  const arrived = s.scheduled.filter((d) => d.at <= s.now);
  if (arrived.length > 0) {
    s = { ...s, scheduled: s.scheduled.filter((d) => d.at > s.now) };
    for (const delivery of arrived) s = deliver(s, delivery.spec);
  }

  for (const worker of s.workers) {
    if (worker.downUntil > 0 && worker.downUntil <= s.now) {
      worker.downUntil = 0;
      s = log(s, `${worker.id} restarted`, "info");
    }
  }

  const alive = (id: string | null) => s.workers.some((w) => w.id === id && w.downUntil === 0);

  for (const row of s.rows) {
    if (row.status !== "Processing" || row.finishAt > s.now || !alive(row.lockedBy)) continue;

    const worker = row.lockedBy;
    row.lockedBy = null;

    if (row.permanentFailure) {
      row.status = "DeadLettered";
      s = log(s, `${row.eventId}: amount does not match the payment. Permanent failure, dead-lettered without retrying`, "error");
    } else if (row.transientFailuresLeft > 0) {
      row.transientFailuresLeft -= 1;
      if (row.attempts >= MAX_ATTEMPTS) {
        row.status = "DeadLettered";
        s = log(s, `${row.eventId}: failed ${row.attempts} times, dead-lettered for an operator`, "error");
      } else {
        row.status = "Pending";
        row.nextAttemptAt = s.now + backoff(row.attempts);
        s = log(s, `${row.eventId}: payment not committed yet (${worker}). Retry in ${seconds(backoff(row.attempts))}`, "warn");
      }
    } else {
      const alreadyPaid = s.payments[row.paymentId] === "Paid";
      row.status = "Processed";
      s = { ...s, payments: { ...s.payments, [row.paymentId]: "Paid" } };
      s = log(
        s,
        alreadyPaid
          ? `${row.eventId}: ${row.paymentId} is already paid, left untouched (idempotent handler)`
          : `${row.eventId}: ${row.paymentId} marked Paid and event completed in one commit (${worker})`,
        "ok",
      );
    }
  }

  for (const worker of s.workers) {
    if (worker.downUntil > 0) continue;
    if (s.rows.some((r) => r.status === "Processing" && r.lockedBy === worker.id)) continue;

    const due = s.rows.find(
      (r) => (r.status === "Pending" && r.nextAttemptAt <= s.now) || (r.status === "Processing" && r.lockedUntil <= s.now),
    );
    if (!due) continue;

    const reclaimed = due.status === "Processing";
    due.status = "Processing";
    due.lockedBy = worker.id;
    due.lockedUntil = s.now + LEASE_MS;
    due.finishAt = s.now + HANDLER_MS;
    due.attempts += 1;

    s = log(
      s,
      reclaimed
        ? `${due.eventId}: lease expired, ${worker.id} reclaimed it (attempt ${due.attempts})`
        : `${due.eventId}: claimed by ${worker.id} with a ${seconds(LEASE_MS)} lease (attempt ${due.attempts})`,
    );

    if (due.crashOnNextClaim) {
      due.crashOnNextClaim = false;
      worker.downUntil = s.now + WORKER_RESTART_MS;
      s = log(s, `${worker.id} crashed mid-event. Nothing was committed; the lease will expire`, "error");
    }
  }

  return s;
}
