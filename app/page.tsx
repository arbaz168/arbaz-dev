import { ArchDiagram } from "@/components/ArchDiagram";
import { Counter } from "@/components/Counter";
import { Ext } from "@/components/Ext";
import { HeroFlow } from "@/components/HeroFlow";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { WebhookSimulator } from "@/components/WebhookSimulator";
import { EMAIL, GITHUB, LINKEDIN, type Product, products, repos, stack, stats, timeline } from "@/lib/content";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#simulator", label: "Simulator" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
];

function ProductSection({ p }: { p: Product }) {
  const count = p.groups.reduce((n, g) => n + g.features.length, 0);
  return (
    <section id={p.id} className="product wrap" aria-labelledby={`${p.id}-title`}>
      <Reveal className="product-head">
        <div>
          <h2 id={`${p.id}-title`} className="product-name">
            {p.name}
          </h2>
          <p className="product-kind">{p.kind}</p>
        </div>
        <dl className="product-meta">
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{p.period}</dd>
          </div>
          <div>
            <dt>Live at</dt>
            <dd>
              <Ext href={p.url}>{p.urlLabel}</Ext>
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal>
        <p className="product-summary">{p.summary}</p>
      </Reveal>

      <div className="diagram-wrap">
        <h3 className="diagram-title">{p.diagramTitle}</h3>
        <ArchDiagram diagram={p.diagram} title={p.diagramTitle} />
      </div>

      <h3 className="sr-only">
        {count} things I built on {p.name}
      </h3>
      <div className="groups">
        {p.groups.map((g) => (
          <div key={g.name} className="group">
            <h4 className="group-name">
              {g.name}
              <span className="group-count">{g.features.length}</span>
            </h4>
            <ul className="features">
              {g.features.map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={(i % 2) * 70}>
                    <h5>{f.title}</h5>
                    <p>{f.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="#top" className="brand">
            Arbaz Khan
          </a>
          <nav aria-label="Sections">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="nav-link">
                {n.label}
              </a>
            ))}
            <a href="#contact" className="nav-cta">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero wrap">
          <div className="hero-copy">
            <h1 className="hero-name">Arbaz Khan</h1>
            <p className="hero-role">Senior full stack engineer. ASP.NET Core, React and AWS.</p>
            <p className="hero-lede">
              I build the parts of a SaaS product where money and messages move: payment providers, webhooks, ledgers
              and real-time feeds. Then I run them in production.
            </p>
            <div className="actions">
              <a className="button primary" href={`mailto:${EMAIL}`}>
                Email me
              </a>
              <Ext className="button" href={GITHUB}>
                GitHub
              </Ext>
              <Ext className="button" href={LINKEDIN}>
                LinkedIn
              </Ext>
            </div>
            <p className="availability">
              <span className="pulse" aria-hidden />
              Open to senior remote roles and relocation
            </p>
          </div>
          <div className="hero-visual">
            <HeroFlow />
          </div>
        </section>

        <section className="wrap stats" aria-label="In numbers">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 90}>
              <span className="stat-value">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </section>

        <div id="work" className="work">
          <Reveal className="wrap section-intro">
            <h2>Two platforms I lead</h2>
            <p>
              The hardest and most recent work from each. Both run on ASP.NET Core with React frontends, and I own them
              from the database to the browser.
            </p>
          </Reveal>
          {products.map((p) => (
            <ProductSection key={p.id} p={p} />
          ))}
        </div>

        <section id="simulator" className="wrap section" aria-labelledby="sim-title">
          <Reveal className="section-intro">
            <h2 id="sim-title">Payment webhooks, where money quietly goes missing</h2>
            <p>
              Providers deliver webhooks at least once, in any order, sometimes before your own checkout has committed.
              This is a live model of the pattern I run in production: verify and store first, process in leased
              workers, retry with backoff, and dead-letter what can never succeed. It runs entirely in your browser.{" "}
              <Ext href={`${GITHUB}/aspnetcore-webhook-inbox`}>See the real implementation and its tests.</Ext>
            </p>
          </Reveal>
          <WebhookSimulator />
        </section>

        <section id="open-source" className="wrap section" aria-labelledby="oss-title">
          <Reveal className="section-intro">
            <h2 id="oss-title">Production patterns, rebuilt in public</h2>
            <p>Written from scratch, with no client code, so the patterns can be read and run by anyone.</p>
          </Reveal>
          <div className="repos">
            {repos.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <Ext className="repo" href={`${GITHUB}/${r.name}`}>
                  <span className="repo-name">{r.name}</span>
                  <span className="repo-body">{r.body}</span>
                  <span className="repo-meta">
                    <span>{r.lang}</span>
                    <span>{r.tests}</span>
                  </span>
                </Ext>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" className="wrap section split" aria-labelledby="exp-title">
          <Reveal className="section-intro">
            <h2 id="exp-title">Experience</h2>
            <p>Roles first, then the stretches of work that moved each product the most.</p>
          </Reveal>
          <Timeline entries={timeline} />
        </section>

        <section id="stack" className="wrap section" aria-labelledby="stack-title">
          <Reveal className="section-intro">
            <h2 id="stack-title">Stack</h2>
            <p>What I use in production today, not a list of everything I have touched.</p>
          </Reveal>
          <dl className="stack">
            {stack.map((s, i) => (
              <Reveal key={s.area} className="stack-row" delay={i * 50}>
                <dt>{s.area}</dt>
                <dd>
                  <ul>
                    {s.tools.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <section id="contact" className="wrap contact" aria-labelledby="contact-title">
          <Reveal>
            <h2 id="contact-title">Hiring for a senior .NET or full stack role?</h2>
            <p>I&apos;m open to senior remote roles and relocation. Email is the fastest way to reach me.</p>
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <div className="actions">
              <Ext className="button" href={LINKEDIN}>
                LinkedIn
              </Ext>
              <Ext className="button" href={GITHUB}>
                GitHub
              </Ext>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Arbaz Khan</span>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
