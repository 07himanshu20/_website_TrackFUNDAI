'use client';

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

      {/* ───────── CINEMATIC SPACER — nebula dissolve zone ───────── */}
      <section className="contact-nebula-spacer">
        <div className="contact-nebula-inner">
          <div className="reveal contact-nebula-label">
            <span className="eyebrow" style={{ letterSpacing: '0.18em' }}>Connecting you to the cosmos</span>
          </div>
        </div>
      </section>

      {/* ───────── FORM + INFO ───────── */}
      <section className="section contact-form-section">
        <div className="container-x">
          <div className="row g-5">
            {/* Form */}
            <div className="col-12 col-lg-7 reveal">
              <div className="glass-strong p-4 p-md-5">
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Request a Demo</h2>
                <p className="mt-2 text-muted-strong" style={{ fontSize: '0.95rem' }}>
                  Fill in the form and our team will reach out to schedule a personalized walkthrough.
                </p>

                {/* Native POST to FormSubmit.co — no JS interception needed */}
                <form
                  action="https://formsubmit.co/raj@trackfundai.com"
                  method="POST"
                  className="mt-4"
                >
                  {/* FormSubmit configuration hidden fields */}
                  <input type="hidden" name="_subject" value="New Demo Request — TrackFundAI" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_next" value="https://trackfundai.com/contact?submitted=true" />

                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="tf-label" htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="tf-input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="tf-label" htmlFor="email">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="tf-input"
                        placeholder="john@fund.com"
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="tf-label" htmlFor="org">Organization</label>
                      <input
                        id="org"
                        name="organization"
                        type="text"
                        className="tf-input"
                        placeholder="Acme Capital"
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="tf-label" htmlFor="ftype">Fund Type</label>
                      <select
                        id="ftype"
                        name="fund_type"
                        className="tf-select"
                      >
                        <option value="">Select type…</option>
                        <option value="AIF Category I">AIF Category I</option>
                        <option value="AIF Category II">AIF Category II</option>
                        <option value="AIF Category III">AIF Category III</option>
                        <option value="GIFT City IFSC">GIFT City IFSC</option>
                        <option value="Other / Exploring">Other / Exploring</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="tf-label" htmlFor="msg">Message</label>
                      <textarea
                        id="msg"
                        name="message"
                        rows={4}
                        className="tf-textarea"
                        placeholder="Tell us about your fund and what you're looking for…"
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
