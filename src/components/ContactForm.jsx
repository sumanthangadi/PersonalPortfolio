import React, { useState } from 'react';

const ContactForm = ({ isMobile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    business: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'success', 'error', ''
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('access_key', '00fedef4-a2df-4394-a4e4-0beed34eba63');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('business', formData.business);
      formDataToSend.append('message', `${formData.message}\n\n— sent from personal portfolio`);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', mobile: '', business: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #333',
    padding: '1rem 0',
    color: '#fff',
    fontSize: '1.1rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.3s ease'
  };

  const labelStyle = {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#666',
    display: 'block',
    marginBottom: '-0.5rem'
  };

  return (
    <section id="contact-form" className={isMobile ? 'mobile-contact-form' : ''} style={{
      backgroundColor: '#111',
      color: '#fff',
      padding: isMobile ? '6vh 6% 8vh' : '0 10% 10vh 10%',
      borderTop: '1px solid #222'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 5vw, 4rem)', 
          letterSpacing: '-0.02em', 
          marginBottom: isMobile ? '2rem' : '4rem',
          fontWeight: 400
        }}>
          SEND A <span style={{ fontStyle: 'italic', opacity: 0.7 }}>MESSAGE</span>
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2rem' : '3rem 4rem' }}>
          <div style={{ gridColumn: (!isMobile && isSubmitting) ? 'span 2' : 'auto' }}>
            <label style={labelStyle}>Full Name</label>
            <input 
              type="text" 
              placeholder="YOUR NAME" 
              required 
              style={inputStyle}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#fff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" 
              placeholder="EMAIL@EXAMPLE.COM" 
              required 
              style={inputStyle}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#fff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div>
            <label style={labelStyle}>Mobile Number</label>
            <input 
              type="tel" 
              placeholder="+91 00000 00000" 
              style={inputStyle}
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#fff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div>
            <label style={labelStyle}>Business Name</label>
            <input 
              type="text" 
              placeholder="COMPANY (OPTIONAL)" 
              style={inputStyle}
              value={formData.business}
              onChange={(e) => setFormData({...formData, business: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#fff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Project Details</label>
            <textarea 
              placeholder="TELL ME ABOUT YOUR PROJECT..." 
              required 
              rows="4"
              style={{ ...inputStyle, resize: 'none' }}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#fff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            ></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="editorial-button"
              style={{ 
                background: '#fff', 
                color: '#000', 
                padding: isMobile ? '1rem 2.5rem' : '1.2rem 4rem',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            {status === 'success' && (
              <span style={{ color: '#4CAF50', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                ✓ MESSAGE SENT SUCCESSFULLY
              </span>
            )}
            {status === 'error' && (
              <span style={{ color: '#F44336', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                ✕ FAILED TO SEND. PLEASE TRY AGAIN.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
