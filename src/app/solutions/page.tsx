'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import useReveal from '@/components/useReveal';

const MODULES = [
  { id: 'fund-admin', number: '01', title: 'Fund Administration', subtitle: 'The Foundation', icon: '🏛', accent: '#a78bfa', desc: 'Set up funds, schemes, and entities with SEBI-compliant metadata. Manage multi-fund architectures with automated regulatory categorization.', features: ['Fund & scheme CRUD with SEBI registration tracking', 'Entity management — Investment Manager, Trustee, Custodian', 'Category I/II/III classification with sub-category support', 'Open-ended and close-ended scheme lifecycle management', 'Multi-currency support with INR as base'] },
  { id: 'lp-mgmt', number: '02', title: 'LP Management', subtitle: 'Investor Lifecycle', icon: '👥', accent: '#f0abfc', desc: 'From KYC onboarding to distributions — manage the complete LP relationship. Capital calls, unit allotment, waterfall calculations, and a self-service LP Portal.', features: ['Investor onboarding with 19 investor types & digital KYC', 'Commitment tracking with close-type management', 'Capital call generation, notices, and UTR matching', 'Distribution processing with TDS computation', 'European waterfall simulation with compound preferred return', 'LP Portal — investor self-service with IRR/TVPI/DPI/MOIC'] },
  { id: 'portfolio', number: '03', title: 'Portfolio Intelligence', subtitle: 'AI-Powered Analytics', icon: '🧠', accent: '#34d399', desc: 'Real-time portfolio monitoring with multi-fund comparison, deep-dive company analysis, and an AI chatbot that answers natural-language queries about your fund.', features: ['Portfolio dashboard with sector, stage, and vintage analysis', 'Multi-fund comparison with side-by-side benchmarking', 'Deep-dive company profiles with KPI history', 'Gemini AI chatbot for natural-language fund queries', 'Automated exit tracking and board meeting management', 'Board pack generation for investment committee reviews'] },
  { id: 'accounting', number: '04', title: 'Fund Accounting', subtitle: 'NAV & Ledger', icon: '📊', accent: '#fbbf24', desc: 'NAV computation, general ledger, management fee calculations, carry waterfall distributions, and seamless Tally integration for statutory compliance.', features: ['Daily/periodic NAV calculation engine', 'Double-entry general ledger with journal entries', 'Management fee computation and tracking', 'Carry waterfall with hurdle rate calculations', 'Tally XML import/export for statutory books', 'Trial balance, P&L, and balance sheet generation'] },
  { id: 'compliance', number: '05', title: 'SEBI Compliance', subtitle: 'Regulatory Intelligence', icon: '⚖️', accent: '#f472b6', desc: 'Automated quarterly, annual, and semi-annual report generation. AML screening, equity threshold monitoring, and circular intelligence.', features: ['QAR (Quarterly Activity Report) auto-generation', 'AAR (Annual Audit Report) automation', 'CTR (Change in Terms Report) tracking', 'AML/CFT screening and PEP monitoring', 'Equity concentration threshold alerts', 'SEBI circular intelligence and compliance calendar'] },
  { id: 'docs', number: '06', title: 'Documents & Notifications', subtitle: 'Communication Hub', icon: '📁', accent: '#06b6d4', desc: 'Secure document vault with versioning, automated PDF report generation, and multi-channel notifications via email, WhatsApp, and in-app alerts.', features: ['Document vault with category tagging and versioning', 'LP-visible document sharing with access control', 'Automated PDF generation for reports and statements', 'Email notifications via SendGrid integration', 'WhatsApp alerts via Twilio/WATI', 'In-app notification center with mark-read tracking'] },
  { id: 'rbac', number: '07', title: 'Users & Access Control', subtitle: 'Security Layer', icon: '🔐', accent: '#818cf8', desc: 'Multi-tenancy with organization-scoped data isolation, role-based access control, and complete audit trails on every operation.', features: ['Organization-scoped multi-tenancy', 'Role-based access — Admin, GP, LP, Compliance, Viewer', 'JWT authentication with token refresh', 'Complete audit trail on every CRUD and action', 'MFA-ready authentication infrastructure', 'Session management with secure token lifecycle'] },
];

const TECH_LAYERS = [
  { name: 'Backend & Data', layer: 'A', tech: [{ name: 'Django + DRF', role: 'API Backend', detail: 'Battle-tested Python framework powering 200+ RESTful endpoints with automatic schema generation.', chips: ['200+ endpoints', 'Auto schema', 'Validation'] }, { name: 'PostgreSQL', role: 'Database', detail: 'ACID-compliant relational database with row-level security, JSONB support, and full-text search.', chips: ['Row-level security', 'JSONB', 'Full-text search'] }, { name: 'Celery + Redis', role: 'Task Queue', detail: 'Distributed task processing for async report generation, scheduled SEBI filings, email campaigns.', chips: ['Async', 'Scheduled', 'Monitored'] }] },
  { name: 'Intelligence & Analytics', layer: 'B', tech: [{ name: 'Gemini AI', role: 'Intelligence Engine', detail: "Google's multimodal AI powering natural-language fund queries, automated summaries, and anomaly detection.", chips: ['NL queries', 'Auto summaries', 'Anomaly detection'] }, { name: 'Chart.js + D3', role: 'Visualization', detail: 'Interactive charts for portfolio composition, NAV trends, IRR waterfalls, and fund comparison.', chips: ['IRR waterfalls', 'NAV trends', 'Comparison'] }, { name: 'PDF Engine', role: 'Reports', detail: 'Automated board packs, LP statements, compliance reports as pixel-perfect branded PDFs.', chips: ['Board packs', 'LP statements', 'Branded'] }] },
  { name: 'Security & Integration', layer: 'C', tech: [{ name: 'JWT + RBAC', role: 'Auth', detail: 'Stateless token-based auth with role-based access control and MFA-ready infrastructure.', chips: ['Stateless', 'MFA-ready', 'Sessions'] }, { name: 'SendGrid', role: 'Email', detail: 'Transactional email delivery for capital calls, distributions, compliance alerts, LP onboarding.', chips: ['Transactional', 'Tracking', 'Templates'] }, { name: 'Tally XML', role: 'ERP', detail: 'Bi-directional sync with Tally ERP for statutory book-keeping and ledger reconciliation.', chips: ['Bi-directional', 'Vouchers', 'Reconciliation'] }] },
];

function useModuleReveal() {
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('.sol-module-row');
    if (!rows.length) return;
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }); },
      { threshold: 0.10, rootMargin: '0px 0px -6% 0px' },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
}

export default function SolutionsPage() {
  useReveal();
  useModuleReveal();

  const auroraRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = auroraRef.current;
    if (!el) return;
    const onScroll = () => {
      const sp = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      el.style.setProperty('--sol-sp', sp.toFixed(3));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Full-page scroll-driven right-side aurora overlay */}
      <div ref={auroraRef} className="sol-aurora-wrap" aria-hidden="true">
        <div className="sol-aurora-core" />
        <div className="sol-aurora-ray sol-aurora-ray-1" />
        <div className="sol-aurora-ray sol-aurora-ray-2" />
        <div className="sol-aurora-ray sol-aurora-ray-3" />
        <div className="sol-aurora-ray sol-aurora-ray-4" />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="sol-hero">
        <div className="container-x">
          <div className="reveal mb-3"><span className="eyebrow">Platform</span></div>
          <h1 className="display-hero reveal" data-delay="100" style={{ maxWidth: '900px' }}>
            Seven modules.<br /><span className="gradient-text">One platform.</span>
          </h1>
          <p className="reveal mt-4 text-muted-strong" data-delay="250"
            style={{ maxWidth: '600px', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.65 }}>
            Every module is purpose-built for the AIF lifecycle — from fund inception
            through SEBI reporting to LP distributions. No bolt-ons, no workarounds.
          </p>
          <div className="sol-hero-orbs" aria-hidden="true">
            <div className="sol-hero-orb sol-orb-1" />
            <div className="sol-hero-orb sol-orb-2" />
            <div className="sol-hero-orb sol-orb-3" />
          </div>
        </div>
      </section>

      {/* ═══ MODULES ═══ */}
      <section className="sol-modules-section">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">01 / Modules</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>
          <div className="sol-modules-list">
            {MODULES.map((m, i) => (
              <div
                key={m.id}
                className={`sol-module-row ${i % 2 === 1 ? 'sol-row-reverse' : ''}`}
                style={{ '--module-accent': m.accent } as React.CSSProperties}
              >
                <div className="sol-module-text">
                  <div className="sol-module-eyebrow">
                    <span className="section-number">{m.number}</span>
                    <span className="eyebrow" style={{ margin: 0 }}>{m.subtitle}</span>
                  </div>
                  <h2 className="display-section mt-2"><span className="gradient-text">{m.title}</span></h2>
                  <p className="mt-3 text-muted-strong" style={{ fontSize: '1rem', lineHeight: 1.65, maxWidth: '500px' }}>{m.desc}</p>
                  <ul className="list-unstyled mt-4 d-flex flex-column gap-2">
                    {m.features.map((f) => (
                      <li key={f} className="d-flex gap-2 align-items-start">
                        <span className="sol-feature-dot" style={{ background: m.accent }} />
                        <span style={{ fontSize: '0.95rem', color: 'var(--fg)', lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sol-module-card-wrap">
                  <div className="sol-module-card">
                    <div className="sol-card-front">
                      <div className="sol-card-icon" style={{ color: m.accent }}>{m.icon}</div>
                      <div className="sol-card-watermark">{m.number}</div>
                      <h3 className="sol-card-title">{m.title}</h3>
                      <p className="sol-card-sub">{m.features.length} capabilities</p>
                      <div className="sol-card-bars">
                        {m.features.map((_, fi) => (
                          <div key={fi} className="sol-card-bar" style={{ background: m.accent, opacity: 0.25 + (fi / m.features.length) * 0.75 }} />
                        ))}
                      </div>
                      <div className="sol-card-glow" style={{ background: `radial-gradient(circle at 70% 30%, ${m.accent}33 0%, transparent 65%)` }} />
                    </div>
                    <div className="sol-card-back" style={{ borderColor: m.accent + '44' }}>
                      <div className="sol-card-icon sol-card-icon-sm" style={{ color: m.accent }}>{m.icon}</div>
                      <h4 className="sol-card-back-title" style={{ color: m.accent }}>{m.subtitle}</h4>
                      <p className="sol-card-back-desc">{m.desc}</p>
                      <div className="sol-card-back-chips">
                        {m.features.slice(0, 3).map((f) => (
                          <span key={f} className="sol-chip" style={{ borderColor: m.accent + '55', color: m.accent }}>{f.split('—')[0].split('with')[0].trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <section className="sol-tech-section">
        <div className="sol-tech-bg" aria-hidden="true" />
        <div className="sol-tech-aurora" aria-hidden="true" />
        <div className="container-x" style={{ position: 'relative', zIndex: 2 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">02 / Technology</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>
          <div className="row mb-5">
            <div className="col-12 col-lg-7 reveal">
              <span className="eyebrow d-inline-flex">Technology</span>
              <h2 className="display-section mt-3">Enterprise-grade <span className="gradient-text">stack.</span></h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.02rem', lineHeight: 1.65, maxWidth: '560px' }}>
                Battle-tested technologies chosen for reliability, security, and scale.
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
                      <div className="sol-tech-card">
                        <div className="sol-tech-card-inner">
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--fg-strong)' }}>{t.name}</h4>
                          <p className="text-muted-soft mt-1" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.role}</p>
                          <p className="mt-3 text-muted-strong" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{t.detail}</p>
                          <div className="d-flex flex-wrap gap-2 mt-4">
                            {t.chips.map((c) => <span key={c} className="sol-chip">{c}</span>)}
                          </div>
                        </div>
                        <div className="sol-tech-card-glow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-5" data-delay="200">
            <div className="glass-strong p-4 p-md-5 position-relative" style={{ overflow: 'hidden' }}>
              <div className="row g-4 text-center">
                {[{ value: '200+', label: 'API Endpoints' }, { value: '99.9%', label: 'Uptime SLA' }, { value: '<200ms', label: 'Avg Response' }, { value: 'SOC 2', label: 'Ready' }].map((s) => (
                  <div className="col-6 col-md-3" key={s.label}>
                    <div className="stat-value" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.14) 0%, transparent 60%)', borderRadius: 'inherit' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA — meteor shower from SolutionsScene shows through semi-transparent bg ═══ */}
      <section className="sol-cta-section">
        <div className="sol-cta-bg" aria-hidden="true" />
        <div className="container-x text-center" style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          <h2 className="display-section reveal">See it in <span className="gradient-text">action.</span></h2>
          <p className="reveal mt-4 mx-auto text-muted-strong" data-delay="100"
            style={{ maxWidth: '520px', fontSize: '1.05rem', lineHeight: 1.6 }}>
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
            <Link href="/insights" className="btn-ghost">Read Insights</Link>
          </div>
        </div>
      </section>
    </>
  );
}
