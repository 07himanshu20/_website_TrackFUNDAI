'use client';

import Link from 'next/link';
import useReveal from '@/components/useReveal';

const MODULES = [
  {
    id: 'fund-admin',
    number: '01',
    title: 'Fund Administration',
    subtitle: 'The Foundation',
    desc: 'Set up funds, schemes, and entities with SEBI-compliant metadata. Manage multi-fund architectures with automated regulatory categorization.',
    features: [
      'Fund & scheme CRUD with SEBI registration tracking',
      'Entity management — Investment Manager, Trustee, Custodian',
      'Category I/II/III classification with sub-category support',
      'Open-ended and close-ended scheme lifecycle management',
      'Multi-currency support with INR as base',
    ],
  },
  {
    id: 'lp-mgmt',
    number: '02',
    title: 'LP Management',
    subtitle: 'Investor Lifecycle',
    desc: 'From KYC onboarding to distributions — manage the complete LP relationship. Capital calls, unit allotment, waterfall calculations, and a self-service LP Portal.',
    features: [
      'Investor onboarding with 19 investor types & digital KYC',
      'Commitment tracking with close-type management',
      'Capital call generation, notices, and UTR matching',
      'Distribution processing with TDS computation',
      'European waterfall simulation with compound preferred return',
      'LP Portal — investor self-service with IRR/TVPI/DPI/MOIC',
    ],
  },
  {
    id: 'portfolio',
    number: '03',
    title: 'Portfolio Intelligence',
    subtitle: 'AI-Powered Analytics',
    desc: 'Real-time portfolio monitoring with multi-fund comparison, deep-dive company analysis, and an AI chatbot that answers natural-language queries about your fund.',
    features: [
      'Portfolio dashboard with sector, stage, and vintage analysis',
      'Multi-fund comparison with side-by-side benchmarking',
      'Deep-dive company profiles with KPI history',
      'Gemini AI chatbot for natural-language fund queries',
      'Automated exit tracking and board meeting management',
      'Board pack generation for investment committee reviews',
    ],
  },
  {
    id: 'accounting',
    number: '04',
    title: 'Fund Accounting',
    subtitle: 'NAV & Ledger',
    desc: 'NAV computation, general ledger, management fee calculations, carry waterfall distributions, and seamless Tally integration for statutory compliance.',
    features: [
      'Daily/periodic NAV calculation engine',
      'Double-entry general ledger with journal entries',
      'Management fee computation and tracking',
      'Carry waterfall with hurdle rate calculations',
      'Tally XML import/export for statutory books',
      'Trial balance, P&L, and balance sheet generation',
    ],
  },
  {
    id: 'compliance',
    number: '05',
    title: 'SEBI Compliance',
    subtitle: 'Regulatory Intelligence',
    desc: 'Automated quarterly, annual, and semi-annual report generation. AML screening, equity threshold monitoring, and circular intelligence that keeps you ahead of regulations.',
    features: [
      'QAR (Quarterly Activity Report) auto-generation',
      'AAR (Annual Audit Report) automation',
      'CTR (Change in Terms Report) tracking',
      'AML/CFT screening and PEP monitoring',
      'Equity concentration threshold alerts',
      'SEBI circular intelligence and compliance calendar',
    ],
  },
  {
    id: 'docs',
    number: '06',
    title: 'Documents & Notifications',
    subtitle: 'Communication Hub',
    desc: 'Secure document vault with versioning, automated PDF report generation, and multi-channel notifications via email, WhatsApp, and in-app alerts.',
    features: [
      'Document vault with category tagging and versioning',
      'LP-visible document sharing with access control',
      'Automated PDF generation for reports and statements',
      'Email notifications via SendGrid integration',
      'WhatsApp alerts via Twilio/WATI',
      'In-app notification center with mark-read tracking',
    ],
  },
  {
    id: 'rbac',
    number: '07',
    title: 'Users & Access Control',
    subtitle: 'Security Layer',
    desc: 'Multi-tenancy with organization-scoped data isolation, role-based access control, and complete audit trails on every operation.',
    features: [
      'Organization-scoped multi-tenancy',
      'Role-based access — Admin, GP, LP, Compliance, Viewer',
      'JWT authentication with token refresh',
      'Complete audit trail on every CRUD and action',
      'MFA-ready authentication infrastructure',
      'Session management with secure token lifecycle',
    ],
  },
];

const TECH_LAYERS: { name: string; layer: string; tech: { name: string; role: string; detail: string; chips: string[] }[] }[] = [
  {
    name: 'Backend & Data',
    layer: 'A',
    tech: [
      {
        name: 'Django + DRF',
        role: 'API Backend',
        detail: 'Battle-tested Python framework powering 200+ RESTful endpoints with automatic schema generation.',
        chips: ['200+ endpoints', 'Auto schema', 'Validation'],
      },
      {
        name: 'PostgreSQL',
        role: 'Database',
        detail: 'ACID-compliant relational database with row-level security, JSONB support, and full-text search.',
        chips: ['Row-level security', 'JSONB', 'Full-text search'],
      },
      {
        name: 'Celery + Redis',
        role: 'Task Queue',
        detail: 'Distributed task processing for async report generation, scheduled SEBI filings, email campaigns.',
        chips: ['Async', 'Scheduled', 'Monitored'],
      },
    ],
  },
  {
    name: 'Intelligence & Analytics',
    layer: 'B',
    tech: [
      {
        name: 'Gemini AI',
        role: 'Intelligence Engine',
        detail: "Google's multimodal AI powering natural-language fund queries, automated summaries, and anomaly detection.",
        chips: ['NL queries', 'Auto summaries', 'Anomaly detection'],
      },
      {
        name: 'Chart.js + D3',
        role: 'Visualization',
        detail: 'Interactive charts for portfolio composition, NAV trends, IRR waterfalls, and fund comparison.',
        chips: ['IRR waterfalls', 'NAV trends', 'Comparison'],
      },
      {
        name: 'PDF Engine',
        role: 'Reports',
        detail: 'Automated board packs, LP statements, compliance reports as pixel-perfect branded PDFs.',
        chips: ['Board packs', 'LP statements', 'Branded'],
      },
    ],
  },
  {
    name: 'Security & Integration',
    layer: 'C',
    tech: [
      {
        name: 'JWT + RBAC',
        role: 'Auth',
        detail: 'Stateless token-based auth with role-based access control and MFA-ready infrastructure.',
        chips: ['Stateless', 'MFA-ready', 'Sessions'],
      },
      {
        name: 'SendGrid',
        role: 'Email',
        detail: 'Transactional email delivery for capital calls, distributions, compliance alerts, LP onboarding.',
        chips: ['Transactional', 'Tracking', 'Templates'],
      },
      {
        name: 'Tally XML',
        role: 'ERP',
        detail: 'Bi-directional sync with Tally ERP for statutory book-keeping and ledger reconciliation.',
        chips: ['Bi-directional', 'Vouchers', 'Reconciliation'],
      },
    ],
  },
];

export default function SolutionsPage() {
  useReveal();

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '70vh', position: 'relative' }}
      >
        <div className="container-x" style={{ paddingTop: '6rem' }}>
          <div className="reveal mb-4">
            <span className="eyebrow">Platform</span>
          </div>
          <h1 className="display-hero reveal" data-delay="100" style={{ maxWidth: '900px' }}>
            Seven modules.<br />
            <span className="gradient-text">One platform.</span>
          </h1>
          <p
            className="reveal mt-4 text-muted-strong"
            data-delay="250"
            style={{ maxWidth: '620px', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.6 }}
          >
            Every module is purpose-built for the AIF lifecycle — from fund inception
            through SEBI reporting to LP distributions. No bolt-ons, no workarounds.
          </p>
        </div>
      </section>

      {/* ───────── MODULES ───────── */}
      <section className="section-tight">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">01 / Modules</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="d-flex flex-column" style={{ gap: 'clamp(4rem, 8vw, 7rem)' }}>
            {MODULES.map((m, i) => {
              const reverse = i % 2 === 1;
              return (
                <div className="row g-5 align-items-center" key={m.id}>
                  <div className={`col-12 col-lg-6 ${reverse ? 'order-lg-2' : ''}`}>
                    <div className="reveal" data-delay="100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <span className="section-number">{m.number}</span>
                        <span className="eyebrow" style={{ marginLeft: 0 }}>{m.subtitle}</span>
                      </div>
                      <h2 className="display-section">
                        <span className="gradient-text">{m.title}</span>
                      </h2>
                      <p className="mt-4 text-muted-strong" style={{ fontSize: '1.02rem', lineHeight: 1.65, maxWidth: '520px' }}>
                        {m.desc}
                      </p>

                      <ul className="list-unstyled mt-4 d-flex flex-column gap-2">
                        {m.features.map((f) => (
                          <li
                            key={f}
                            className="d-flex gap-2 align-items-start"
                            style={{ fontSize: '0.95rem', color: 'var(--fg)', lineHeight: 1.5 }}
                          >
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 999,
                                background: 'var(--gradient-primary)',
                                marginTop: 4,
                                flexShrink: 0,
                              }}
                            >
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2">
                                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`col-12 col-lg-6 ${reverse ? 'order-lg-1' : ''}`}>
                    <div className="reveal" data-delay="250">
                      <div
                        className="glass-strong p-4 p-md-5 position-relative"
                        style={{ minHeight: '320px', overflow: 'hidden' }}
                      >
                        {/* Watermark number */}
                        <div
                          aria-hidden
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: 10,
                            fontSize: 'clamp(8rem, 16vw, 14rem)',
                            fontWeight: 600,
                            lineHeight: 0.85,
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            opacity: 0.08,
                            userSelect: 'none',
                            pointerEvents: 'none',
                          }}
                        >
                          {m.number}
                        </div>

                        <div className="position-relative">
                          <div
                            className="d-inline-flex align-items-center justify-content-center mb-4"
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 14,
                              background: 'var(--glass-bg-strong)',
                              border: '1px solid var(--glass-border-strong)',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              color: 'var(--accent-strong)',
                            }}
                          >
                            {m.number}
                          </div>

                          <h3 style={{ fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-0.02em' }}>
                            {m.title}
                          </h3>
                          <p className="mt-2 text-muted-soft" style={{ fontSize: '0.92rem' }}>
                            {m.features.length} capabilities
                          </p>

                          <div
                            className="d-flex gap-1 mt-4 pt-4"
                            style={{ borderTop: '1px solid var(--glass-border)' }}
                          >
                            {m.features.map((_, fi) => (
                              <div
                                key={fi}
                                style={{
                                  flex: 1,
                                  height: 3,
                                  borderRadius: 999,
                                  background: 'var(--gradient-primary)',
                                  opacity: 0.35 + (fi / m.features.length) * 0.65,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── TECH STACK ───────── */}
      <section className="section">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">02 / Technology</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row mb-5">
            <div className="col-12 col-lg-7 reveal">
              <span className="eyebrow d-inline-flex">Technology</span>
              <h2 className="display-section mt-3">
                Enterprise-grade <span className="gradient-text">stack.</span>
              </h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.02rem', lineHeight: 1.65, maxWidth: '560px' }}>
                Battle-tested technologies chosen for reliability, security, and scale.
                Every layer purpose-built for fund operations.
              </p>
            </div>
          </div>

          <div className="d-flex flex-column gap-5">
            {TECH_LAYERS.map((layer) => (
              <div className="reveal" key={layer.name}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="section-number">{layer.layer}</span>
                  <span className="eyebrow" style={{ marginLeft: 0 }}>{layer.name}</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                </div>

                <div className="row g-4">
                  {layer.tech.map((t) => (
                    <div className="col-12 col-md-6 col-lg-4" key={t.name}>
                      <div className="module-card h-100">
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--fg-strong)' }}>{t.name}</h4>
                        <p className="text-muted-soft mt-1" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {t.role}
                        </p>
                        <p className="mt-3 text-muted-strong" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
                          {t.detail}
                        </p>
                        <div className="d-flex flex-wrap gap-2 mt-4">
                          {t.chips.map((c) => (
                            <span
                              key={c}
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.25rem 0.7rem',
                                borderRadius: 999,
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--muted-strong)',
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture summary */}
          <div className="reveal mt-5" data-delay="200">
            <div className="glass-strong p-4 p-md-5">
              <div className="row g-4 text-center">
                {[
                  { value: '200+', label: 'API Endpoints' },
                  { value: '99.9%', label: 'Uptime SLA' },
                  { value: '<200ms', label: 'Avg Response' },
                  { value: 'SOC 2', label: 'Ready' },
                ].map((s) => (
                  <div className="col-6 col-md-3" key={s.label}>
                    <div className="stat-value" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="section">
        <div className="container-x text-center" style={{ maxWidth: '720px' }}>
          <h2 className="display-section reveal">
            See it in <span className="gradient-text">action.</span>
          </h2>
          <p className="reveal mt-4 mx-auto text-muted-strong" data-delay="100" style={{ maxWidth: '520px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every module is live and production-ready. Schedule a walkthrough
            to see how TrackFundAI fits your fund&apos;s workflow.
          </p>
          <div className="reveal mt-5 d-flex flex-column flex-sm-row gap-3 justify-content-center" data-delay="200">
            <Link href="/contact" className="btn-primary-fancy">
              Request Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/insights" className="btn-ghost">
              Read Insights
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
