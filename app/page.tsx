import { WebhookSimulator } from "@/components/WebhookSimulator";

const EMAIL = "arbaz.bajay@gmail.com";
const GITHUB = "https://github.com/arbaz168";
const LINKEDIN = "https://linkedin.com/in/arbazzkkhan";

interface CaseStudy {
  name: string;
  kind: string;
  url: string;
  urlLabel: string;
  role: string;
  summary: string;
  highlights: { title: string; body: string }[];
  stack: string[];
}

const caseStudies: CaseStudy[] = [
  {
    name: "Sponsa",
    kind: "Creator monetization platform",
    url: "https://sponsa.app",
    urlLabel: "sponsa.app",
    role: "Lead Full Stack Engineer, sole engineer · Nov 2023 to present",
    summary:
      "Creators take donations and sponsorships live on stream. Money moves through three payment providers, and alerts have to reach the stream within seconds. Live in production with 2,000+ registered users. I own architecture, backend, frontend, infrastructure, releases and incident response.",
    highlights: [
      {
        title: "Multi-provider payments",
        body: "PayPal, Ryft and Stripe Connect behind one payment flow, with multi-currency support and cached FX rates.",
      },
      {
        title: "Webhooks that don't lose money",
        body: "An idempotent store-and-retry inbox with dead-lettering, plus reconciliation jobs that check payment state against each provider and log exactly what they changed.",
      },
      {
        title: "Real-time overlays",
        body: "WebSocket updates drive live alerts and goal progress in OBS while the creator is on air.",
      },
      {
        title: "Running it",
        body: "S3, CloudFront and a Lambda that resizes images on upload. Serilog and Seq with alerts on payment failures, Sentry on the frontend, separate staging and production.",
      },
    ],
    stack: ["ASP.NET Core 10", "EF Core", "React 19", "Vite", "Tailwind", "AWS", "GitHub Actions"],
  },
  {
    name: "LiveHire",
    kind: "Managed talent hiring platform",
    url: "https://livehire.gentechs.io",
    urlLabel: "livehire.gentechs.io",
    role: "Lead Full Stack Engineer · Aug 2025 to present",
    summary:
      "Companies hire pre-vetted developers and run the whole engagement in one place: chat and calls, time tracking, milestones and billing. I took over an existing codebase and rebuilt it across two APIs and two frontends.",
    highlights: [
      {
        title: "Security pass on inherited code",
        body: "Closed authorization gaps in real-time chat, moved auth to JWTs in HttpOnly cookies, upgraded legacy password hashes at sign-in without forcing resets, and took signing keys out of source.",
      },
      {
        title: "Billing redesign",
        body: "Replaced taking the full engagement value at hire with escrow. Funds are reserved at hire and settled per billing period against approved time, with every movement in a transaction ledger.",
      },
      {
        title: "Production schema under migrations",
        body: "Baselined a live SQL Server database that only had ad hoc scripts, added the 63 indexes it was missing, and shipped idempotent rollout scripts.",
      },
      {
        title: "Real-time workspace",
        body: "SignalR chat with presence, typing, edits and search, video calls, and pushed notifications in place of polling.",
      },
    ],
    stack: [".NET 10", "EF Core", "SQL Server", "SignalR", "Next.js", "React", "TypeScript"],
  },
];

const repos = [
  {
    name: "aspnetcore-webhook-inbox",
    body: "Production-style payment webhook handling in ASP.NET Core 10. Signed delivery, database-level deduplication, leased workers, retries with backoff and dead-lettering.",
    meta: "C# · 31 tests · CI",
  },
  {
    name: "aspnetcore-signalr-overlay",
    body: "Real-time stream alerts for OBS with SignalR and React. Gap-free sequence numbers, resume after reconnect, idempotent publishing, and an alert queue that survives bursts.",
    meta: "C# + TypeScript · 49 tests · CI",
  },
];

export default function Home() {
  return (
    <main>
      <header className="hero wrap">
        <p className="eyebrow">Senior Full Stack Engineer</p>
        <h1>Arbaz Khan</h1>
        <p className="lede">
          I design, build and run production SaaS end to end: APIs, frontends, cloud infrastructure, payments, and the
          on-call work that keeps them healthy. 6+ years shipping <strong>ASP.NET Core</strong> and <strong>React</strong>{" "}
          to real users.
        </p>
        <div className="actions">
          <a className="button primary" href={`mailto:${EMAIL}`}>
            Email me
          </a>
          <a className="button" href={GITHUB}>
            GitHub
          </a>
          <a className="button" href={LINKEDIN}>
            LinkedIn
          </a>
        </div>
        <p className="availability">
          <span className="pulse" aria-hidden /> Open to senior remote roles and relocation
        </p>
      </header>

      <section className="wrap section" aria-labelledby="sim-title">
        <p className="eyebrow">Try it</p>
        <h2 id="sim-title">Payment webhooks, where money quietly goes missing</h2>
        <p className="section-lede">
          Providers deliver webhooks at least once, in any order, sometimes before your own checkout has committed. This
          is a live model of the pattern I use in production: verify and store first, process in leased background
          workers, retry with backoff, and dead-letter what can never succeed. It runs entirely in your browser.{" "}
          <a href={`${GITHUB}/aspnetcore-webhook-inbox`}>See the real implementation and its tests.</a>
        </p>
        <WebhookSimulator />
      </section>

      <section className="wrap section" aria-labelledby="work-title">
        <p className="eyebrow">Work</p>
        <h2 id="work-title">Two products I lead</h2>
        <div className="cases">
          {caseStudies.map((c) => (
            <article key={c.name} className="case">
              <div className="case-head">
                <div>
                  <h3>{c.name}</h3>
                  <p className="case-kind">{c.kind}</p>
                </div>
                <a href={c.url} className="case-link">
                  {c.urlLabel} ↗
                </a>
              </div>
              <p className="case-role">{c.role}</p>
              <p>{c.summary}</p>
              <ul className="highlights">
                {c.highlights.map((h) => (
                  <li key={h.title}>
                    <strong>{h.title}.</strong> {h.body}
                  </li>
                ))}
              </ul>
              <ul className="chips" aria-label="Stack">
                {c.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="oss-title">
        <p className="eyebrow">Open source</p>
        <h2 id="oss-title">Production patterns, written from scratch</h2>
        <div className="repos">
          {repos.map((r) => (
            <a key={r.name} className="repo" href={`${GITHUB}/${r.name}`}>
              <span className="repo-name">{r.name}</span>
              <span className="repo-body">{r.body}</span>
              <span className="repo-meta">{r.meta}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="wrap section contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Hiring for a senior .NET or full stack role?</h2>
        <p className="section-lede">
          I&apos;m open to senior remote roles and relocation. The fastest way to reach me is email.
        </p>
        <div className="actions">
          <a className="button primary" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a className="button" href={LINKEDIN}>
            LinkedIn
          </a>
          <a className="button" href={GITHUB}>
            GitHub
          </a>
        </div>
      </section>

      <footer className="wrap footer">© {new Date().getFullYear()} Arbaz Khan</footer>
    </main>
  );
}
