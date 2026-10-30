import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '4rem 0 2rem 0',
      marginTop: '4rem',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Activity size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Care<span style={{ color: '#38bdf8' }}>Sync</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Next-generation healthcare appointment management connecting patients with top-rated medical specialists seamlessly.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.875rem', fontWeight: 600 }}>
              <Phone size={16} /> Emergency Helpline: 112 / 108 (24/7)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/doctors" style={{ color: '#94a3b8' }}>Browse All Doctors</Link></li>
              <li><Link to="/register-doctor" style={{ color: '#94a3b8' }}>Join as Medical Specialist</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Patient Portal</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              POPULAR SPECIALTIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li>Cardiology & Heart Care</li>
              <li>Dermatology & Skin</li>
              <li>Neurology & Brain Health</li>
              <li>Pediatrics & Child Care</li>
              <li>Orthopedics & Joint Surgery</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              SUPPORT & CONTACT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }} />
                <span>Central Medical District, 45 Healthcare Plaza, Tech Park</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span>support@caresync-health.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} CareSync Medical Systems Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for modern healthcare with <Heart size={14} style={{ color: '#ef4444' }} fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

