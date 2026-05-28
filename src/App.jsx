import React, { useState, useEffect } from 'react';
import LookbookHero from './components/LookbookHero';
import ContactForm from './components/ContactForm';
import './index.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 1. Preload cutout images to prevent flicker on first view
    const imagesToPreload = [
      '/cutouts/1.png',
      '/cutouts/2.png',
      '/cutouts/3.png',
      '/cutouts/4.png',
      '/cutouts/5.png'
    ];

    let imagesLoaded = false;
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        imagesLoaded = true;
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
    });

    // Simulate premium progress bar updates
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 30) {
          return prev + Math.floor(Math.random() * 8) + 4;
        } else if (prev < 75) {
          return prev + Math.floor(Math.random() * 3) + 1;
        } else if (prev < 95) {
          if (imagesLoaded && document.readyState === 'complete') {
            return prev + Math.floor(Math.random() * 5) + 2;
          }
          return prev;
        } else {
          if (imagesLoaded && document.readyState === 'complete') {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsFadingOut(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 800);
            }, 300);
            return 100;
          }
          return 95;
        }
      });
    }, 80);

    // Safety timeout of 5 seconds to bypass loader if network is extremely slow
    const safetyTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isFadingOut ? 0 : 1,
          transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: isFadingOut ? 'none' : 'all'
        }}>
          <div style={{ 
            fontFamily: "'Michroma', sans-serif", 
            fontSize: '1.2rem', 
            letterSpacing: '0.25em', 
            marginBottom: '2rem', 
            color: '#000',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            Sumanth
          </div>
          
          <div style={{ 
            width: '180px', 
            height: '2px', 
            backgroundColor: '#eaeaea', 
            position: 'relative', 
            overflow: 'hidden',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${loadingProgress}%`,
              backgroundColor: '#000',
              transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>

          <div style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontSize: '0.75rem', 
            letterSpacing: '0.15em', 
            marginTop: '1rem', 
            color: '#999',
            fontWeight: 400
          }}>
            {loadingProgress}%
          </div>
        </div>
      )}

      <LookbookHero isLoading={isLoading} />
      
      {!isMobile && (
        <section id="projects-detail" className={isMobile ? 'mobile-projects-detail' : ''} style={{
        minHeight: isMobile ? 'auto' : '100vh',
        backgroundColor: '#111',
        color: '#fff',
        padding: isMobile ? '8vh 6% 8vh' : '15vh 10% 12vh 10%',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '2rem' : '4rem'
      }}>
        <h2 style={{ fontSize: isMobile ? '1.6rem' : '3rem', letterSpacing: '0.1em', fontWeight: 600, borderBottom: '1px solid #333', paddingBottom: '1rem', margin: 0 }}>FEATURED PROJECTS</h2>

        {/* Folio — Featured Product Card */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(17, 17, 17, 0) 60%)',
          border: '1px solid #2a2a2a',
          borderRadius: '16px',
          padding: isMobile ? '2rem' : '3rem 4rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '2rem' : '4rem',
          alignItems: 'flex-start',
          overflow: 'hidden'
        }}>
          {/* Gold accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #c9a84c, #f0d878, #c9a84c)', opacity: 0.6 }} />
          
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', letterSpacing: '0.05em', margin: 0, fontWeight: 700 }}>Folio</h3>
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c9a84c, #f0d878)', color: '#111', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.8rem', borderRadius: '50px' }}>MY PRODUCT</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#888', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                Chrome Extension
              </span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ fontStyle: 'italic', textTransform: 'none', color: '#666', fontSize: '0.8rem' }}>Live with real users</span>
            </div>
            <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: isMobile ? '0.9rem' : '1.05rem', lineHeight: '1.7', color: '#ccc', margin: 0 }}>
              A Chrome extension that replaces your new tab with a beautiful bookmark dashboard. Features organized sections, 7 themes, wallpapers, Google auth, and a full payment system — 30-day free trial, one-time ₹119 lifetime access.
            </p>
          </div>
          
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: isMobile ? 'flex-start' : 'flex-end', minWidth: isMobile ? 'auto' : '200px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              {['React', 'Appwrite', 'Chrome APIs', 'Razorpay'].map((tech) => (
                <span key={tech} style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.8rem', border: '1px solid #333', borderRadius: '50px', color: '#999' }}>{tech}</span>
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="https://www.getfolio.tech" target="_blank" rel="noreferrer" className="editorial-button" style={{ borderColor: '#c9a84c', color: '#f0d878' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Visit Folio
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: '#222' }} />
        
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
