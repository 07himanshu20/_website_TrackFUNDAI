'use client';

import Link from 'next/link';

const NAV_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Fund Administration',   href: '/solutions' },
      { label: 'LP Management',         href: '/solutions' },
      { label: 'Portfolio Intelligence', href: '/solutions' },
      { label: 'SEBI Compliance',       href: '/solutions' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',    href: '/about' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contact',  href: '/contact' },
      { label: 'Careers',  href: '/contact' },
    ],
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

const SOCIAL = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hello@trackfundai.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="tf-footer-cinematic">
      {/* ── Cinematic gradient backdrop ─────────────────────── */}
      <div className="tf-footer-bg" aria-hidden="true">
        {/* Top border glow */}
        <div className="tf-footer-top-glow" />
        {/* Ambient color orbs */}
        <div className="tf-footer-orb tf-footer-orb-purple" />
        <div className="tf-footer-orb tf-footer-orb-pink" />
        <div className="tf-footer-orb tf-footer-orb-warm" />
        {/* Grid texture overlay */}
        <div className="tf-footer-grid" />
      </div>

      <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Main grid ── */}
        <div className="tf-footer-main">

          {/* Brand column */}
          <div className="tf-footer-brand">
            <Link href="/" className="tf-logo mb-3" style={{ display: 'inline-flex' }}>
              <span className="tf-logo-mark">TF</span>
              <span>Track<span className="gradient-text">Fund</span>AI</span>
            </Link>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, maxWidth: '320px', marginTop: '1rem', color: 'var(--muted-strong)' }}>
              The AI-powered operating system for Alternative Investment Funds.
              Built in India, for India&apos;s AIF ecosystem.
            </p>

            {/* Trust badge */}
            <div className="tf-footer-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>SEBI Compliant Architecture</span>
            </div>

            {/* Social icons */}
            <div className="d-flex gap-2 mt-4">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="tf-footer-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title} className="tf-footer-col">
              <h4 className="tf-footer-col-title">{col.title}</h4>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="tf-footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA column */}
          <div className="tf-footer-col">
            <h4 className="tf-footer-col-title">Get Started</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-strong)', lineHeight: 1.55, marginBottom: '1rem' }}>
              Ready to modernize your fund operations?
            </p>
            <Link href="/contact" className="tf-footer-cta-btn">
              Request a Demo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="tf-footer-india-tag mt-3">
              <span>🇮🇳</span>
              <span>Made in India</span>
            </div>
          </div>
        </div>

        {/* ── Divider with glow ── */}
        <div className="tf-footer-divider" />

        {/* ── Bottom bar: copyright + legal links ── */}
        <div className="tf-footer-bottom">
          <p className="tf-footer-copy">
            &copy; {year} Trivesta Consulting Pvt. Ltd. All rights reserved.
          </p>

          {/* Legal links — properly placed here */}
          <div className="tf-footer-legal">
            {LEGAL_LINKS.map((l, i) => (
              <span key={l.label} className="d-flex align-items-center gap-2">
                {i > 0 && <span className="tf-footer-legal-dot" />}
                <a href={l.href} className="tf-footer-legal-link">{l.label}</a>
              </span>
            ))}
          </div>

          <p className="tf-footer-tagline">
            Built with precision for India&apos;s AIF ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
