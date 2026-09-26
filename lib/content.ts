import type { Diagram } from "@/components/ArchDiagram";

export const EMAIL = "arbaz.bajay@gmail.com";
export const GITHUB = "https://github.com/arbaz168";
export const LINKEDIN = "https://linkedin.com/in/arbazzkkhan";

export interface Feature {
  title: string;
  body: string;
}

export interface FeatureGroup {
  name: string;
  features: Feature[];
}

export interface Product {
  id: string;
  name: string;
  kind: string;
  url: string;
  urlLabel: string;
  role: string;
  period: string;
  summary: string;
  diagramTitle: string;
  diagram: Diagram;
  groups: FeatureGroup[];
}

export const stats = [
  { value: 6, suffix: "+", label: "years shipping ASP.NET Core and React" },
  { value: 2000, suffix: "+", label: "registered users on Sponsa" },
  { value: 3, suffix: "", label: "payment providers integrated" },
  { value: 360, suffix: "+", label: "automated tests on the Sponsa API" },
];

const sponsaDiagram: Diagram = {
  wide: {
    w: 1000,
    h: 470,
    nodeW: 175,
    nodes: [
      { id: "supporter", label: "Supporter", sub: "Tip page, React 19", x: 20, y: 30 },
      { id: "providers", label: "PayPal, Ryft", sub: "Takes the payment", x: 215, y: 30, tone: "flow" },
      { id: "endpoint", label: "Webhook endpoint", sub: "Verify, store, 200", x: 410, y: 30 },
      { id: "inbox", label: "Webhook inbox", sub: "Deduped on event id", x: 605, y: 30, tone: "flow" },
      { id: "workers", label: "Leased workers", sub: "Retry, dead-letter", x: 800, y: 30 },
      { id: "recon", label: "Reconciliation", sub: "Finds lost webhooks", x: 410, y: 140 },
      { id: "sql", label: "SQL Server", sub: "Paid, goal progress", x: 800, y: 140, tone: "ok" },
      { id: "ws", label: "WebSocket hub", sub: "Per creator feed", x: 605, y: 250 },
      { id: "bots", label: "Chatbots", sub: "Twitch, YouTube, X", x: 800, y: 250 },
      { id: "obs", label: "OBS overlay", sub: "Alerts, goal bar", x: 410, y: 250, tone: "ok" },
      { id: "browser", label: "Image request", sub: "Width per layout slot", x: 20, y: 380 },
      { id: "cdn", label: "CloudFront", sub: "/_r/{width}/ cache", x: 215, y: 380 },
      { id: "lambda", label: "Lambda resizer", sub: "On a miss, resize once", x: 410, y: 380, tone: "flow" },
      { id: "s3", label: "S3 media", sub: "Private bucket", x: 605, y: 380 },
    ],
    edges: [
      { from: "supporter", to: "providers", tone: "flow" },
      { from: "providers", to: "endpoint", tone: "flow" },
      { from: "endpoint", to: "inbox", tone: "flow" },
      { from: "inbox", to: "workers", tone: "flow" },
      { from: "workers", to: "sql", tone: "ok" },
      { from: "recon", to: "providers", tone: "aux", via: "v" },
      { from: "recon", to: "sql", tone: "aux" },
      { from: "sql", to: "ws", tone: "ok", via: "v" },
      { from: "sql", to: "bots", tone: "ok" },
      { from: "ws", to: "obs", tone: "ok" },
      { from: "browser", to: "cdn", tone: "flow" },
      { from: "cdn", to: "lambda", tone: "flow" },
      { from: "lambda", to: "s3", tone: "flow" },
    ],
  },
  tall: {
    w: 360,
    h: 760,
    nodes: [
      { id: "supporter", label: "Supporter", sub: "Tip page, React 19", x: 10, y: 10 },
      { id: "providers", label: "PayPal, Ryft", sub: "Takes the payment", x: 190, y: 10, tone: "flow" },
      { id: "inbox", label: "Webhook inbox", sub: "Deduped on event id", x: 10, y: 100, tone: "flow" },
      { id: "endpoint", label: "Webhook endpoint", sub: "Verify, store, 200", x: 190, y: 100 },
      { id: "workers", label: "Leased workers", sub: "Retry, dead-letter", x: 10, y: 190 },
      { id: "sql", label: "SQL Server", sub: "Paid, goal progress", x: 10, y: 280, tone: "ok" },
      { id: "recon", label: "Reconciliation", sub: "Finds lost webhooks", x: 190, y: 280 },
      { id: "ws", label: "WebSocket hub", sub: "Per creator feed", x: 10, y: 370 },
      { id: "bots", label: "Chatbots", sub: "Twitch, YouTube, X", x: 190, y: 370 },
      { id: "obs", label: "OBS overlay", sub: "Alerts, goal bar", x: 10, y: 460, tone: "ok" },
      { id: "browser", label: "Image request", sub: "Width per slot", x: 10, y: 590 },
      { id: "cdn", label: "CloudFront", sub: "/_r/{width}/ cache", x: 190, y: 590 },
      { id: "s3", label: "S3 media", sub: "Private bucket", x: 10, y: 690 },
      { id: "lambda", label: "Lambda resizer", sub: "On a miss, resize once", x: 190, y: 690, tone: "flow" },
    ],
    edges: [
      { from: "supporter", to: "providers", tone: "flow" },
      { from: "providers", to: "endpoint", tone: "flow" },
      { from: "endpoint", to: "inbox", tone: "flow" },
      { from: "inbox", to: "workers", tone: "flow" },
      { from: "workers", to: "sql", tone: "ok" },
      { from: "recon", to: "sql", tone: "aux" },
      { from: "sql", to: "ws", tone: "ok" },
      { from: "sql", to: "bots", tone: "ok", via: "v" },
      { from: "ws", to: "obs", tone: "ok" },
      { from: "browser", to: "cdn", tone: "flow" },
      { from: "cdn", to: "lambda", tone: "flow" },
      { from: "lambda", to: "s3", tone: "flow" },
    ],
  },
};

const liveHireDiagram: Diagram = {
  wide: {
    w: 1000,
    h: 390,
    nodeW: 200,
    nodes: [
      { id: "company", label: "Company portal", sub: "Next.js 16, React 19", x: 20, y: 30 },
      { id: "developer", label: "Developer portal", sub: "Timer, chat, calls", x: 20, y: 150 },
      { id: "admin", label: "Admin console", sub: "React 19, Vite", x: 20, y: 300 },
      { id: "api", label: "Client API", sub: ".NET 10, JWT cookies", x: 270, y: 90, tone: "flow" },
      { id: "adminapi", label: "Admin API", sub: "Rates, wallets", x: 270, y: 300 },
      { id: "hubs", label: "SignalR hubs", sub: "Chat, presence, push", x: 520, y: 20, tone: "ok" },
      { id: "time", label: "Time tracking", sub: "Server-stamped", x: 520, y: 120 },
      { id: "escrow", label: "Escrow billing", sub: "Hold, invoice, settle", x: 520, y: 220, tone: "flow" },
      { id: "agora", label: "Agora calls", sub: "Per-call tokens", x: 780, y: 20 },
      { id: "sql", label: "SQL Server", sub: "EF Core migrations", x: 780, y: 300, tone: "ok" },
    ],
    edges: [
      { from: "company", to: "api", tone: "flow" },
      { from: "developer", to: "api", tone: "flow" },
      { from: "admin", to: "adminapi", tone: "flow" },
      { from: "api", to: "hubs", tone: "ok" },
      { from: "api", to: "time", tone: "flow" },
      { from: "api", to: "escrow", tone: "flow" },
      { from: "time", to: "escrow", tone: "flow", label: "approved hours", via: "v" },
      { from: "hubs", to: "agora", tone: "aux" },
      { from: "escrow", to: "sql", tone: "ok" },
      { from: "adminapi", to: "sql", tone: "aux" },
    ],
  },
  tall: {
    w: 360,
    h: 560,
    nodes: [
      { id: "company", label: "Company portal", sub: "Next.js 16", x: 10, y: 10 },
      { id: "developer", label: "Developer portal", sub: "Timer, chat, calls", x: 190, y: 10 },
      { id: "api", label: "Client API", sub: ".NET 10, JWT cookies", x: 100, y: 110, tone: "flow" },
      { id: "hubs", label: "SignalR hubs", sub: "Chat, presence, push", x: 10, y: 210, tone: "ok" },
      { id: "time", label: "Time tracking", sub: "Server-stamped", x: 190, y: 210 },
      { id: "agora", label: "Agora calls", sub: "Per-call tokens", x: 10, y: 310 },
      { id: "escrow", label: "Escrow billing", sub: "Hold, invoice, settle", x: 190, y: 310, tone: "flow" },
      { id: "sql", label: "SQL Server", sub: "EF Core migrations", x: 190, y: 410, tone: "ok" },
      { id: "adminapi", label: "Admin API", sub: "Rates, wallets", x: 10, y: 410 },
      { id: "admin", label: "Admin console", sub: "React 19, Vite", x: 10, y: 500 },
    ],
    edges: [
      { from: "company", to: "api", tone: "flow", via: "v" },
      { from: "developer", to: "api", tone: "flow", via: "v" },
      { from: "api", to: "hubs", tone: "ok", via: "v" },
      { from: "api", to: "time", tone: "flow", via: "v" },
      { from: "time", to: "escrow", tone: "flow" },
      { from: "hubs", to: "agora", tone: "aux" },
      { from: "escrow", to: "sql", tone: "ok" },
      { from: "adminapi", to: "sql", tone: "aux" },
      { from: "admin", to: "adminapi", tone: "flow" },
    ],
  },
};

export const products: Product[] = [
  {
    id: "sponsa",
    name: "Sponsa",
    kind: "Creator monetization platform",
    url: "https://sponsa.app",
    urlLabel: "sponsa.app",
    role: "Lead Full Stack Engineer, sole engineer",
    period: "Nov 2023 to present",
    summary:
      "Supporters tip creators toward funding goals, live on stream. Money moves through PayPal and Ryft, and alerts have to reach OBS within seconds. In production with 2,000+ registered users. I own the architecture, backend, frontend, AWS infrastructure, releases and incident response.",
    diagramTitle: "How a tip moves through Sponsa",
    diagram: sponsaDiagram,
    groups: [
      {
        name: "Moving money",
        features: [
          {
            title: "Webhook inbox for PayPal and Ryft",
            body: "Every provider webhook is verified, stored and acknowledged before any work runs. Background workers claim rows, retry failures with backoff and dead-letter what can never succeed, so a slow handler never makes a provider retry, and a redelivery is dropped on its event id.",
          },
          {
            title: "Offline PayPal signature verification",
            body: "CRC32 over the exact raw body and RSA-SHA256 against PayPal's certificate, fetched only from pinned PayPal hosts and cached. I traced a run of failed verifications to a JSON parser silently reformatting the signed timestamp, fixed the parse and locked it in with tests built on a real historical webhook.",
          },
          {
            title: "Reconciliation sweep",
            body: "A background job finds captures PayPal completed that never reached paid on our side, the case where a webhook is lost entirely, and logs what it checked, what it changed and why.",
          },
          {
            title: "Refund fee preview",
            body: "Before a creator refunds a Ryft tip, the API reads Ryft's balance ledger and shows exactly what the refund costs them. When the ledger can't be read reliably it says so rather than showing a wrong number.",
          },
          {
            title: "Multi-currency goals",
            body: "GBP, USD and EUR served from one list the frontend builds its menus from. A goal's currency freezes once it takes its first payment, and account insights are converted with cached FX rates instead of relabelled.",
          },
        ],
      },
      {
        name: "Live on stream",
        features: [
          {
            title: "Real-time OBS overlays",
            body: "Tip alerts and goal progress pushed over WebSockets to OBS browser sources while the creator is on air, and the sources stay on screen through a brief API outage.",
          },
          {
            title: "Resettable alert links",
            body: "Each creator's alert feed sits behind a secret link they can rotate from settings. Rotating it disconnects every alert page still open on the old link.",
          },
          {
            title: "Chatbot announcements",
            body: "Tips announced in Twitch, YouTube and X chat through OAuth integrations with token refresh, and a cancelled consent screen handled as a normal outcome rather than an exception.",
          },
          {
            title: "Link previews that render themselves",
            body: "Crawlers get a rendered goal card: headless Chromium draws it, S3 stores it, and if rendering fails the page falls back to an existing image instead of breaking.",
          },
        ],
      },
      {
        name: "Platform and security",
        features: [
          {
            title: "Resize-on-miss image CDN",
            body: "CloudFront sends a cache miss under /_r/{width}/ to a Lambda that resizes once, stores the webp in S3 and returns it. Widths are a closed list from 160 to 1600 taken from real layout slots. A 393 KB upload now reaches a phone as 32 KB.",
          },
          {
            title: "Personal access tokens",
            body: "Creators automate their goals with spa_live_ tokens, stored as SHA-256 hashes with a one year expiry and per-token revocation. Default deny: a token only works on endpoints explicitly marked for it, and a test fails if anyone opens another.",
          },
          {
            title: "Token rotation without deadlocks",
            body: "15 minute access tokens and 30 day refresh tokens in same-site cookies, stored hashed and rotated on every use. Reusing an old refresh token revokes the whole chain. I removed a deadlock from the rotation path.",
          },
          {
            title: "Google sign-in in a popup",
            body: "Replaced the redirect flow with the ID token from Google's own button, validated on the server, so sign-in no longer leaves the page.",
          },
          {
            title: "Breaking up god classes",
            body: "Split the client API from a handful of oversized controllers into about 19 focused ones and the data layer into about 18 services behind DI, with an end to end test host that guards routes, DI and auth.",
          },
          {
            title: "A leaner, locked-down frontend",
            body: "Route-level code splitting cut the entry bundle from 1,313 kB to 305 kB. Payment SDKs load only on pages that take payments, and the Content Security Policy moved from report-only to enforced.",
          },
          {
            title: "Observability that pages me",
            body: "Serilog to Seq with a correlation id on every line, alerts on payment failures, and Sentry for frontend errors.",
          },
          {
            title: "Kept current",
            body: ".NET 10 and EF Core 10, React 19, Vite 8, React Router 7, Tailwind 4, and xUnit v3 on Microsoft Testing Platform.",
          },
        ],
      },
    ],
  },
  {
    id: "livehire",
    name: "LiveHire",
    kind: "Managed talent hiring platform",
    url: "https://livehire.gentechs.io",
    urlLabel: "livehire.gentechs.io",
    role: "Lead Full Stack Engineer",
    period: "Aug 2025 to present",
    summary:
      "Companies hire pre-vetted developers and run the whole engagement in one place: chat and calls, time tracking, milestones and billing. I took over an existing codebase and rebuilt it across two APIs, a Next.js portal for companies and developers, and an admin console.",
    diagramTitle: "How LiveHire fits together",
    diagram: liveHireDiagram,
    groups: [
      {
        name: "Money and time",
        features: [
          {
            title: "Escrow billing",
            body: "Hiring reserves one period's charge. Each closed period is invoiced against approved work, settled from the company wallet and the hold topped back up. Developers are credited net of fee, and every movement is a ledger row.",
          },
          {
            title: "Metered only where it should be",
            body: "Hourly engagements bill approved hours up to a weekly cap; hours past the cap are recorded but never billed. Monthly seats bill in full whether or not an hour is logged, because the company reserved that person.",
          },
          {
            title: "Server-authoritative time tracking",
            body: "The timer endpoints take no timestamps: the server stamps every start, stop and break. A filtered unique index allows one running session per developer across all projects, breaks are excluded from billable time, and hours are stored to four decimal places.",
          },
          {
            title: "Time approval with an audit trail",
            body: "Companies approve or flag logged time, every decision is written as an audit row, and time nobody reviews approves itself after a published review window.",
          },
        ],
      },
      {
        name: "Real time",
        features: [
          {
            title: "SignalR chat that holds together",
            body: "One lasting conversation per client and developer, plus a squad chat per project that tracks its team. Presence is reference counted across tabs, typing expires after five seconds, and history pages by cursor so a message arriving mid-scroll never duplicates or jumps.",
          },
          {
            title: "Edit, withdraw, search, read",
            body: "Edits within 15 minutes. A withdrawn message becomes a tombstone that keeps its sender, time and place, because chat here is evidence in a billing dispute. Read state comes from one marker per member, not a receipts table.",
          },
          {
            title: "Video calls",
            body: "Agora calls with tokens issued per call to its participants, each call recorded in the conversation it was placed from, and a missed call leaving a notification that leads back to the thread.",
          },
          {
            title: "Push instead of polling",
            body: "An EF Core SaveChanges interceptor announces every notification the moment it commits, which replaced nine polling timers per tab. The client maps each event to the queries it affects, and sidebar badges stay live.",
          },
          {
            title: "Chat moderation",
            body: "Keyword moderation with compiled patterns cached and rebuilt only when the keyword list changes version.",
          },
        ],
      },
      {
        name: "Data and delivery",
        features: [
          {
            title: "A live database under migrations",
            body: "Moved a production SQL Server schema from ad hoc scripts to EF Core migrations with a verified baseline, added the 63 indexes it was missing, and shipped idempotent rollout scripts run as a deploy step, since two APIs share the database and would race at startup.",
          },
          {
            title: "Milestones, files and activity",
            body: "Milestones and work items with progress and health derived from them, private project files behind membership checks and atomic storage quotas, and an activity log of milestone, task and file events.",
          },
          {
            title: "Google sign-in for companies",
            body: "An authorization code exchange on the server, so the sign-in button is ours rather than Google's rendered one.",
          },
          {
            title: "Admin console on real data",
            body: "Admin-set hourly and monthly rates, client wallets, E.164 phone numbers validated per country, and screens that name people instead of showing their logins.",
          },
          {
            title: "Verified against the real thing",
            body: "22 verification harnesses drive the real API, real SignalR hubs and a real SQL Server: escrow, messaging, calls, notifications, files, sign-in and more.",
          },
          {
            title: "Kept current",
            body: ".NET 10 with built-in OpenAPI and Scalar on both APIs, Next.js 16 and React 19 on the portal.",
          },
        ],
      },
    ],
  },
];

export const repos = [
  {
    name: "aspnetcore-webhook-inbox",
    body: "Payment webhook handling in ASP.NET Core 10: signed delivery, database-level deduplication, leased workers that scale out safely, retries with backoff and dead-lettering.",
    lang: "C#",
    tests: "31 tests, CI",
  },
  {
    name: "aspnetcore-signalr-overlay",
    body: "Real-time stream alerts for OBS with SignalR and React: gap-free sequence numbers, resume after reconnect, idempotent publishing and an alert queue that survives bursts.",
    lang: "C# and TypeScript",
    tests: "49 tests, CI",
  },
];

export interface TimelineEntry {
  when: string;
  title: string;
  org: string;
  body: string;
  tone: "flow" | "ok";
}

export const timeline: TimelineEntry[] = [
  {
    when: "Jan 2020",
    title: "Lead Full Stack Engineer",
    org: "CoinBitSolutions",
    body: "Full stack product work in ASP.NET Core and React, from APIs and databases to frontends and cloud deployment.",
    tone: "ok",
  },
  {
    when: "Nov 2023",
    title: "Lead Full Stack Engineer",
    org: "Sponsa",
    body: "Sole engineer on a creator tipping platform, taken to production and 2,000+ registered users.",
    tone: "ok",
  },
  {
    when: "Aug 2025",
    title: "Lead Full Stack Engineer",
    org: "LiveHire",
    body: "Took over an existing hiring platform and rebuilt its domain model, billing, time tracking and real-time workspace.",
    tone: "ok",
  },
  {
    when: "Aug 2026",
    title: "Payments hardening",
    org: "Sponsa",
    body: "Webhook inbox, offline signature verification, reconciliation, S3 and CloudFront, and the move to .NET 10.",
    tone: "flow",
  },
  {
    when: "Sep 2026",
    title: "Escrow, migrations and push",
    org: "LiveHire",
    body: "Escrow billing, the production schema under EF Core migrations, pushed notifications and video calls.",
    tone: "flow",
  },
  {
    when: "Sep 2026",
    title: "Edge images, API tokens, React 19",
    org: "Sponsa",
    body: "Resize-on-miss image CDN, multi-currency goals, personal access tokens, React 19 and Tailwind 4.",
    tone: "flow",
  },
  {
    when: "Sep 2026",
    title: "Open source",
    org: "GitHub",
    body: "Two production patterns rebuilt from scratch in public: a webhook inbox and a SignalR overlay.",
    tone: "flow",
  },
];

export const stack = [
  { area: "Backend", tools: ["C#", "ASP.NET Core 10", "EF Core", "SQL Server", "PostgreSQL", "REST", "OpenAPI"] },
  { area: "Real time", tools: ["WebSockets", "SignalR", "Agora"] },
  { area: "Frontend", tools: ["React 19", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query"] },
  { area: "Payments", tools: ["PayPal", "Ryft", "Stripe Connect", "Webhooks", "Reconciliation"] },
  { area: "Cloud", tools: ["AWS EC2", "S3", "CloudFront", "Lambda", "Azure", "IIS", "Docker", "Kubernetes"] },
  { area: "Delivery", tools: ["GitHub Actions", "Azure DevOps", "xUnit", "Vitest", "Serilog", "Seq", "Sentry"] },
];
