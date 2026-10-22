import type { CSSProperties } from "react";
import { Ext } from "@/components/Ext";
import { BrowserFrame } from "@/components/Frames";
import { WebhookSimulator } from "@/components/WebhookSimulator";
import {
  CV,
  EMAIL,
  GITHUB,
  LINKEDIN,
  type Product,
  cloudAfter,
  cloudAlso,
  cloudBefore,
  experience,
  products,
  proof,
  repos,
  services,
  stack,
  steps,
} from "@/lib/content";

const [sponsa, livehire] = products;

const nav = [
  { href: "#help", label: "How I help" },
  { href: "#work", label: "Work" },
  { href: "#cloud", label: "Cloud" },
  { href: "#experience", label: "Experience" },
  { href: "#open-source", label: "For engineers" },
];

const mail = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
const roleMail = mail("Role enquiry");
const projectMail = mail("Project enquiry");
const cloudMail = mail("Cloud cost review");

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

function Flow({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="flow">
      {steps.map((s) => (
        <li key={s.title}>
          {s.title}
          <small>{s.detail}</small>
        </li>
      ))}
    </ol>
  );
}

function Case({ p }: { p: Product }) {
  const count = p.groups.reduce((n, g) => n + g.features.length, 0);
  return (
    <article className="case" aria-labelledby={`${p.id}-title`}>
      <BrowserFrame shot={p.shot} url={p.urlLabel} alt={`${p.name} ${p.id === "sponsa" ? "explore" : "home"} page, from the live site`} />
      <div className="case-body">
        <h3 id={`${p.id}-title`} className="case-name">
          <span className={`product-dot dot-${p.id}`} aria-hidden />
          {p.name}
        </h3>
        <p className="case-kind">
          {p.kind}. {p.role} {p.period}.
        </p>
        <p className="case-result">{p.result}</p>
        <dl className="facts">
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <details className="built case-more">
          <summary>
            <span>What it does</span>
            <span className="built-count">and how it is built</span>
          </summary>
          <div className="case-detail">
            <p className="case-summary">{p.summary}</p>
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
            <details className="built built-inner">
              <summary>
                <span>For engineers</span>
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
        </details>

        <Ext className="case-link" href={p.url}>
          Visit {p.url.replace("https://", "")}
        </Ext>
      </div>
    </article>
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
            <a href={CV} download>
              CV
            </a>
          </span>
          <a href="#contact" className="nav-cta">
            Get in touch
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
              <p className="hero-lede">I build software that takes real payments, and keep the cloud bill low.</p>
              <p className="hero-sub">
                Senior full stack engineer in Lahore with 6+ years of shipping .NET and React products, from the first design
                to live and looked after.
              </p>
              <div className="paths">
                <a className="path path-main" href={roleMail}>
                  <strong>Hiring a developer?</strong>
                  <span>Full-time, remote or relocating</span>
                </a>
                <a className="path" href={projectMail}>
                  <strong>Need a project built?</strong>
                  <span>Freelance or contract</span>
                </a>
              </div>
              <p className="availability">
                <span className="pulse" aria-hidden />
                Available now. <a href={CV} download>Download my CV</a>
              </p>
              <ul className="hero-proof" aria-label="Results at a glance">
                {proof.map((p) => (
                  <li key={p.label}>
                    <strong>{p.value}</strong>
                    <span>{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-stage">
              <div className="stage-back">
                <BrowserFrame shot={sponsa.scroll} url={sponsa.urlLabel} alt="Sponsa, explore page of the live site" priority auto />
              </div>
              <div className="stage-front">
                <BrowserFrame shot={livehire.scroll} url={livehire.urlLabel} alt="LiveHire, home page of the live site" priority auto />
              </div>
            </div>
          </div>
        </section>

        <section id="help" className="services" aria-labelledby="services-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="services-title">How I can help your business</h2>
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
          </div>
        </section>

        <section id="work" className="work" aria-labelledby="work-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="work-title">Two live products I run</h2>
              <p>Both are in use today, with real customers and real money moving through them. Open one for the detail.</p>
            </div>
            <div className="cases">
              {products.map((p) => (
                <Case key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>

        <section id="cloud" className="cloud" aria-labelledby="cloud-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="cloud-title">How I cut a cloud bill by about 35%</h2>
              <p>
                On Sponsa, one server ran the app and also sent out every picture creators uploaded. I moved the pictures
                to services built for them.
              </p>
            </div>

            <div className="cloud-compare">
              <div className="flow-card">
                <span className="flow-tag">Before</span>
                <Flow steps={cloudBefore} />
              </div>
              <div className="flow-card after">
                <span className="flow-tag">After</span>
                <Flow steps={cloudAfter} />
              </div>
            </div>

            <dl className="facts cloud-facts">
              <div>
                <dt>lower monthly AWS bill</dt>
                <dd>~35%</dd>
              </div>
              <div>
                <dt>image size on a phone, from a 393 KB upload</dt>
                <dd>12x smaller</dd>
              </div>
              <div>
                <dt>automated backups, with rules for old copies</dt>
                <dd>Daily</dd>
              </div>
            </dl>

            <ul className="certs" aria-label="Certifications">
              {experience.certs.map((c) => (
                <li key={c.name} className="cert">
                  {c.name}, {c.period}
                </li>
              ))}
            </ul>
            <ul className="chips" aria-label="Cloud work">
              {cloudAlso.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a className="btn btn-dark" href={cloudMail}>
              Ask me to look at your cloud costs
            </a>
          </div>
        </section>

        <section id="start" className="start" aria-labelledby="start-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="start-title">How we&apos;d start</h2>
              <p>Hiring for a role works the same way: send an email and we talk.</p>
            </div>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="experience" className="experience" aria-labelledby="exp-title">
          <div className="wrap exp-grid">
            <div>
              <h2 id="exp-title">Experience</h2>
              <div className="job">
                <h3>{experience.title}</h3>
                <p className="job-meta">
                  {experience.org}, {experience.period}. {experience.note}
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

        <section id="open-source" className="oss" aria-labelledby="oss-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="oss-title">For engineers: the hard parts, rebuilt in public</h2>
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

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="contact-photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized photo */}
            <img
              src="/arbaz-banner.webp"
              width={1536}
              height={1024}
              alt="Arbaz Khan with his arms crossed, in a black and white photograph"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="wrap contact-inner">
            <div className="contact-copy">
              <h2 id="contact-title">Let&apos;s talk about what you need.</h2>
              <p>Open to senior roles, relocation and freelance projects. Email is the fastest way to reach me.</p>
              <a className="contact-email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <div className="actions">
                <a className="btn btn-butter" href={roleMail}>
                  I&apos;m hiring
                </a>
                <a className="btn btn-ghost" href={projectMail}>
                  I have a project
                </a>
              </div>
              <p className="contact-links">
                <a href={CV} download>
                  Download CV
                </a>
                <Ext href={LINKEDIN}>LinkedIn</Ext>
                <Ext href={GITHUB}>GitHub</Ext>
              </p>
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
