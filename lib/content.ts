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
  /** Short proof points shown beside the preview. */
  facts: { value: string; label: string }[];
  /** The four features a reviewer should see first; the rest sit behind "How it's built". */
  highlights: Feature[];
  stack: string[];
  /** Full-page captures of the live site. travel is how far the capture scrolls inside its frame. */
  shots: {
    desktop: { src: string; w: number; h: number; travel: string };
    mobile: { src: string; w: number; h: number; travel: string };
  };
  groups: FeatureGroup[];
}

export const products: Product[] = [
  {
    id: "sponsa",
    name: "Sponsa",
    kind: "Creator monetization platform",
    url: "https://sponsa.app",
    urlLabel: "sponsa.app",
    role: "Sole engineer",
    period: "since Nov 2023",
    summary:
      "Supporters tip creators toward funding goals, live on stream. Money moves through PayPal and Ryft, and alerts have to reach OBS within seconds. In production with 2,000+ registered users. I own the architecture, backend, frontend, AWS infrastructure, releases and incident response.",
    facts: [
      { value: "2,000+", label: "registered users" },
      { value: "3", label: "payment providers" },
      { value: "360+", label: "automated API tests" },
    ],
    highlights: [
      {
        title: "Payments that never double charge",
        body: "Every PayPal and Ryft webhook is verified, stored and retried, and a redelivery is dropped on its event id.",
      },
      {
        title: "A safety net for lost webhooks",
        body: "A reconciliation job finds payments the provider completed but we never heard about, and logs every fix.",
      },
      {
        title: "Alerts on stream within seconds",
        body: "Tips and goal progress pushed to OBS over WebSockets while the creator is live.",
      },
      {
        title: "Images sized for every screen",
        body: "S3, CloudFront and Lambda resize on first request. A 393 KB upload reaches a phone as 32 KB.",
      },
    ],
    stack: ["ASP.NET Core 10", "EF Core", "SQL Server", "React 19", "AWS", "PayPal", "Ryft", "WebSockets"],
    shots: {
      desktop: { src: "/work/sponsa-desktop.webp", w: 2160, h: 7914, travel: "-83%" },
      mobile: { src: "/work/sponsa-mobile.webp", w: 780, h: 10842, travel: "-84%" },
    },
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
    role: "Lead engineer",
    period: "since Aug 2025",
    summary:
      "Companies hire pre-vetted developers and run the whole engagement in one place: chat and calls, time tracking, milestones and billing. I took over an existing codebase and rebuilt it across two APIs, a Next.js portal for companies and developers, and an admin console.",
    facts: [
      { value: "2", label: "APIs sharing one database" },
      { value: "63", label: "missing indexes added" },
      { value: "22", label: "end to end test harnesses" },
    ],
    highlights: [
      {
        title: "Escrow billing with a ledger",
        body: "Funds are held at hire and settled each period against approved time. Every movement is a ledger row.",
      },
      {
        title: "Time the server can vouch for",
        body: "The server stamps every start, stop and break, and one running timer per developer is enforced in the database.",
      },
      {
        title: "Chat and calls that hold together",
        body: "SignalR chat with presence, typing, edits and search, plus video calls from inside a conversation.",
      },
      {
        title: "Push instead of polling",
        body: "Notifications go out the moment they commit, replacing nine polling timers per browser tab.",
      },
    ],
    stack: ["ASP.NET Core 10", "SignalR", "SQL Server", "EF Core", "Next.js 16", "React 19", "Agora"],
    shots: {
      desktop: { src: "/work/livehire-desktop.webp", w: 2160, h: 6164, travel: "-78%" },
      mobile: { src: "/work/livehire-mobile.webp", w: 780, h: 13814, travel: "-88%" },
    },
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

/** One employer, with the client products I lead nested under it. */
export const experience = {
  title: "Lead Full Stack Engineer",
  org: "CoinBitSolutions",
  period: "Jan 2020 to present",
  roles: [
    { name: "LiveHire", period: "since Aug 2025", body: "Lead engineer. Took over an existing hiring platform and rebuilt billing, time tracking and the real-time workspace." },
    { name: "Sponsa", period: "since Nov 2023", body: "Sole engineer on a creator tipping platform, taken to production and 2,000+ registered users." },
    { name: "Client platforms", period: "2020 to 2023", body: "Healthcare and fintech products for international clients: REST APIs, SQL Server schemas, admin portals and trading UIs." },
  ],
  cert: { name: "Microsoft Certified: Azure Administrator Associate", period: "2026" },
};

export const services = [
  {
    title: "Your SaaS, end to end",
    body: "An ASP.NET Core API, a React or Next.js frontend and the AWS or Azure setup to run it, built by one engineer who has taken products to production.",
  },
  {
    title: "Payments that add up",
    body: "PayPal, Stripe Connect or Ryft wired in properly: verified webhooks, retries, refunds and a reconciliation job, so no payment goes missing.",
  },
  {
    title: "Real-time features",
    body: "Live chat, notifications, presence and stream overlays with SignalR or WebSockets that survive reconnects and bursts.",
  },
  {
    title: "Rescue and upgrade",
    body: "Take over an existing codebase, fix what is slowing it down, move it to current .NET and React, and leave it tested.",
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
