import type { CSSProperties } from "react";
import { Ext } from "@/components/Ext";
import { BrowserFrame, PhoneFrame } from "@/components/Frames";
import { ScrollShot } from "@/components/ScrollShot";
import { Tilt } from "@/components/Tilt";
import { WebhookSimulator } from "@/components/WebhookSimulator";
import { EMAIL, GITHUB, LINKEDIN, type Product, experience, products, repos, services, stack } from "@/lib/content";

const [sponsa, livehire] = products;

const nav = [
  { href: "#work", label: "Work" },
  { href: "#open-source", label: "Open source" },
  { href: "#services", label: "Services" },
  { href: "#experience", label: "Experience" },
];

const projectMail = `mailto:${EMAIL}?subject=${encodeURIComponent("Project enquiry")}`;

function Name({ text }: { text: string }) {
  let i = 0;
  return (
    <span className="name-letters" aria-hidden>
      {text.split(" ").map((word) => (
        <span key={word} className="name-word">
          {word.split("").map((ch) => (
            <span key={i} className="name-letter" style={{ "--i": i++ } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function ProductSection({ p, flip }: { p: Product; flip?: boolean }) {
  const count = p.groups.reduce((n, g) => n + g.features.length, 0);
  const titleId = `${p.id}-title`;
  return (
    <ScrollShot id={p.id} className={`product ${flip ? "flip" : ""}`} labelledBy={titleId}>
      <div className="wrap product-grid" data-track>
        <div className="product-copy">
          <h3 id={titleId} className="product-name">
            <span className={`product-dot dot-${p.id}`} aria-hidden />
            {p.name}
          </h3>
          <p className="product-kind">
            {p.kind}. {p.role} {p.period}.
          </p>
          <p className="product-summary">{p.summary}</p>

          <dl className="facts">
            {p.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="highlights">
            {p.highlights.map((h) => (
              <li key={h.title}>
                <h4>{h.title}</h4>
                <p>{h.body}</p>
              </li>
            ))}
          </ul>

          <ul className="chips" aria-label={`${p.name} stack`}>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <div className="actions">
            <Ext className="btn btn-dark" href={p.url}>
              Visit {p.urlLabel}
            </Ext>
          </div>
        </div>

        <div className="product-stage" data-stage>
          <BrowserFrame shot={p.shots.desktop} url={p.urlLabel} alt={`${p.name} home page on desktop`} />
          <PhoneFrame shot={p.shots.mobile} alt={`${p.name} home page on a phone`} />
        </div>
      </div>

      <div className="wrap">
        <details className="built">
          <summary>
            <span>How {p.name} is built</span>
            <span className="built-count">{count} features in detail</span>
          </summary>
          <div className="built-groups">
            {p.groups.map((g) => (
              <div key={g.name} className="built-group">
                <h4>{g.name}</h4>
                <ul>
                  {g.features.map((f) => (
                    <li key={f.title}>
                      <h5>{f.title}</h5>
                      <p>{f.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </ScrollShot>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <nav className="topbar-inner" aria-label="Sections">
          <a href="#top" className="brand">
            Arbaz Khan
          </a>
          <span className="nav-links">
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </span>
          <a href={`mailto:${EMAIL}`} className="nav-cta">
            Email me
          </a>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="wrap hero-grid">
            <h1 className="hero-name">
              <span className="sr-only">Arbaz Khan, senior full stack engineer</span>
              <Name text="Arbaz Khan" />
            </h1>
            <div className="hero-copy">
              <p className="hero-lede">I build and run SaaS products where money and messages move.</p>
              <p className="hero-sub">
                Senior full stack engineer. ASP.NET Core, React and AWS, 6+ years shipping to real users. Right now I lead
                two live products: Sponsa and LiveHire.
              </p>
              <div className="actions">
                <a className="btn btn-butter" href="#work">
                  See my work
                </a>
                <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                  Email me
                </a>
              </div>
              <p className="availability">
                <span className="pulse" aria-hidden />
                Available for senior roles, relocation and freelance projects
              </p>
            </div>

            <Tilt className="hero-stage">
              <div className="stage-back">
                <BrowserFrame shot={sponsa.shots.desktop} url={sponsa.urlLabel} alt="Sponsa, live" auto />
              </div>
              <div className="stage-front">
                <BrowserFrame shot={livehire.shots.desktop} url={livehire.urlLabel} alt="LiveHire, live" auto />
              </div>
            </Tilt>
          </div>
        </section>

        <div id="work" className="work">
          <div className="wrap">
            <div className="section-head">
              <h2>Two live products I lead</h2>
              <p>
                Both run on ASP.NET Core with React frontends, and I own them from the database to the browser. The
                previews are the real sites.
              </p>
            </div>
          </div>
          <ProductSection p={sponsa} />
          <ProductSection p={livehire} flip />
        </div>

        <section id="open-source" className="oss" aria-labelledby="oss-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="oss-title">The hard parts, rebuilt in public</h2>
              <p>The patterns behind both products, written from scratch with no client code, so anyone can read and run them.</p>
            </div>
            <div className="repos">
              {repos.map((r) => (
                <article key={r.name} className="repo">
                  <h3>{r.name}</h3>
                  <p>{r.body}</p>
                  <p className="repo-meta">
                    {r.lang}, {r.tests}
                  </p>
                  <Ext className="btn btn-butter" href={`${GITHUB}/${r.name}`}>
                    Read the code
                  </Ext>
                </article>
              ))}
            </div>
            <details className="sim-drawer">
              <summary>
                <span>Try the webhook inbox in your browser</span>
                <span className="built-count">Six failure scenarios, running live</span>
              </summary>
              <p className="sim-intro">
                Providers deliver webhooks at least once, in any order, sometimes before your checkout has committed. Pick
                a scenario and watch the inbox verify, store, retry and dead-letter.
              </p>
              <WebhookSimulator />
            </details>
          </div>
        </section>

        <section id="services" className="services" aria-labelledby="services-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="services-title">Hire me for a project</h2>
              <p>Freelance or contract, fully remote. You work directly with the engineer who builds and ships it.</p>
            </div>
            <ul className="service-list">
              {services.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ul>
            <a className="btn btn-dark" href={projectMail}>
              Tell me about your project
            </a>
          </div>
        </section>

        <section id="experience" className="experience" aria-labelledby="exp-title">
          <div className="wrap exp-grid">
            <div>
              <h2 id="exp-title">Experience</h2>
              <div className="job">
                <h3>{experience.title}</h3>
                <p className="job-meta">
                  {experience.org}, {experience.period}
                </p>
                <ul className="job-roles">
                  {experience.roles.map((r) => (
                    <li key={r.name}>
                      <h4>
                        {r.name} <span>{r.period}</span>
                      </h4>
                      <p>{r.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="cert">
                {experience.cert.name}, {experience.cert.period}
              </p>
            </div>
            <div>
              <h2>Stack</h2>
              <dl className="stack">
                {stack.map((s) => (
                  <div key={s.area}>
                    <dt>{s.area}</dt>
                    <dd>{s.tools.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="wrap">
            <h2 id="contact-title">Got something that needs to ship?</h2>
            <p>Open to senior roles, relocation and freelance projects. Email is the fastest way to reach me.</p>
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <div className="actions">
              <Ext className="btn btn-butter" href={LINKEDIN}>
                LinkedIn
              </Ext>
              <Ext className="btn btn-ghost" href={GITHUB}>
                GitHub
              </Ext>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>© {new Date().getFullYear()} Arbaz Khan</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  );
}
