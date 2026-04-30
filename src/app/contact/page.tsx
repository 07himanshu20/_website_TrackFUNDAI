'use client';

import { useState } from 'react';
import useReveal from '@/components/useReveal';

const FAQ = [
  {
    q: 'How long does onboarding take?',
    a: 'Typical onboarding is 2-4 weeks including data migration, customization, and team training.',
  },
  {
    q: 'Can we start with just one module?',
    a: 'Absolutely. Most funds start with Fund Admin + Portfolio Monitoring and expand from there.',
  },
  {
    q: 'Is our data secure?',
    a: 'Yes. Org-scoped multi-tenancy, RBAC, encrypted at rest and in transit, with complete audit trails.',
  },
  {
    q: 'Do you support Category III AIFs?',
    a: 'Yes — Cat I, II, and III are all supported with category-specific workflows and SEBI metadata.',
  },
];

const CONTACT = [
  { label: 'Email', value: 'hello@trackfundai.com' },
  { label: 'Office', value: 'Mumbai, Maharashtra, India' },
  { label: 'Company', value: 'Trivesta Consulting Pvt. Ltd.' },
];

export default function ContactPage() {
  useReveal();

  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    fundType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="d-flex align-items-center" style={{ minHeight: '60vh', position: 'relative' }}>
        <div className="container-x" style={{ paddingTop: '6rem' }}>
          <div className="reveal mb-4">
            <span className="eyebrow">Get in Touch</span>
          </div>
          <h1 className="display-hero reveal" data-delay="100" style={{ maxWidth: '900px' }}>
            Let&apos;s start a<br />
            <span className="gradient-text">conversation.</span>
          </h1>
          <p
            className="reveal mt-4 text-muted-strong"
            data-delay="250"
            style={{ maxWidth: '620px', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.6 }}
          >
            Whether you&apos;re exploring fund management automation or ready to deploy —
            we&apos;d love to understand your needs and show you what TrackFundAI can do.
          </p>
        </div>
      </section>

      {/* ───────── FORM + INFO ───────── */}
      <section className="section">
        <div className="container-x">
          <div className="row g-5">
            {/* Form */}
            <div className="col-12 col-lg-7 reveal">
              {submitted ? (
                <div className="glass-strong p-4 p-md-5 text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      background: 'var(--gradient-primary)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-0.02em' }}>Thank you.</h3>
                  <p className="mt-3 text-muted-strong" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
                    We&apos;ve received your message and will get back to you within 24 hours.
                    In the meantime, explore our <a href="/solutions" className="gradient-text" style={{ fontWeight: 600 }}>platform modules</a>.
                  </p>
                </div>
              ) : (
                <div className="glass-strong p-4 p-md-5">
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em' }}>Request a Demo</h2>
                  <p className="mt-2 text-muted-strong" style={{ fontSize: '0.95rem' }}>
                    Fill in the form and our team will reach out to schedule a personalized walkthrough.
                  </p>

                  <form onSubmit={onSubmit} className="mt-4">
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="tf-label" htmlFor="name">Full Name *</label>
                        <input
                          id="name"
                          type="text"
                          required
                          className="tf-input"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="tf-label" htmlFor="email">Email *</label>
                        <input
                          id="email"
                          type="email"
                          required
                          className="tf-input"
                          placeholder="john@fund.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="tf-label" htmlFor="org">Organization</label>
                        <input
                          id="org"
                          type="text"
                          className="tf-input"
                          placeholder="Acme Capital"
                          value={form.organization}
                          onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="tf-label" htmlFor="ftype">Fund Type</label>
                        <select
                          id="ftype"
                          className="tf-select"
                          value={form.fundType}
                          onChange={(e) => setForm({ ...form, fundType: e.target.value })}
                        >
                          <option value="">Select type…</option>
                          <option value="cat1">AIF Category I</option>
                          <option value="cat2">AIF Category II</option>
                          <option value="cat3">AIF Category III</option>
                          <option value="gift">GIFT City IFSC</option>
                          <option value="other">Other / Exploring</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="tf-label" htmlFor="msg">Message</label>
                        <textarea
                          id="msg"
                          rows={4}
                          className="tf-textarea"
                          placeholder="Tell us about your fund and what you're looking for…"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          style={{ resize: 'none' }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary-fancy w-100 justify-content-center mt-4">
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="col-12 col-lg-5 reveal" data-delay="200">
              <h3 style={{ fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-0.02em' }}>Get in touch</h3>
              <p className="mt-3 text-muted-strong" style={{ fontSize: '0.98rem', lineHeight: 1.6 }}>
                We typically respond within a few hours. For urgent matters, reach
                us directly via email.
              </p>

              <div className="d-flex flex-column gap-3 mt-4">
                {CONTACT.map((c) => (
                  <div
                    key={c.label}
                    className="d-flex align-items-center gap-3"
                    style={{
                      padding: '1.1rem 1.3rem',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div className="stat-label" style={{ marginTop: 0 }}>{c.label}</div>
                      <p className="mt-1" style={{ fontSize: '0.96rem', fontWeight: 500, color: 'var(--fg-strong)' }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-strong p-4 p-md-4 mt-4">
                <h4 className="eyebrow d-inline-flex">Common Questions</h4>
                <div className="d-flex flex-column gap-4 mt-4">
                  {FAQ.map((f) => (
                    <div key={f.q}>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--fg-strong)' }}>{f.q}</p>
                      <p className="mt-2 text-muted-strong" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
