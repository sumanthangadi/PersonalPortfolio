import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════
   THE SUMANTH TIMES — Newspaper Portfolio
   A classic newspaper-inspired portfolio layout
   ═══════════════════════════════════════════════════════════════ */

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const NewspaperPortfolio = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', business: '', message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');

  // Intersection Observer — subtle fade-in for content sections
  useEffect(() => {
    const sections = document.querySelectorAll('.section-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-animate--visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ── Date for the masthead ──────────────────────────────────
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();

  // ── Copy to clipboard ─────────────────────────────────────
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(''), 2500);
  };

  // ── Contact form submission (Web3Forms) ───────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');
    try {
      const fd = new FormData();
      fd.append('access_key', '00fedef4-a2df-4394-a4e4-0beed34eba63');
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('mobile', formData.mobile);
      fd.append('business', formData.business);
      fd.append('message', `${formData.message}\n\n— sent from personal portfolio`);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', mobile: '', business: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Smooth scroll ─────────────────────────────────────────
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="newspaper-page">

      {/* ══════════════════════════════════════════════════════
          01 · MASTHEAD & NAVIGATION
          ══════════════════════════════════════════════════════ */}
      <header className="masthead">
        <div className="masthead__top-rule" />

        <div className="masthead__journal-line">
          <span>THE INDEPENDENT DEVELOPER JOURNAL</span>
          <span>EST. 2026</span>
        </div>

        <hr className="rule" />

        <h1 className="masthead__title">INDIA TODAY</h1>
        <p className="masthead__tagline">SOFTWARE · IDEAS · EXPERIMENTS · TECHNOLOGY</p>

        <hr className="rule" />

        <div className="masthead__meta-line">
          <span>BENGALURU, INDIA</span>
          <span>{currentDate}</span>
          <span>DIGITAL EDITION · NO. 001</span>
        </div>

        <hr className="rule" />

        <nav className="masthead__nav" id="nav">
          <button onClick={() => scrollTo('lead')}>About</button>
          <span className="nav-divider">|</span>
          <button onClick={() => scrollTo('projects')}>Work</button>
          <span className="nav-divider">|</span>
          <button onClick={() => scrollTo('skills')}>Skills</button>
          <span className="nav-divider">|</span>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </nav>

        <div className="masthead__bottom-rule" />
      </header>


      {/* ══════════════════════════════════════════════════════
          02 · THE LEAD STORY
          ══════════════════════════════════════════════════════ */}
      <section id="lead" className="lead-section section-animate">
        <div className="section-header">
          <span className="section-label">THE LEAD STORY</span>
          <span className="section-label section-label--muted">ABOUT THE DEVELOPER</span>
        </div>
        <hr className="rule rule--heavy" />

        <div className="lead-content">
          <div className="lead-text">
            <h2 className="lead-headline">
              Curiosity, engineered<br />into software.
            </h2>
            <p className="lead-intro">
              A 23-year-old developer based in Bengaluru, exploring the intersection of the web and useful ideas. Currently pursuing a Master of Computer Applications at PES University, with a specialization in Scalable Data Processing — the ability of an architecture to handle growing volumes, velocities, and varieties of data without sacrificing performance.
            </p>
            <p className="lead-philosophy">
              "Learning is a never ending path for me"
            </p>
            <button className="editorial-cta" onClick={() => scrollTo('projects')}>
              EXPLORE MY WORK ↓
            </button>
          </div>

          <div className="lead-portrait">
            <div className="portrait-frame">
              <img src="/cutouts/mobile.png" alt="Sumanth — Developer & Creator" />
            </div>
            <p className="portrait-caption">Sumanth · Developer & Creator</p>
          </div>
        </div>
      </section>


      <div className="section-ornament">· · ·</div>


      {/* ══════════════════════════════════════════════════════
          03 · FEATURED PROJECTS
          ══════════════════════════════════════════════════════ */}
      <section id="projects" className="projects-section section-animate">
        <hr className="rule rule--double" />
        <h2 className="section-title">FEATURED PROJECTS</h2>
        <hr className="rule" />

        {/* ── Lead Project: Folio ──────────────────────────── */}
        <article className="project-lead">
          <div className="project-meta">
            <span className="section-label">FEATURE 001 · CHROME EXTENSION</span>
            <span className="project-badge">MY PRODUCT</span>
          </div>

          <h2 className="project-headline">Folio — Rethinking Bookmarks</h2>

          <div className="project-body">
            <div>
              <p>
                A Chrome extension that replaces your new tab with a beautiful
                bookmark dashboard. Features organized sections, 7 themes,
                wallpapers, Google auth, and a full payment system — 30-day free
                trial, one-time ₹119 lifetime access.
              </p>
              <p className="project-note" style={{ marginTop: '0.75rem' }}>
                Live with real users.
              </p>
            </div>
            <div>
              <div className="project-stack">
                <span className="stack-label">TECHNOLOGY STACK</span>
                <div className="stack-tags">
                  {['React', 'Appwrite', 'Chrome APIs', 'Razorpay'].map((t) => (
                    <span key={t} className="stack-tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-links">
                <a href="https://www.getfolio.tech" target="_blank" rel="noreferrer">
                  → Visit Folio
                </a>
              </div>
            </div>
          </div>
        </article>

        <hr className="rule" />

        {/* ── Secondary Projects ───────────────────────────── */}
        <div className="projects-columns">

          {/* Habit Tracker Ecosystem */}
          <article className="project-story">
            <span className="section-label">FEATURE 002 · CROSS-PLATFORM ECOSYSTEM</span>
            <h3 className="project-headline--sm">Habit Tracker Ecosystem</h3>
            <div className="project-platforms">
              <span>📱 Mobile</span>
              <span>🌐 Web</span>
              <span>🧩 Extension</span>
              <span style={{
                fontStyle: 'italic',
                color: 'var(--muted)',
                fontSize: '0.68rem'
              }}>— connected to each other</span>
            </div>
            <p>
              A cross-platform ecosystem built to manage habits and track user
              progress, using React Native, React JS, and Firebase for the
              backend.
            </p>
            <div className="project-stack">
              <div className="stack-tags">
                {['React Native', 'ReactJS', 'Firebase'].map((t) => (
                  <span key={t} className="stack-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              <a href="https://habit-tracker-public-one.vercel.app/today" target="_blank" rel="noreferrer">
                → Live Preview
              </a>
              <a href="https://github.com/sumanthangadi/habittrackerbackend" target="_blank" rel="noreferrer">
                → GitHub
              </a>
              <a href="https://github.com/sumanthangadi/BookmarksManager" target="_blank" rel="noreferrer">
                → Bookmark Ext.
              </a>
            </div>
          </article>

          <div className="vertical-rule" />

          {/* Order Management System */}
          <article className="project-story">
            <span className="section-label">FEATURE 003 · FULL-STACK DEVELOPMENT</span>
            <h3 className="project-headline--sm">Order Management System</h3>
            <p>
              A comprehensive dashboard and backend infrastructure designed to
              efficiently manage orders and customer data.
            </p>
            <p className="project-note">
              *Note: Initial load may be slow due to the free tier server.
            </p>
            <div className="project-stack">
              <div className="stack-tags">
                {['React JS', 'Node JS', 'MongoDB'].map((t) => (
                  <span key={t} className="stack-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              <a href="https://order-management-frontend-tau.vercel.app/dashboard" target="_blank" rel="noreferrer">
                → Live Preview
              </a>
              <a href="https://github.com/sumanthangadi/order-management-backend" target="_blank" rel="noreferrer">
                → GitHub
              </a>
            </div>
          </article>

        </div>
      </section>


      <div className="section-ornament">· · ·</div>


      {/* ══════════════════════════════════════════════════════
          04 · THE TECHNOLOGY DESK
          ══════════════════════════════════════════════════════ */}
      <section id="skills" className="tech-section section-animate">
        <hr className="rule rule--double" />
        <h2 className="section-title">THE TECHNOLOGY DESK</h2>
        <hr className="rule" />

        <div className="tech-grid">
          <div className="tech-category">
            <h4 className="tech-category-title">Frontend</h4>
            <ul className="tech-list">
              <li className="tech-item">React.js</li>
              <li className="tech-item">React Native</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4 className="tech-category-title">Backend</h4>
            <ul className="tech-list">
              <li className="tech-item">Node.js</li>
              <li className="tech-item">Firebase</li>
              <li className="tech-item">Appwrite</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4 className="tech-category-title">Languages</h4>
            <ul className="tech-list">
              <li className="tech-item">JavaScript</li>
              <li className="tech-item">C</li>
            </ul>
          </div>
          <div className="tech-category">
            <h4 className="tech-category-title">Tools & Services</h4>
            <ul className="tech-list">
              <li className="tech-item">Git</li>
              <li className="tech-item">OAuth</li>
              <li className="tech-item">Chrome Extensions</li>
              <li className="tech-item">Deployment</li>
              <li className="tech-item">Razorpay & Stripe</li>
            </ul>
          </div>
        </div>
      </section>


      <div className="section-ornament">· · ·</div>


      {/* ══════════════════════════════════════════════════════
          05 · ABOUT THE AUTHOR
          ══════════════════════════════════════════════════════ */}
      <section id="about" className="about-section section-animate">
        <hr className="rule rule--double" />
        <h2 className="section-title">ABOUT THE AUTHOR</h2>
        <hr className="rule" />

        <div className="about-grid">
          <div className="about-education">
            <span className="section-label" style={{ display: 'block', marginBottom: '1.2rem' }}>EDUCATION</span>

            <div className="edu-entry">
              <p className="edu-years">MCA · 2025 – 2027</p>
              <h3 className="edu-degree">Master of Computer Applications</h3>
              <p className="edu-school">
                <a href="https://maps.app.goo.gl/jn3pAzoAXdEUeVUK8" target="_blank" rel="noreferrer">
                  PES University, Bengaluru
                </a>
              </p>
            </div>

            <div className="edu-divider" />

            <div className="edu-entry">
              <p className="edu-years">BCA · 2022 – 2025</p>
              <h3 className="edu-degree">Bachelor of Computer Applications</h3>
              <p className="edu-school">
                <a href="https://maps.app.goo.gl/hotpV5P9Lu6qh56h9" target="_blank" rel="noreferrer">
                  KLE BCA, Hubli
                </a>
              </p>
            </div>
          </div>

          <div className="vertical-rule" />

          <div className="about-specialization">
            <span className="section-label" style={{ display: 'block', marginBottom: '0.8rem' }}>MCA SPECIALIZED COURSE</span>
            <span className="spec-badge">SPECIALIZATION</span>
            <h3 className="spec-title">Scalable Data Processing</h3>
            <p className="spec-description">
              The ability of an architecture to handle growing volumes,
              velocities, and varieties of data without sacrificing performance.
            </p>
          </div>
        </div>
      </section>


      <div className="section-ornament">· · ·</div>


      {/* ══════════════════════════════════════════════════════
          06 · CORRESPONDENCE
          ══════════════════════════════════════════════════════ */}
      <section id="contact" className="contact-section section-animate">
        <hr className="rule rule--double" />
        <h2 className="section-title">CORRESPONDENCE</h2>
        <hr className="rule" />

        <div className="contact-grid">
          {/* ── Form ──────────────────────────────────────── */}
          <div className="contact-form-area">
            <span className="section-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
              SEND A MESSAGE
            </span>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-name">Full Name</label>
                  <input
                    id="cf-name"
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    className="form-input"
                    placeholder="Your email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-mobile">Mobile</label>
                  <input
                    id="cf-mobile"
                    type="tel"
                    className="form-input"
                    placeholder="Your number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-business">Business / Company</label>
                  <input
                    id="cf-business"
                    type="text"
                    className="form-input"
                    placeholder="Your company"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message"
                    className="form-textarea"
                    placeholder="Your message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="form-submit" disabled={isSubmitting}>
                {isSubmitting ? 'SENDING...' : 'SUBMIT'}
              </button>
              {formStatus === 'success' && (
                <p className="form-status form-status--success">✓ Message sent successfully.</p>
              )}
              {formStatus === 'error' && (
                <p className="form-status form-status--error">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>

          <div className="vertical-rule" />

          {/* ── Contact Info ──────────────────────────────── */}
          <div className="contact-info-area">
            <span className="section-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
              REACH THE AUTHOR
            </span>

            <div className="contact-detail">
              <p className="contact-detail-label">Phone / WhatsApp</p>
              <p
                className="contact-detail-value"
                onClick={() => handleCopy('+91 9343337788')}
                title="Click to copy"
              >
                +91 9343337788
                <span className="copy-icon"><CopyIcon /></span>
              </p>
            </div>

            <div className="contact-detail">
              <p className="contact-detail-label">Email</p>
              <p
                className="contact-detail-value"
                onClick={() => handleCopy('sumanthangadi7@gmail.com')}
                title="Click to copy"
              >
                sumanthangadi7@gmail.com
                <span className="copy-icon"><CopyIcon /></span>
              </p>
            </div>

            <div className="contact-actions">
              <span className="section-label" style={{ marginBottom: '0.2rem' }}>CONNECT</span>
              <a
                href="https://wa.me/919343337788?text=Hay%20Sumanth%2C%20Lets%20work%20together"
                target="_blank"
                rel="noreferrer"
                className="contact-action-link"
              >
                → WhatsApp
              </a>
              <a
                href="mailto:sumanthangadi7@gmail.com"
                className="contact-action-link"
              >
                → Email
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          07 · COLOPHON
          ══════════════════════════════════════════════════════ */}
      <footer className="colophon">
        <hr className="rule rule--double" />
        <div className="colophon__inner">
          <p className="colophon__title">INDIA TODAY</p>
          <div className="colophon__links">
            <a href="https://github.com/sumanthangadi" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:sumanthangadi7@gmail.com">Email</a>
            <a
              href="https://wa.me/919343337788?text=Hay%20Sumanth%2C%20Lets%20work%20together"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
          <p className="colophon__text">
            © 2026 · Sumanth Angadi · All Rights Reserved<br />
            Built with React + Vite · Deployed on Vercel<br />
            Typefaces: Playfair Display, Inter
          </p>
        </div>
        <hr className="rule" />
      </footer>


      {/* ══════════════════════════════════════════════════════
          COPY TOAST NOTIFICATION
          ══════════════════════════════════════════════════════ */}
      {copiedValue && (
        <div className="copy-toast" key={copiedValue + Date.now()}>
          {copiedValue.includes('@') ? 'Email address copied!' : 'Phone number copied!'}
        </div>
      )}

    </div>
  );
};

export default NewspaperPortfolio;
