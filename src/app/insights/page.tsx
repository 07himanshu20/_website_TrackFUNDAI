'use client';

import { useState } from 'react';
import Link from 'next/link';
import useReveal from '@/components/useReveal';

const ARTICLES = [
  {
    category: 'Industry',
    date: 'Apr 2026',
    title: 'The AIF Automation Gap: Why Indian Funds Are Still Running on Spreadsheets',
    excerpt: "India's AIF industry has grown 10x in 5 years, but operational tooling hasn't kept pace. We analyze the gap and the path forward.",
    readTime: '8 min read',
    featured: true,
  },
  {
    category: 'Compliance',
    date: 'Mar 2026',
    title: 'SEBI QAR Automation: From 3 Weeks to 3 Minutes',
    excerpt: 'How automated data pipelines can eliminate the quarterly scramble for SEBI Quarterly Activity Reports.',
    readTime: '6 min read',
    featured: false,
  },
  {
    category: 'Technology',
    date: 'Mar 2026',
    title: 'AI in Fund Management: Beyond the Buzzword',
    excerpt: 'Natural language queries, predictive analytics, and anomaly detection — practical AI applications for fund operations today.',
    readTime: '10 min read',
    featured: false,
  },
  {
    category: 'LP Relations',
    date: 'Feb 2026',
    title: 'The LP Portal Revolution: Self-Service for Limited Partners',
    excerpt: 'Why the best-run funds give LPs real-time access to capital accounts, documents, and performance metrics.',
    readTime: '5 min read',
    featured: false,
  },
  {
    category: 'Accounting',
    date: 'Feb 2026',
    title: 'NAV Computation for AIFs: A Technical Deep Dive',
    excerpt: 'Understanding the nuances of daily vs periodic NAV, management fee accruals, and carry waterfall mechanics in Indian AIF structures.',
    readTime: '12 min read',
    featured: false,
  },
  {
    category: 'Regulation',
    date: 'Jan 2026',
    title: 'GIFT City AIFs: The Offshore-Onshore Playbook',
    excerpt: 'Navigating IFSCA regulations, multi-currency NAV, and cross-border investor reporting for GIFT City-domiciled funds.',
    readTime: '9 min read',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Industry', 'Compliance', 'Technology', 'LP Relations', 'Accounting', 'Regulation'];

export default function InsightsPage() {
  useReveal();
  const [active, setActive] = useState('All');

  const featured = ARTICLES.find((a) => a.featured)!;
  const rest = ARTICLES.filter((a) => !a.featured).filter((a) => active === 'All' || a.category === active);

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="d-flex align-items-center" style={{ minHeight: '60vh', position: 'relative' }}>
        <div className="container-x" style={{ paddingTop: '6rem' }}>
          <div className="reveal mb-4">
            <span className="eyebrow">Insights</span>
          </div>
          <h1 className="display-hero reveal" data-delay="100" style={{ maxWidth: '900px' }}>
            Thinking<br />
            <span className="gradient-text">out loud.</span>
          </h1>
          <p
            className="reveal mt-4 text-muted-strong"
            data-delay="250"
            style={{ maxWidth: '600px', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.6 }}
          >
            Perspectives on AIF operations, SEBI compliance, fund technology, and
            the future of institutional investing in India.
          </p>
        </div>
      </section>

      {/* ───────── CATEGORY FILTER ───────── */}
      <section className="section-tight" style={{ paddingTop: '2rem' }}>
        <div className="container-x">
          <div className="reveal d-flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 999,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  background: active === c ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                  border: `1px solid ${active === c ? 'transparent' : 'var(--glass-border)'}`,
                  color: active === c ? '#fff' : 'var(--muted-strong)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED ───────── */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container-x">
          <div className="reveal">
            <div
              className="glass-strong p-4 p-md-5 position-relative"
              style={{ overflow: 'hidden', cursor: 'pointer' }}
            >
              <div className="row align-items-center">
                <div className="col-12 col-lg-8">
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                    <span
                      style={{
                        padding: '0.3rem 0.85rem',
                        borderRadius: 999,
                        background: 'var(--gradient-primary)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Featured
                    </span>
                    <span className="tag-pill">{featured.category}</span>
                    <span className="text-muted-soft" style={{ fontSize: '0.82rem' }}>{featured.date}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-muted-strong" style={{ fontSize: '1.02rem', lineHeight: 1.6, maxWidth: '600px' }}>
                    {featured.excerpt}
                  </p>
                  <div className="d-flex align-items-center gap-3 mt-4">
                    <span className="gradient-text" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Read Article →</span>
                    <span className="text-muted-soft" style={{ fontSize: '0.82rem' }}>{featured.readTime}</span>
                  </div>
                </div>
                <div className="col-lg-4 d-none d-lg-block">
                  <div
                    style={{
                      aspectRatio: '1',
                      borderRadius: 18,
                      background: 'var(--gradient-primary)',
                      opacity: 0.15,
                      filter: 'blur(40px)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ARTICLE GRID ───────── */}
      <section className="section-tight">
        <div className="container-x">
          <div className="d-flex align-items-baseline gap-3 mb-5 reveal">
            <span className="section-number">All Articles</span>
            <span style={{ flex: 1, height: 1, background: 'var(--glass-border-strong)' }} />
            <span className="text-muted-soft" style={{ fontSize: '0.82rem' }}>{rest.length} {rest.length === 1 ? 'article' : 'articles'}</span>
          </div>

          <div className="row g-4">
            {rest.map((a, i) => (
              <div className="col-12 col-md-6 col-lg-4 reveal" data-delay={i * 80} key={a.title}>
                <article className="article-card">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="tag-pill" style={{ fontSize: '0.7rem' }}>{a.category}</span>
                    <span className="text-muted-soft" style={{ fontSize: '0.78rem' }}>{a.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                    {a.title}
                  </h3>
                  <p className="mt-3 text-muted-strong" style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
                    {a.excerpt}
                  </p>
                  <div className="d-flex align-items-center justify-content-between mt-4 pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--accent-strong)' }}>
                      Read more →
                    </span>
                    <span className="text-muted-soft" style={{ fontSize: '0.75rem' }}>{a.readTime}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── NEWSLETTER ───────── */}
      <section className="section">
        <div className="container-x">
          <div className="reveal mx-auto" style={{ maxWidth: '720px' }}>
            <div className="glass-strong p-4 p-md-5 text-center">
              <h2 className="display-section">
                Stay <span className="gradient-text">informed.</span>
              </h2>
              <p className="mt-3 text-muted-strong" style={{ fontSize: '1rem', lineHeight: 1.55 }}>
                Get the latest on AIF regulations, fund technology, and platform updates. No spam — just insights that matter.
              </p>
              <form
                className="d-flex flex-column flex-sm-row gap-3 mt-4 mx-auto"
                style={{ maxWidth: '480px' }}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="tf-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary-fancy" style={{ whiteSpace: 'nowrap' }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="section">
        <div className="container-x text-center" style={{ maxWidth: '700px' }}>
          <h2 className="display-section reveal">
            Want to see it <span className="gradient-text">live?</span>
          </h2>
          <div className="reveal mt-5" data-delay="100">
            <Link href="/contact" className="btn-primary-fancy">
              Schedule a Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
