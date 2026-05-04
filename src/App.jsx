import React, { useState, useEffect } from 'react';
import LookbookHero from './components/LookbookHero';
import ContactForm from './components/ContactForm';
import './index.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <LookbookHero />
      
      {!isMobile && (
        <section id="projects-detail" className={isMobile ? 'mobile-projects-detail' : ''} style={{
        minHeight: isMobile ? 'auto' : '100vh',
        backgroundColor: '#111',
        color: '#fff',
        padding: isMobile ? '8vh 6% 4vh' : '15vh 10% 2vh 10%',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '2rem' : '4rem'
      }}>
        <h2 style={{ fontSize: isMobile ? '1.6rem' : '3rem', letterSpacing: '0.1em', fontWeight: 600, borderBottom: '1px solid #333', paddingBottom: '1rem', margin: 0 }}>FEATURED PROJECTS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? '2.5rem' : '4rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: isMobile ? 'none' : '1px solid #333', borderBottom: isMobile ? '1px solid #222' : 'none', paddingRight: isMobile ? '0' : '4rem', paddingBottom: isMobile ? '2.5rem' : '0' }}>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', letterSpacing: '0.05em', margin: 0 }}>Habit Tracker Ecosystem</h3>
            <div className="project-platforms" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#888', fontSize: isMobile ? '0.75rem' : '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: isMobile ? 'normal' : 'nowrap', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                Mobile
              </span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Web
              </span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042l-.347 1.97m1.563-8.906c4.923.867 6.14-6.025 1.215-6.893m-1.215 6.893l-5.907-1.041m5.907 1.041l-.347 1.97m-7.122-3.012c.868 4.924-6.025 6.14-6.894 1.216l-1.041-5.908m7.935 4.692l1.97-.347m-3.012-7.122c.867 4.923-6.025 6.14-6.893 1.215l-1.042-5.907m7.935 4.692l1.97-.347"></path></svg>
                Extension
              </span>
              {!isMobile && <span style={{ marginLeft: '0.5rem', color: '#555', fontSize: '0.8rem', fontStyle: 'italic' }}>— CONNECTED TO EACH OTHER</span>}
            </div>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6', color: '#ccc' }}>
              A cross-platform ecosystem built to manage habits and track user progress, using React Native, React JS, and Firebase for the backend.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: isMobile ? '1rem' : '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="https://habit-tracker-public-one.vercel.app/today" target="_blank" rel="noreferrer" className="editorial-button" style={{ borderColor: '#fff', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Live Preview
              </a>
              <a href="https://github.com/sumanthangadi/habittrackerbackend" target="_blank" rel="noreferrer" className="editorial-button" style={{ borderColor: '#fff', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', letterSpacing: '0.05em', margin: 0 }}>Order Management System</h3>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6', color: '#ccc' }}>
              A comprehensive dashboard and backend infrastructure designed to efficiently manage orders and customer data.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '-0.5rem' }}>
              *Note: Initial load may be slow due to the free tier server.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: isMobile ? '1rem' : '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="https://order-management-frontend-tau.vercel.app/dashboard" target="_blank" rel="noreferrer" className="editorial-button" style={{ borderColor: '#fff', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Live Preview
              </a>
              <a href="https://github.com/sumanthangadi/order-management-backend" target="_blank" rel="noreferrer" className="editorial-button" style={{ borderColor: '#fff', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
            </div>
          </div>

        </div>
        </section>
      )}

      <ContactForm isMobile={isMobile} />
    </>
  );
}

export default App;
