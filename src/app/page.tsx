'use client';

import Link from 'next/link';
import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import useReveal from '@/components/useReveal';
import { useTheme } from '@/components/ThemeProvider';
import NorthernLights from '@/components/three/NorthernLights';

const FEATURES = [
  {
    icon: '01',
    title: 'Fund Administration',
    desc: 'SEBI-compliant fund and scheme setup with automated entity management, regulatory metadata, and multi-fund architecture.',
  },
  {
    icon: '02',
    title: 'LP Management',
    desc: 'End-to-end investor lifecycle — KYC, commitments, capital calls, distributions, unit allotment, and waterfall calculations.',
  },
  {
    icon: '03',
    title: 'Portfolio Intelligence',
    desc: 'Real-time portfolio monitoring with AI-powered analytics, multi-fund comparison, deep-dive company analysis, and KPI tracking.',
  },
  {
    icon: '04',
    title: 'Fund Accounting',
    desc: 'NAV computation, general ledger, management fee calculations, carry waterfall, and seamless Tally integration.',
  },
  {
    icon: '05',
    title: 'SEBI Compliance',
    desc: 'Automated QAR/AAR/CTR report generation, AML screening, equity threshold monitoring, and circular intelligence.',
  },
  {
    icon: '06',
    title: 'Documents & Notifications',
    desc: 'Secure document vault with versioning, automated PDF generation, email alerts, and WhatsApp notifications.',
  },
];

const STATS = [
  { value: '113+', label: 'API Endpoints' },
  { value: '40+',  label: 'Data Models' },
  { value: '7',    label: 'Integrated Modules' },
  { value: '99%',  label: 'Compliance Automation' },
];

const TAGS = ['SEBI Registered', 'AIF Cat I', 'AIF Cat II', 'AIF Cat III', 'GIFT City', 'NRI Compliant'];

const PRINCIPLES = [
  'SEBI-first architecture — QAR, AAR, CTR built in',
  'Multi-tenancy with org-scoped data isolation',
  'Gemini AI for natural-language fund queries',
  'LP Portal for investor self-service',
  'European waterfall with compound preferred return',
];

const METRICS = [
  { label: 'AUM',  value: '₹ 2.4 Cr', delta: '+18.4%' },
  { label: 'IRR',  value: '24.7%',     delta: '+2.1pp' },
  { label: 'TVPI', value: '1.82x',     delta: '+0.14x' },
];

const BAR_DATA = [40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95];

export default function HomePage() {
  useReveal();
  const { theme } = useTheme();

  // Fade the sunrise light out as the Foundations section scrolls out of view
  const sunriseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sunriseRef.current;
    if (!el) return;
    const section = el.closest('.section-foundations') as HTMLElement | null;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // 1 when section top is at viewport bottom, 0 when section bottom is at viewport top
      const visible = Math.max(0, Math.min(1, (rect.bottom) / (rect.height + viewH)));
      el.style.opacity = String(visible);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════
          HERO — full viewport, canvas fills bg
          Text: left-aligned on lg+, centered on sm
      ═══════════════════════════════════════ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          paddingTop: '7rem',
          paddingBottom: '4rem',
        }}
      >
        <div className="container-x w-100">
          <div className="row align-items-center g-5">
            {/* ── Left: headline + CTAs ── */}
            <div className="col-12 col-lg-6">
              <div className="reveal mb-4">
                <span className="eyebrow">Now Live · Powered by Gemini AI</span>
              </div>

              <h1
                className="reveal"
                data-delay="80"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.04,
                }}
              >
                Intelligence<br />
                for the next<br />
                <span className="gradient-text">era of capital.</span>
              </h1>

              <p
                className="reveal mt-5 text-muted-strong"
                data-delay="200"
                style={{
                  maxWidth: '520px',
                  fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.65,
                }}
              >
                TrackFundAI is the operating system for Alternative Investment
                Funds — automating compliance, streamlining LP relationships,
                and surfacing decisions hidden inside your data.
              </p>

              <div
                className="reveal mt-5 d-flex flex-column flex-sm-row gap-3"
                data-delay="340"
              >
                <Link href="/contact" className="btn-primary-fancy">
                  Request a Demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/solutions" className="btn-ghost">
                  Explore the Platform
                </Link>
              </div>

              {/* Compliance badges */}
              <div
                className="reveal mt-5 d-flex flex-wrap gap-2"
                data-delay="500"
              >
                {TAGS.map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            </div>

            {/* ── Right: empty — 3D globe fills this space via canvas ── */}
            <div className="col-12 col-lg-6" aria-hidden="true" />
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="d-none d-md-flex flex-column align-items-center gap-2"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <span className="eyebrow" style={{ fontSize: '0.62rem' }}>Scroll to explore</span>
          <div
            style={{
              width: 1,
              height: 44,
              background: 'linear-gradient(180deg, var(--accent) 0%, transparent 100%)',
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          01 / Foundations — Stats
          section-bg blocks the fixed 3D canvas
      ═══════════════════════════════════════ */}
      <section className="section-foundations">
        {/* Solid bg layer — hides the fixed 3D canvas behind this section */}
        <div className="foundations-bg" aria-hidden="true" />

        {/* Cinematic sunrise — CSS-only, right-side radiant light */}
        <div ref={sunriseRef} className="sunrise-light" aria-hidden="true">
          <div className="sunrise-ray sunrise-ray-1" />
          <div className="sunrise-ray sunrise-ray-2" />
          <div className="sunrise-ray sunrise-ray-3" />
          <div className="sunrise-core" />
        </div>

        <div className="container-x" style={{ position: 'relative', zIndex: 2 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">01 / Foundations</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          {/* Top row: headline + description only */}
          <div className="row g-4 g-lg-5 align-items-end mb-5">
            <div className="col-12 reveal">
              <h2 className="display-section">
                Engineered<br />
                <span className="gradient-text">at scale.</span>
              </h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '580px' }}>
                A modern data platform purpose-built for the AIF lifecycle — from
                fund inception through SEBI reporting to LP distributions.
              </p>
            </div>
          </div>

          {/* Bottom row: Live Fund Dashboard (left) + Stats grid (right) */}
          <div className="row g-4">
            {/* Chart — Live Fund Dashboard */}
            <div className="col-12 col-md-6 reveal" data-delay="80">
              <div className="glass-strong p-4" style={{ position: 'relative', overflow: 'hidden' }}>
                <div
                  className="d-flex align-items-center justify-content-between mb-4 pb-3"
                  style={{ borderBottom: '1px solid var(--glass-border)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: 'var(--gradient-primary)',
                        display: 'inline-block',
                        boxShadow: '0 0 10px 2px rgba(167,139,250,0.5)',
                        animation: 'pulse-dot 2s ease-in-out infinite',
                      }}
                    />
                    <span className="eyebrow" style={{ margin: 0 }}>Live Fund Dashboard</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: 999,
                      background: 'rgba(167, 139, 250, 0.15)', color: 'var(--accent-strong)', fontWeight: 600,
                    }}
                  >
                    Q4 2025
                  </span>
                </div>
                <div className="row g-3 mb-4">
                  {METRICS.map((m) => (
                    <div className="col-4" key={m.label}>
                      <div className="stat-label" style={{ marginTop: 0 }}>{m.label}</div>
                      <div className="gradient-text mt-1" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-strong)', fontWeight: 500, marginTop: '0.2rem' }}>
                        {m.delta}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                  <div className="stat-label" style={{ marginTop: 0, marginBottom: '0.75rem' }}>NAV Performance (12M)</div>
                  <div className="d-flex align-items-end gap-1" style={{ height: 72 }}>
                    {BAR_DATA.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                          background: i === BAR_DATA.length - 1 ? 'var(--gradient-primary)' : 'var(--glass-border-strong)',
                          opacity: i === BAR_DATA.length - 1 ? 1 : 0.35 + h / 180,
                          transition: 'height 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                  {[
                    { name: 'SEBI QAR', status: 'Auto-generated', pct: 100 },
                    { name: 'LP Capital Calls', status: '3 pending', pct: 68 },
                    { name: 'Portfolio NAV', status: 'Computed daily', pct: 100 },
                  ].map((row) => (
                    <div key={row.name} className="d-flex align-items-center gap-3">
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted-strong)', minWidth: 110 }}>{row.name}</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--glass-border-strong)', overflow: 'hidden' }}>
                        <div style={{ width: `${row.pct}%`, height: '100%', borderRadius: 999, background: 'var(--gradient-primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)', minWidth: 90, textAlign: 'right' }}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 85% 10%, var(--accent-glow) 0%, transparent 55%)', borderRadius: 'inherit' }} />
              </div>
            </div>

            {/* Stats grid — 113+, 40+, 7, 99% + live ticker */}
            <div className="col-12 col-md-6 reveal" data-delay="180">
              <div className="glass-strong p-4 p-md-5" style={{ height: '100%' }}>
                <div className="row g-4 mb-2">
                  {STATS.map((s, i) => (
                    <div className="col-6 reveal" data-delay={i * 100} key={s.label}>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div
                  className="d-flex align-items-center gap-4 mt-4 pt-4"
                  style={{ borderTop: '1px solid var(--glass-border)', overflowX: 'auto' }}
                >
                  {[
                    { label: 'AIF Cat II Funds', val: '1,240+', trend: '↑' },
                    { label: 'SEBI Circulars',   val: '380+',   trend: '↑' },
                    { label: 'AUM (Industry)',    val: '₹9.9L Cr', trend: '↑' },
                    { label: 'Active LPs',        val: '72,000+', trend: '↑' },
                  ].map((item) => (
                    <div key={item.label} style={{ flexShrink: 0 }}>
                      <div className="stat-label" style={{ marginTop: 0 }}>{item.label}</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--fg-strong)', marginTop: 2 }}>
                        <span className="gradient-text">{item.trend}</span>{' '}{item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          02 / Platform — Feature modules
          Northern Lights 3D background — this section only
      ═══════════════════════════════════════ */}
      <section className="section-platform">
        {/* Solid bg to block fixed canvas behind */}
        <div className="platform-bg" aria-hidden="true" />
        {/* Dedicated northern-lights canvas — absolute, fills section */}
        <div className="platform-canvas" aria-hidden="true">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 70 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <NorthernLights theme={theme} />
            </Suspense>
          </Canvas>
        </div>

        <div className="container-x" style={{ position: 'relative', zIndex: 2 }}>
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">02 / Platform</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row align-items-end mb-5">
            <div className="col-12 col-lg-7 reveal">
              <span className="eyebrow mb-3 d-inline-flex">Seven purpose-built modules</span>
              <h2 className="display-section mt-3">
                Everything you need.<br />
                <span className="gradient-text">Nothing you don&apos;t.</span>
              </h2>
            </div>
            <div className="col-12 col-lg-5 reveal" data-delay="150">
              <p className="text-muted-strong mt-4 mt-lg-0" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Each module addresses a distinct pillar of fund operations.
                Together they form a single, coherent system — no integrations,
                no data silos.
              </p>
            </div>
          </div>

          <div className="row g-3 g-md-4">
            {FEATURES.map((f, i) => (
              <div className="col-12 col-md-6 col-lg-4 reveal" data-delay={i * 80} key={f.icon}>
                <div className="module-card">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'var(--glass-bg-strong)',
                        border: '1px solid var(--glass-border-strong)',
                        color: 'var(--accent-strong)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {f.icon}
                    </span>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        border: '1px solid var(--glass-border-strong)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--muted)',
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 500, letterSpacing: '-0.02em' }}>
                    {f.title}
                  </h3>
                  <p className="mt-3 text-muted-strong" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          03 / Built in India
      ═══════════════════════════════════════ */}
      <section className="section">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">03 / Built in India</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-7 reveal">
              <span className="eyebrow mb-3 d-inline-flex">Why TrackFundAI</span>
              <h2 className="display-section mt-3">
                Built for India&apos;s<br />
                <span className="gradient-text">AIF ecosystem.</span>
              </h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.02rem', lineHeight: 1.65, maxWidth: '540px' }}>
                Most fund management tools are retrofitted from Western markets.
                TrackFundAI is purpose-built for SEBI regulations, Indian
                accounting standards, and the unique workflows of Category I, II,
                and III AIFs.
              </p>

              <ul className="list-unstyled mt-5 d-flex flex-column gap-3">
                {PRINCIPLES.map((p, i) => (
                  <li key={p} className="d-flex gap-3 align-items-start reveal" data-delay={i * 80}>
                    <span
                      style={{
                        width: 22, height: 22, borderRadius: 999,
                        background: 'var(--gradient-primary)',
                        flexShrink: 0, display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center',
                        marginTop: 2,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span style={{ fontSize: '0.98rem', color: 'var(--fg)', lineHeight: 1.5 }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual accent — cinematic orbs */}
            <div className="col-12 col-lg-5 reveal d-none d-lg-flex align-items-center justify-content-center" data-delay="200">
              <div style={{ position: 'relative', width: 320, height: 320 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', filter: 'blur(24px)' }} />
                <div style={{ position: 'absolute', top: '20%', left: '15%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,171,252,0.12) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,119,0.14) 0%, transparent 70%)', filter: 'blur(14px)' }} />
                <div style={{
                  position: 'absolute', inset: '20%',
                  borderRadius: '50%',
                  border: '1px solid rgba(167,139,250,0.25)',
                  boxShadow: '0 0 40px rgba(167,139,250,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.6))' }}>🇮🇳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          04 / Intelligence — AI Chat
      ═══════════════════════════════════════ */}
      <section className="section">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">04 / Intelligence</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
          </div>

          <div className="row g-5 align-items-center">
            {/* AI chat mock */}
            <div className="col-12 col-lg-6 reveal">
              <div className="glass-strong p-4 p-md-5">
                {/* AI header */}
                <div
                  className="d-flex align-items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: '1px solid var(--glass-border)' }}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--gradient-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zm0 4v8m-4-4h8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-strong)' }}>TrackFund AI</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-strong)' }}>● Connected · Gemini 1.5 Pro</div>
                  </div>
                </div>

                {/* User message */}
                <div className="d-flex justify-content-end mb-3">
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '18px 18px 4px 18px',
                      background: 'var(--gradient-primary)',
                      color: '#fff',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                    }}
                  >
                    What&apos;s the TVPI for our healthcare portfolio companies?
                  </div>
                </div>

                {/* AI response */}
                <div className="d-flex justify-content-start mb-4">
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '0.95rem 1.2rem',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--fg)',
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                    }}
                  >
                    Your healthcare portfolio (4 companies) has a weighted TVPI of{' '}
                    <span className="gradient-text" style={{ fontWeight: 600 }}>2.14x</span>{' '}
                    as of Q4 2025. Top performer: MedTech Solutions at 3.2x. The sector
                    outperforms your overall portfolio TVPI of 1.82x by{' '}
                    <span className="gradient-text" style={{ fontWeight: 600 }}>17.6%</span>.
                  </div>
                </div>

                {/* Input field */}
                <div
                  className="d-flex align-items-center gap-3"
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: 14,
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <span style={{ flex: 1, color: 'var(--muted)', fontSize: '0.88rem' }}>
                    Ask about your fund performance…
                  </span>
                  <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'var(--gradient-primary)', color: '#fff',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Right copy */}
            <div className="col-12 col-lg-6 reveal" data-delay="150">
              <span className="eyebrow d-inline-flex mb-3">AI-powered intelligence</span>
              <h2 className="display-section mt-3">
                Ask your fund<br />
                <span className="gradient-text">anything.</span>
              </h2>
              <p className="mt-4 text-muted-strong" style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
                Powered by Gemini AI, TrackFundAI understands your fund data and
                answers complex queries in plain language — from IRR calculations
                to sector allocation analysis, in seconds.
              </p>

              <div className="d-flex flex-column gap-3 mt-5">
                {[
                  { q: 'Which LPs have uncalled commitments above ₹5 Cr?', tag: 'LP Query' },
                  { q: 'Generate SEBI QAR for Q4 FY2025', tag: 'Compliance' },
                  { q: 'Show waterfall distribution for exit at 2.5x', tag: 'Accounting' },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="d-flex align-items-center gap-3"
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderRadius: 12,
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <span className="tag-pill" style={{ fontSize: '0.68rem', flexShrink: 0 }}>{item.tag}</span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--muted-strong)' }}>{item.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — full-width closing
      ═══════════════════════════════════════ */}
      <section className="section">
        <div className="container-x" style={{ maxWidth: '820px', textAlign: 'center' }}>
          <h2 className="display-section reveal">
            Ready to transform<br />
            <span className="gradient-text">your fund operations?</span>
          </h2>
          <p
            className="reveal mt-4 mx-auto text-muted-strong"
            data-delay="100"
            style={{ maxWidth: '520px', fontSize: '1.05rem', lineHeight: 1.6 }}
          >
            Join India&apos;s most forward-thinking AIFs. Schedule a demo and
            see TrackFundAI in action.
          </p>
          <div
            className="reveal mt-5 d-flex flex-column flex-sm-row gap-3 justify-content-center"
            data-delay="200"
          >
            <Link href="/contact" className="btn-primary-fancy">
              Schedule Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/about" className="btn-ghost">Our Story</Link>
          </div>
        </div>
      </section>
    </>
  );
}
