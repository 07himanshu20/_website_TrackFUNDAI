'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useReveal from '@/components/useReveal';

const TIMELINE = [
  {
    year: '2024',
    title: 'The Spark',
    desc: 'Identified the gap — Indian AIFs running on spreadsheets, emails, and manual SEBI filings. Started building the Portfolio Intelligence layer.',
    accent: '#a78bfa',
  },
  {
    year: '2025 Q1',
    title: 'Foundation',
    desc: 'Built the core platform — PostgreSQL migration, authentication, fund administration, document vault, and audit logging.',
    accent: '#f0abfc',
  },
  {
    year: '2025 Q2',
    title: 'Intelligence Layer',
    desc: 'Launched Portfolio Monitoring with Gemini AI chatbot, multi-fund comparison, deep-dive analytics, and automated KPI tracking.',
    accent: '#fbbf77',
  },
  {
    year: '2025 Q3',
    title: 'LP Ecosystem',
    desc: 'Shipped LP Management — investor onboarding, capital calls, distributions, waterfall simulation, and a self-service LP Portal.',
    accent: '#a78bfa',
  },
  {
    year: '2025 Q4',
    title: 'Compliance Engine',
    desc: 'Delivering Fund Accounting (NAV, ledger, carry waterfall) and SEBI Compliance (QAR/AAR/CTR automation, AML screening).',
    accent: '#f0abfc',
  },
  {
    year: '2026',
    title: 'Global Expansion',
    desc: 'GIFT City IFSC, UAE ADGM/DIFC, and Singapore VCC support. Multi-currency, multi-jurisdiction fund operations.',
    accent: '#fbbf77',
  },
];

const VALUES = [
  {
    title: 'Regulation-First',
    desc: 'Every feature starts with SEBI requirements. Compliance is not an afterthought — it is the architecture.',
    bullets: [
      'SEBI circular intelligence built into every workflow',
      'Automated QAR, AAR, and CTR report generation',
      'Real-time equity concentration threshold alerts',
    ],
  },
  {
    title: 'Intelligence Over Data',
    desc: "We don't just store numbers. We surface insights, predict patterns, and answer questions in natural language.",
    bullets: [
      'Gemini AI for natural-language fund queries',
      'Automated KPI tracking and anomaly detection',
      'Predictive analytics for portfolio performance',
    ],
  },
  {
    title: 'Trust & Transparency',
    desc: 'Org-scoped multi-tenancy, role-based access, complete audit trails. Your data never crosses boundaries.',
    bullets: [
      'Organization-scoped data isolation',
      'Role-based access — Admin, GP, LP, Compliance, Viewer',
      'Complete audit trail on every CRUD operation',
    ],
  },
  {
    title: 'Built in India, for India',
    desc: 'INR-native, Indian accounting standards, SEBI circular intelligence, and workflows designed for how Indian AIFs actually operate.',
    bullets: [
      'INR-native with Indian GAAP and Ind AS support',
      'Tally XML integration for statutory books',
      '19 SEBI investor types with digital KYC',
    ],
  },
];

function useTimelineReveal() {
  useEffect(() => {
    // Each .timeline-entry is observed individually so cards animate
    // one-by-one as the user scrolls — not all at once.
    const entries = document.querySelectorAll<HTMLElement>('.timeline-entry[data-index]');
    if (entries.length === 0) return;

    const io = new IntersectionObserver(
      (observations) => {
        observations.forEach((obs) => {
          if (!obs.isIntersecting) return;
          const entry = obs.target as HTMLElement;
          io.unobserve(entry);

          // Animate: node first, then card slides in 120 ms later
          const node = entry.querySelector<HTMLElement>('.timeline-node');
          const card = entry.querySelector<HTMLElement>('.timeline-card');

          if (node) {
            setTimeout(() => node.classList.add('is-visible'), 0);
          }
          if (card) {
            setTimeout(() => card.classList.add('is-visible'), 120);
          }
        });
      },
      // High bottom margin so each card fires only when it's well into view
      { rootMargin: '0px 0px -18% 0px', threshold: 0.15 },
    );

    entries.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export default function AboutPage() {
  useReveal();
  useTimelineReveal();

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — Text left, globe is in 3D canvas far right
          (globe rolls to center as user scrolls)
      ════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cinematic gradient light — top left */}
        <div
          className="cinematic-light"
          style={{
            width: 500, height: 500,
            top: -100, left: -80,
            background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Cinematic gradient light — bottom right */}
        <div
          className="cinematic-light"
          style={{
            width: 400, height: 400,
            bottom: -80, right: '30%',
            background: 'radial-gradient(circle, rgba(240,171,252,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="container-x" style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="reveal mb-4">
                <span className="eyebrow">Our Story</span>
              </div>
              <h1 className="display-hero reveal" data-delay="100">
                Reimagining<br />
                <span className="gradient-text">fund operations.</span>
              </h1>
              <p
                className="reveal mt-4 text-muted-strong"
                data-delay="250"
                style={{ maxWidth: '520px', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.65 }}
              >
                TrackFundAI was born from a simple observation: India&apos;s fastest-growing
                asset class — AIFs — was running on the slowest tools. We&apos;re building
                the operating system these funds deserve.
              </p>

              {/* Quick stats row */}
              <div
                className="reveal mt-5 d-flex gap-4 flex-wrap"
                data-delay="380"
              >
                {[
                  { val: '₹8.5L Cr', label: 'AIF market we serve' },
                  { val: '70%',       label: 'compliance time saved' },
                  { val: '99.9%',     label: 'NAV accuracy' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {s.val}
                    </div>
                    <div className="stat-label" style={{ marginTop: '0.3rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right column is intentionally empty — the 3D globe occupies that space on canvas */}
          </div>
        </div>
      </section>

      {/* Scroll hint */}
      <div
        className="reveal"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-2rem',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--muted)',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          <span>Scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <rect x="4" y="2" width="4" height="6" rx="2" fill="currentColor" opacity="0.5" />
            <rect x="5.5" y="0" width="1" height="20" rx="0.5" fill="currentColor" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          01 / MISSION — Globe arrives at center here
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Cinematic light — purple bloom right */}
        <div className="cinematic-light" style={{
          width: 600, height: 600,
          top: '10%', right: -150,
          background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 65%)',
        }} />

        <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">01 / Mission</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-7 reveal">
              <h2 className="display-section">
                Automate the <span className="gradient-text">mundane</span>.<br />
                Amplify the <span className="gradient-text">strategic</span>.
              </h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '540px' }}>
                Fund managers spend 60% of their time on operational tasks that
                software should handle — NAV calculations, compliance reports,
                capital call notices, KYC verification. TrackFundAI automates
                all of it.
              </p>
              <p className="mt-3 text-muted-strong" style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '540px' }}>
                The result? More time for deal sourcing, LP relationships, and
                strategic portfolio decisions. That&apos;s what fund managers should
                be doing.
              </p>
            </div>

            <div className="col-12 col-lg-5 reveal" data-delay="200">
              <div className="glass-strong p-4 p-md-5" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Inner cinematic glow */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
                  background: 'radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.12) 0%, transparent 60%)',
                }} />
                <div className="row g-4" style={{ position: 'relative', zIndex: 1 }}>
                  {[
                    { label: 'Time Saved',    value: '70%',   sub: 'on compliance reporting' },
                    { label: 'Accuracy',      value: '99.9%', sub: 'NAV computation' },
                    { label: 'LP Onboarding', value: '3x',    sub: 'faster with digital KYC' },
                    { label: 'Audit Ready',   value: '24/7',  sub: 'complete trail always' },
                  ].map((m) => (
                    <div className="col-6" key={m.label}>
                      <div className="stat-label" style={{ marginTop: 0 }}>{m.label}</div>
                      <div className="gradient-text mt-1" style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {m.value}
                      </div>
                      <p className="text-muted-soft mt-2" style={{ fontSize: '0.78rem' }}>{m.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          02 / PRINCIPLES — Globe still centered, dimmed behind
      ════════════════════════════════════════════════════ */}
      <section className="section section-principles" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Cinematic dimming veil — sits between the fixed 3D canvas and content */}
        <div className="principles-veil" aria-hidden="true" />

        {/* Cinematic light — warm bloom bottom left */}
        <div className="cinematic-light" style={{
          width: 500, height: 500,
          bottom: '5%', left: -100,
          background: 'radial-gradient(circle, rgba(228,76,58,0.12) 0%, transparent 65%)',
        }} />
        {/* Cinematic light — magenta bloom top right */}
        <div className="cinematic-light" style={{
          width: 450, height: 450,
          top: '0%', right: -80,
          background: 'radial-gradient(circle, rgba(194,65,147,0.12) 0%, transparent 65%)',
        }} />

        <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">02 / Principles</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row mb-5">
            <div className="col-12 col-lg-7 reveal">
              <span className="eyebrow d-inline-flex">Our principles</span>
              <h2 className="display-section mt-3" style={{ fontWeight: 700, textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}>
                What drives <span className="gradient-text">us.</span>
              </h2>
              <p className="mt-4" style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '540px', color: 'var(--fg-strong)', fontWeight: 500, textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
                Four principles that shape every line of code and every product decision we make.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div className="col-12 col-md-6 reveal" data-delay={i * 80} key={v.title}>
                <div className="module-card principles-card h-100" style={{ position: 'relative', overflow: 'hidden' }}>
                  {/* Cinematic inner glow per card */}
                  <div style={{
                    position: 'absolute',
                    top: -40, right: -40,
                    width: 220, height: 220,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${
                      i % 4 === 0 ? 'rgba(228,76,58,0.18)' :
                      i % 4 === 1 ? 'rgba(194,65,147,0.16)' :
                      i % 4 === 2 ? 'rgba(190,61,146,0.16)' :
                                    'rgba(107,75,161,0.18)'
                    } 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <span className="section-number">0{i + 1}</span>
                      <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
                    </div>
                    <h3 style={{ fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--fg-strong)' }}>
                      {v.title}
                    </h3>
                    <p className="mt-3" style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'var(--fg-strong)', fontWeight: 500 }}>
                      {v.desc}
                    </p>
                    <ul className="list-unstyled mt-4 pt-3 d-flex flex-column gap-2" style={{ borderTop: '1px solid var(--glass-border-strong)' }}>
                      {v.bullets.map((b) => (
                        <li
                          key={b}
                          className="d-flex gap-2 align-items-start"
                          style={{ fontSize: '0.9rem', color: 'var(--fg)', lineHeight: 1.55, fontWeight: 500 }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', marginTop: 7, flexShrink: 0 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          03 / TIMELINE — EnergyField 3D backdrop appears
          Alternating left/right entries with cinematic reveals
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Strong cinematic overlay to give section its own atmosphere */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(167,139,250,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">03 / Journey</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row mb-8">
            <div className="col-12 col-lg-8 reveal">
              <span className="eyebrow d-inline-flex">Our timeline</span>
              <h2 className="display-section mt-3">
                Built <span className="gradient-text">milestone</span> by milestone.
              </h2>
              <p className="mt-3 text-muted-strong" style={{ maxWidth: '520px', fontSize: '1rem', lineHeight: 1.6 }}>
                From a spreadsheet observation to a fully-featured fund operating system — every quarter a new layer of intelligence.
              </p>
            </div>
          </div>

          {/* ── Alternating timeline ── */}
          <div style={{ position: 'relative', paddingTop: '1rem', paddingBottom: '2rem' }}>
            {/* Center luminous rail */}
            <div className="timeline-center-rail" />

            <div className="d-flex flex-column" style={{ gap: '3rem' }}>
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  // data-index lets useTimelineReveal observe each row individually
                  <div key={item.year} className="timeline-entry" data-index={i} style={{ marginBottom: 0 }}>

                    {/* LEFT side content */}
                    <div className="timeline-entry-left">
                      {isLeft ? (
                        <div
                          className="timeline-card timeline-card-left"
                          style={{ maxWidth: '100%', textAlign: 'left' }}
                          data-accent={item.accent}
                        >
                          <div
                            className="timeline-card-glow left"
                            style={{ background: `radial-gradient(circle, ${item.accent}55, transparent)` }}
                          />
                          <span className="timeline-year">{item.year}</span>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-strong)', marginBottom: '0.5rem' }}>
                            {item.title}
                          </h3>
                          <p className="typing-text">{item.desc}</p>
                        </div>
                      ) : null}
                    </div>

                    {/* CENTER — node dot */}
                    <div className="timeline-entry-center">
                      <div
                        className="timeline-node"
                        style={{ background: `linear-gradient(135deg, ${item.accent}, #f0abfc)` }}
                      />
                    </div>

                    {/* RIGHT side content */}
                    <div className="timeline-entry-right">
                      {!isLeft ? (
                        <div
                          className="timeline-card timeline-card-right"
                          data-accent={item.accent}
                        >
                          <div
                            className="timeline-card-glow right"
                            style={{ background: `radial-gradient(circle, ${item.accent}55, transparent)` }}
                          />
                          <span className="timeline-year">{item.year}</span>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-strong)', marginBottom: '0.5rem' }}>
                            {item.title}
                          </h3>
                          <p className="typing-text">{item.desc}</p>
                        </div>
                      ) : null}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          04 / TEAM — Starfield 3D appears in background
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Cinematic multi-point light rig for team section */}
        <div className="cinematic-light" style={{
          width: 700, height: 700,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 60%)',
        }} />
        <div className="cinematic-light" style={{
          width: 300, height: 300,
          top: '10%', left: '15%',
          background: 'radial-gradient(circle, rgba(240,171,252,0.12) 0%, transparent 70%)',
        }} />
        <div className="cinematic-light" style={{
          width: 280, height: 280,
          bottom: '5%', right: '10%',
          background: 'radial-gradient(circle, rgba(251,191,119,0.10) 0%, transparent 70%)',
        }} />

        <div className="container-x text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal d-inline-block">
            <span className="eyebrow">The Team</span>
          </div>
          <h2 className="display-section reveal mt-3" data-delay="100">
            By <span className="gradient-text">Trivesta Consulting.</span>
          </h2>
          <p className="reveal mt-4 mx-auto text-muted-strong" data-delay="200" style={{ maxWidth: '580px', fontSize: '1.05rem', lineHeight: 1.65 }}>
            A team of finance professionals, regulatory experts, and AI engineers
            building the future of fund management in India.
          </p>

          {/* Three discipline cards */}
          <div className="row g-4 mt-4 justify-content-center">
            {[
              {
                icon: '📊',
                label: 'Finance',
                value: 'Deep AIF Expertise',
                desc: 'Ex-fund managers and CFAs who have lived the operational pain firsthand.',
                cardClass: 'team-card-finance',
              },
              {
                icon: '⚙️',
                label: 'Engineering',
                value: 'Full-Stack AI',
                desc: 'Engineers who ship production-grade AI systems, not demos.',
                cardClass: 'team-card-engineering',
              },
              {
                icon: '⚖️',
                label: 'Compliance',
                value: 'SEBI Specialists',
                desc: 'Regulatory experts who translate every SEBI circular into software logic.',
                cardClass: 'team-card-compliance',
              },
            ].map((t, i) => (
              <div className="col-12 col-md-4 reveal" data-delay={i * 120} key={t.label}>
                <div className={`team-discipline-card ${t.cardClass} p-4 h-100`}>
                  {/* Hover shimmer overlay — transitions on hover */}
                  <div className="team-card-shimmer" aria-hidden="true" />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.icon}</div>
                    <div className="stat-label" style={{ marginTop: 0 }}>{t.label}</div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--fg-strong)', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
                      {t.value}
                    </p>
                    <p className="mt-2 text-muted-strong" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trivesta branding chip */}
          <div className="reveal mt-5 mx-auto" data-delay="360" style={{ maxWidth: '560px' }}>
            <div
              className="glass p-4"
              style={{
                borderColor: 'var(--glass-border-strong)',
                background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(240,171,252,0.06))',
              }}
            >
              <p className="text-muted-strong" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Trivesta Consulting brings together deep domain expertise across Indian
                alternative investments, SEBI regulatory frameworks, and enterprise AI
                infrastructure — all under one mission-driven roof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Cinematic bloom */}
        <div className="cinematic-light" style={{
          width: 600, height: 600,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 60%)',
        }} />

        <div className="container-x text-center" style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <h2 className="display-section reveal">
            Let&apos;s build the future <span className="gradient-text">together.</span>
          </h2>
          <p className="reveal mt-4 text-muted-strong" data-delay="100" style={{ fontSize: '1.05rem' }}>
            Whether you&apos;re an AIF looking to modernize, or a technology partner — we&apos;d love to talk.
          </p>
          <div className="reveal mt-5 d-flex flex-column flex-sm-row gap-3 justify-content-center" data-delay="200">
            <Link href="/contact" className="btn-primary-fancy">
              Get in Touch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/solutions" className="btn-ghost">
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
