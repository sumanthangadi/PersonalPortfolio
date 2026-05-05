import React, { useEffect, useRef, useState } from 'react';



const cutouts = [
  '/cutouts/1.png',
  '/cutouts/2.png',
  '/cutouts/3.png',
  '/cutouts/4.png',
  '/cutouts/5.png',
];

const slideContent = [
  {
    left: [
      { type: 'heading', value: 'ABOUT' },
      { label: 'Name', value: 'Sumanth' },
      { label: 'Age', value: '23' }
    ],
    right: [
      { label: 'Place', value: 'Bengaluru', containerStyle: { paddingRight: '5vw' } }
    ]
  },
  {
    left: [
      { type: 'heading', value: 'EDUCATION' },
      { label: 'MCA (2025 - 2027)', value: 'Master of Computer Application', nowrap: true },
      { label: '', value: 'PES University Bengaluru', style: { fontSize: '1rem', marginTop: '-0.5rem', opacity: 0.8, textTransform: 'uppercase' } },
      { type: 'divider', style: { width: '200px', opacity: 0.1, margin: '1.5rem 0' } },
      { label: 'BCA (2022 - 2025)', value: 'Bachelor of Computer Applications', nowrap: true },
      { label: '', value: 'KLE BCA Hubli', style: { fontSize: '1rem', marginTop: '-0.5rem', opacity: 0.8, textTransform: 'uppercase' } }
    ],
    right: []
  },
  {
    left: [
      { type: 'heading', value: 'SKILLS' },
      {
        label: 'Tech Stack', type: 'skills', skills: [
          { name: 'React', icon: 'react' },
          { name: 'React-Native', icon: 'reactNative' },
          { name: 'Node JS', icon: 'nodejs' },
          { name: 'Data Structures', icon: 'data' },
          { name: 'Firebase', icon: 'firebase' }
        ]
      }
    ],
    right: [
      {
        label: 'Philosophy',
        value: '"Learning is a never ending\npath for me"',
        style: { fontSize: '1.2rem', whiteSpace: 'pre-line', lineHeight: '1.4' },
        containerStyle: { position: 'absolute', top: '-25vh', right: 0, width: '250px' }
      }
    ]
  },
  {
    left: [
      { type: 'heading', value: 'PROJECTS' },
      { label: 'Project', value: 'Habit Tracker Ecosystem' },
      { label: 'Description', value: 'Mobile app, web app & bookmark extension that manages bookmarks and habits.', style: { fontFamily: '"Montserrat", sans-serif', fontSize: '1.2rem' } },
      { label: 'Stack', value: 'React-Native, ReactJS, Firebase', style: { fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', opacity: 0.8 } },
      { label: 'Links', type: 'links', github: 'https://github.com/sumanthangadi/habittrackerbackend', knowMore: '#projects-detail', extraBtn: { label: 'Bookmark', icon: 'bookmark', url: 'https://github.com/sumanthangadi/BookmarksManager' } },
      { type: 'divider', style: { width: '200px', opacity: 0.1, margin: '1.5rem 0' } },
      { label: 'Project', value: 'Order Management System' },
      { label: 'Description', value: 'Manages orders and customers.', style: { fontFamily: '"Montserrat", sans-serif', fontSize: '1.2rem' } },
      { label: 'Stack', value: 'React JS, Node JS and MongoDB', style: { fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', opacity: 0.8 } },
      { label: 'Links', type: 'links', github: 'https://github.com/sumanthangadi/order-management-backend', knowMore: '#projects-detail' }
    ],
    right: []
  },
  {
    left: [
      {
        type: 'heading',
        value: 'CONTACT',
        containerStyle: {
          position: 'absolute',
          left: '2rem',
          top: '55%',
          transform: 'rotate(-90deg) translateX(-50%)',
          transformOrigin: '0 0',
          width: 'max-content'
        },
        style: {
          fontSize: '5rem',
          letterSpacing: '0.1em',
          opacity: 0.05,
          fontWeight: 900,
          lineHeight: 1,
          margin: 0
        }
      }
    ],
    right: [
      { label: 'Phone / WhatsApp', value: '+91 9343337788' },
      { label: 'Email', value: 'sumanthangadi7@gmail.com', style: { marginTop: '3rem' }, labelStyle: { marginBottom: 0 }, nowrap: true },
      {
        type: 'contactActions',
        label: 'Connect',
        actions: [
          { text: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/919343337788?text=Hay%20Sumanth%2C%20Lets%20work%20together' },
          { text: 'Email', icon: 'email', url: 'mailto:sumanthangadi7@gmail.com' }
        ]
      }
    ]
  }
];

const getIcon = (name, size = 18) => {
  switch (name) {
    case 'github': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
    case 'preview': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;
    case 'bookmark': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>;
    case 'whatsapp': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
    case 'email': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
    case 'knowMore': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
    case 'react': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"></ellipse></svg>;
    case 'reactNative': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
    case 'nodejs': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
    case 'data': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="3" width="6" height="6" rx="1"></rect><rect x="2" y="9" width="6" height="6" rx="1"></rect><rect x="16" y="15" width="6" height="6" rx="1"></rect><path d="M8 12h4l4-6"></path><path d="M12 12l4 6"></path></svg>;
    case 'firebase': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>;
    default: return null;
  }
};

const renderPanelItem = (item, idx, isRight, isActive) => {
  const alignStyle = isRight ? { alignItems: 'flex-end', textAlign: 'right' } : { alignItems: 'flex-start', textAlign: 'left' };
  const linksStyle = { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem', pointerEvents: 'auto', justifyContent: isRight ? 'flex-end' : 'flex-start' };
  const animStyle = {
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.15}s`,
    willChange: 'opacity, transform'
  };

  if (item.type === 'heading') {
    return (
      <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle, ...(item.containerStyle || {}) }}>
        <h2 style={{ fontSize: '1.4rem', margin: '0 0 0 0', letterSpacing: '0.15em', fontWeight: 600, color: '#000', opacity: 0.5, ...(item.style || {}) }}>{item.value}</h2>
      </div>
    );
  }

  if (item.type === 'links') {
    return (
      <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle }}>
        <div className="editorial-label">{item.label}</div>
        <div style={linksStyle}>
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="editorial-button">{getIcon('github')} GitHub</a>}
          {item.github && (item.preview || item.knowMore || item.extraBtn) && <span style={{ color: '#000', opacity: 0.2 }}>|</span>}
          {item.preview && <a href={item.preview} target="_blank" rel="noreferrer" className="editorial-button">{getIcon('preview')} Preview</a>}
          {item.knowMore && <a href={item.knowMore} className="editorial-button">{getIcon('knowMore')} Know More</a>}
          {(item.preview || item.knowMore) && item.extraBtn && <span style={{ color: '#000', opacity: 0.2 }}>|</span>}
          {item.extraBtn && <a href={item.extraBtn.url} target="_blank" rel="noreferrer" className="editorial-button">{getIcon(item.extraBtn.icon)} {item.extraBtn.label}</a>}
        </div>
        {item.note && <div className="editorial-label" style={{ marginTop: '0.5rem', textTransform: 'none' }}>{item.note}</div>}
      </div>
    );
  }
  if (item.type === 'button') {
    return (
      <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle }}>
        <div className="editorial-label">{item.label}</div>
        <div style={linksStyle}>
          <a href={item.url} target="_blank" rel="noreferrer" className="editorial-button">{getIcon(item.icon)} {item.text}</a>
        </div>
      </div>
    );
  }

  if (item.type === 'contactActions') {
    return (
      <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle, marginTop: '2rem' }}>
        <div className="editorial-label">{item.label}</div>
        <div style={{ ...linksStyle, gap: '2rem' }}>
          {item.actions.map((action, aIdx) => (
            <React.Fragment key={aIdx}>
              {aIdx > 0 && <span style={{ color: '#000', opacity: 0.1 }}>|</span>}
              <a href={action.url} target="_blank" rel="noreferrer" className="editorial-button">{getIcon(action.icon)} {action.text}</a>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (item.type === 'skills') {
    return (
      <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle }}>
        <div className="editorial-label">{item.label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.5rem', justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
          {item.skills.map((skill, sIdx) => (
            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
              <span style={{ opacity: 0.7, display: 'flex' }}>{getIcon(skill.icon)}</span>
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (item.type === 'divider') {
    const baseOpacity = item.style?.opacity ?? 0.05;
    return (
      <div key={idx} style={{
        width: '100%',
        height: '1px',
        background: '#000',
        margin: '0.5rem 0',
        ...animStyle,
        ...(item.style || {}),
        opacity: isActive ? baseOpacity : 0
      }} />
    );
  }

  return (
    <div key={idx} style={{ display: 'flex', flexDirection: 'column', ...alignStyle, ...animStyle, ...(item.containerStyle || {}) }}>
      <div className="editorial-label" style={item.labelStyle || {}}>{item.label}</div>
      <div className="editorial-value" style={{
        whiteSpace: item.nowrap ? 'nowrap' : 'normal',
        maxWidth: (isRight || item.nowrap) ? 'none' : '400px',
        ...(item.style || {})
      }}>{item.value}</div>
    </div>
  );
};


// ── Mobile Layout Component ──
function MobileLayout() {
  const revealRefs = useRef([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Fade in shortly after mount
    const fadeIn = setTimeout(() => setShowToast(true), 100);
    // Fade out after 3.5 seconds
    const fadeOut = setTimeout(() => setShowToast(false), 3500);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const sectionLabels = ['01 — About', '02 — Education', '03 — Skills', '04 — Projects', '05 — Contact'];

  return (
    <div style={{ backgroundColor: '#fff', color: '#000' }}>

      {/* Desktop suggestion toast */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#111',
        color: '#fff',
        padding: '0.8rem 1.5rem',
        borderRadius: '50px',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        zIndex: 1000,
        opacity: showToast ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        whiteSpace: 'normal',
        width: '90vw',
        maxWidth: '320px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        boxSizing: 'border-box'
      }}>
        Please view on desktop for the best experience
      </div>

      {/* ── ABOUT ── */}
      <section className="mobile-section" style={{ minHeight: 'auto' }}>
        <div className="mobile-section-label">{sectionLabels[0]}</div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1rem', WebkitMaskImage: 'linear-gradient(to bottom, #000 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom, #000 70%, transparent 100%)' }}>
          <img src="/cutouts/mobile.png" alt="Sumanth" style={{ maxWidth: '90vw', maxHeight: '60vh', width: 'auto', height: 'auto', display: 'block', objectFit: 'contain' }} />
        </div>
        <div className="mobile-content mobile-reveal" ref={addRevealRef}>
          <div>
            <div className="editorial-label">Name</div>
            <div className="editorial-value">Sumanth</div>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div>
              <div className="editorial-label">Age</div>
              <div className="editorial-value">23</div>
            </div>
            <div>
              <div className="editorial-label">Place</div>
              <div className="editorial-value">Bengaluru</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="mobile-section" style={{ backgroundColor: '#fafafa', minHeight: 'auto' }}>
        <div className="mobile-section-label">{sectionLabels[1]}</div>
        <div className="mobile-content mobile-reveal" ref={addRevealRef}>
          <div>
            <div className="editorial-label">MCA (2025 - 2027)</div>
            <div className="editorial-value">Master of Computer Application</div>
            <div className="editorial-label" style={{ marginTop: '0.2rem', textTransform: 'uppercase', opacity: 0.8 }}>PES University Bengaluru</div>
          </div>
          <div className="mobile-divider"></div>
          <div>
            <div className="editorial-label">BCA (2022 - 2025)</div>
            <div className="editorial-value">Bachelor of Computer Applications</div>
            <div className="editorial-label" style={{ marginTop: '0.2rem', textTransform: 'uppercase', opacity: 0.8 }}>KLE BCA Hubli</div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="mobile-section" style={{ minHeight: 'auto' }}>
        <div className="mobile-section-label">{sectionLabels[2]}</div>
        <div className="mobile-content mobile-reveal" ref={addRevealRef}>
          <div className="editorial-label">Tech Stack</div>
          <div className="mobile-skills-grid">
            {slideContent[2].left[1].skills.map((skill, i) => (
              <div key={i} className="skill-chip">
                <span style={{ display: 'flex' }}>{getIcon(skill.icon, 16)}</span>
                {skill.name}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="editorial-label">Philosophy</div>
            <div style={{ fontSize: '1.1rem', lineHeight: 1.5, fontStyle: 'italic', opacity: 0.7, marginTop: '0.3rem' }}>
              "Learning is a never ending path for me"
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="mobile-section" style={{ backgroundColor: '#fafafa', minHeight: 'auto' }}>
        <div className="mobile-section-label">{sectionLabels[3]}</div>
        <div className="mobile-content mobile-reveal" ref={addRevealRef}>
          {/* Habit Tracker */}
          <div>
            <div className="editorial-label">Project</div>
            <div className="editorial-value">Habit Tracker Ecosystem</div>
          </div>
          <div>
            <div className="editorial-label">Description</div>
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', lineHeight: 1.5 }}>
              Mobile app, web app & bookmark extension that manages bookmarks and habits.
            </div>
            <div className="editorial-label" style={{ marginTop: '0.5rem' }}>Stack</div>
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.9rem', opacity: 0.8 }}>
              React-Native, ReactJS, Firebase
            </div>
          </div>
          <div>
            <div className="editorial-label">Links</div>
            <div className="mobile-links-row">
              <a href="https://github.com/sumanthangadi/habittrackerbackend" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('github', 16)} GitHub</a>
              <span style={{ opacity: 0.15 }}>|</span>
              <a href="https://habit-tracker-public-one.vercel.app/today" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('preview', 16)} Live Preview</a>
              <span style={{ opacity: 0.15 }}>|</span>
              <a href="https://github.com/sumanthangadi/BookmarksManager" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('bookmark', 16)} Bookmark</a>
            </div>
          </div>

          <div className="mobile-divider"></div>

          {/* Order Management */}
          <div>
            <div className="editorial-label">Project</div>
            <div className="editorial-value">Order Management System</div>
          </div>
          <div>
            <div className="editorial-label">Description</div>
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1rem', lineHeight: 1.5 }}>
              Manages orders and customers.
            </div>
            <div className="editorial-label" style={{ marginTop: '0.5rem' }}>Stack</div>
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.9rem', opacity: 0.8 }}>
              React JS, Node JS and MongoDB
            </div>
          </div>
          <div>
            <div className="editorial-label">Links</div>
            <div className="mobile-links-row">
              <a href="https://github.com/sumanthangadi/order-management-backend" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('github', 16)} GitHub</a>
              <span style={{ opacity: 0.15 }}>|</span>
              <a href="https://order-management-frontend-tau.vercel.app/dashboard" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('preview', 16)} Live Preview</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="mobile-section" style={{ minHeight: 'auto' }}>
        <div className="mobile-contact-bg-text">CONTACT</div>
        <div className="mobile-section-label" style={{ zIndex: 1 }}>{sectionLabels[4]}</div>
        <div className="mobile-content mobile-reveal" ref={addRevealRef} style={{ zIndex: 1 }}>
          <div>
            <div className="editorial-label">Phone / WhatsApp</div>
            <div className="editorial-value">+91 9343337788</div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="editorial-label">Email</div>
            <div className="editorial-value" style={{ fontSize: '1.2rem' }}>sumanthangadi7@gmail.com</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="editorial-label">Connect</div>
            <div className="mobile-links-row" style={{ marginTop: '0.5rem' }}>
              <a href="https://wa.me/919343337788?text=Hay%20Sumanth%2C%20Lets%20work%20together" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('whatsapp', 16)} WhatsApp</a>
              <span style={{ opacity: 0.15 }}>|</span>
              <a href="mailto:sumanthangadi7@gmail.com" target="_blank" rel="noreferrer" className="editorial-button">{getIcon('email', 16)} Email</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function LookbookHero() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const sectionRef = useRef(null);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { offsetTop } = sectionRef.current;
      const progress = Math.max(0, window.scrollY - offsetTop);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (isMobile) {
    return <MobileLayout />;
  }

  // Configuration
  const visualSpacing = windowWidth * 0.5 || 600;
  const SCROLL_MULTIPLIER = 3;
  const scrollPerSlide = visualSpacing * SCROLL_MULTIPLIER;
  const lastSlideCenter = (cutouts.length - 1) * scrollPerSlide;
  const extraDwellAtEnd = 1200; // Extra pixels of scroll to sit on the last slide
  const maxScroll = lastSlideCenter + extraDwellAtEnd;
  const wrapperHeight = `calc(100vh + ${maxScroll}px)`;

  // Calculate layout with smooth "dwell" zones at each slide center
  // For the last slide, we cap the progress at its center so it 'sticks'
  const clampedProgress = Math.min(scrollProgress, maxScroll);
  const animProgress = Math.min(clampedProgress, lastSlideCenter);

  const dwellRange = 600;
  let effectiveProgress = animProgress;

  for (let i = 0; i < cutouts.length; i++) {
    const center = i * scrollPerSlide;
    const dist = Math.abs(animProgress - center);

    if (dist < dwellRange) {
      const factor = Math.pow(1 - (dist / dwellRange), 2);
      effectiveProgress = animProgress + (center - animProgress) * factor;
      break;
    }
  }

  const activeIndex = Math.min(cutouts.length - 1, Math.max(0, Math.round(effectiveProgress / scrollPerSlide)));

  // Center translation
  const visualProgress = effectiveProgress / SCROLL_MULTIPLIER;
  const stripTranslateX = (windowWidth / 2) - visualProgress;

  return (
    <div ref={sectionRef} style={{ height: wrapperHeight, width: '100%', position: 'relative' }}>

      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center' }}>

        {/* Strip */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            transform: `translateX(${stripTranslateX}px)`,
            willChange: 'transform'
          }}
        >
          {cutouts.map((src, i) => {
            const isActive = i === activeIndex;

            // Continuous scroll interpolation
            const x = i * visualSpacing;
            const distance = Math.abs(x - visualProgress);

            // Normalized progress from 0 (far) to 1 (center)
            let rawProgress = Math.max(0, 1 - distance / visualSpacing);
            // Smoothstep curve for elegant ease-in and ease-out
            const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);

            // Interpolated values
            const currentHeight = 50 + (140 * progress);
            const currentOpacity = 0.4 + (0.6 * progress);
            const currentGrayscale = 30 * (1 - progress);
            const currentTranslateY = 40 * progress;

            const leftOffset = i === 4 ? -80 : 0; // Shift contact cutout left

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x + leftOffset,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: isActive ? 10 : 1
                }}
              >
                <img
                  src={src}
                  alt={`Lookbook Cutout ${i + 1}`}
                  style={{
                    height: `${currentHeight}vh`,
                    opacity: currentOpacity,
                    filter: `grayscale(${currentGrayscale}%)`,
                    transform: `translateY(${currentTranslateY}vh)`,
                    objectFit: 'contain',
                    transformOrigin: 'center center',
                    willChange: 'height, opacity, filter, transform'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Floating Icons — Skills Slide */}
        {[
          { icon: 'react', top: '15%', left: '5%', size: 36, delay: '0s', dur: '6s' },
          { icon: 'nodejs', top: '20%', left: '88%', size: 30, delay: '1s', dur: '7s' },
          { icon: 'firebase', top: '70%', left: '6%', size: 28, delay: '2s', dur: '5s' },
          { icon: 'reactNative', top: '75%', left: '87%', size: 32, delay: '0.5s', dur: '8s' },
          { icon: 'data', top: '45%', left: '3%', size: 24, delay: '1.5s', dur: '6.5s' },
          { icon: 'github', top: '10%', left: '50%', size: 26, delay: '0.8s', dur: '7.5s' },
          { icon: 'react', top: '80%', left: '45%', size: 20, delay: '2.5s', dur: '5.5s' },
          { icon: 'firebase', top: '35%', left: '92%', size: 22, delay: '3s', dur: '9s' },
        ].map((item, i) => (
          <div key={`float-${i}`} style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            opacity: activeIndex === 2 ? 0.15 : 0,
            transition: 'opacity 0.8s ease',
            animation: `floatIcon ${item.dur} ease-in-out ${item.delay} infinite`,
            zIndex: 5,
            pointerEvents: 'none',
            color: '#000'
          }}>
            {getIcon(item.icon, item.size)}
          </div>
        ))}

        {/* Text Panels */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          opacity: 1, // The container itself is always visible, but we transition inner content
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          {slideContent.map((content, i) => (
            <div
              key={`left-${i}`}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: i === 3 ? '-20vh' : 0,
                left: 0,
                pointerEvents: activeIndex === i ? 'auto' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              {content.left.map((item, idx) => renderPanelItem(item, idx, false, activeIndex === i))}
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute',
          top: '40%',
          right: '2%',
          transform: 'translateY(-50%)',
          opacity: 1,
          zIndex: 20,
          pointerEvents: 'none',
          textAlign: 'right'
        }}>
          {slideContent.map((content, i) => (
            <div
              key={`right-${i}`}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: i === 3 ? '-20vh' : 0,
                right: 0,
                pointerEvents: activeIndex === i ? 'auto' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.8rem'
              }}
            >
              {content.right.map((item, idx) => renderPanelItem(item, idx, true, activeIndex === i))}
            </div>
          ))}
        </div>

        {/* Scroll Hint for Contact Slide */}
        <div style={{
          position: 'absolute',
          bottom: '4vh',
          left: '5%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1.2rem',
          opacity: activeIndex === 4 ? 0.5 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 30,
          color: '#000'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <span style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            Scroll to view more
          </span>
        </div>

      </div>
    </div>
  );
}
