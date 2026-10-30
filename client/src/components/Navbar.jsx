import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Bell, 
  Calendar, 
  User, 
  LogOut, 
  Shield, 
  Stethoscope, 
  Menu, 
  X,
  CheckCircle,
  FileText
} from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isDoctor, isAdmin, isPatient, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000); // Poll every 45s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, location.pathname]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)'
          }}>
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Care<span style={{ color: '#0284c7' }}>Sync</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginTop: '-2px' }}>
              HEALTHCARE PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, color: '#475569', fontSize: '0.925rem' }}>
            Home
          </Link>
          <Link to="/doctors" style={{ fontWeight: 600, color: '#475569', fontSize: '0.925rem' }}>
            Find Doctors
          </Link>

          {isPatient && (
            <Link to="/dashboard" style={{
              fontWeight: 600,
              color: '#0284c7',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Calendar size={16} />
              My Appointments
            </Link>
          )}

          {isDoctor && (
            <Link to="/doctor-dashboard" style={{
              fontWeight: 600,
              color: '#0d9488',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Stethoscope size={16} />
              Doctor Portal
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" style={{
              fontWeight: 600,
              color: '#7c3aed',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Shield size={16} />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Action Controls & User menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              
              {/* Notification Bell */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569',
                    position: 'relative'
                  }}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #fff'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '320px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 200,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284c7',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n._id}
                            style={{
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid #f1f5f9',
                              backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff'
                            }}
                          >
                            <p style={{ fontWeight: 600, fontSize: '0.825rem', color: '#0f172a', marginBottom: '2px' }}>
                              {n.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.3 }}>
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User badge & Profile link */}
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #bae6fd'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-text-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.45rem', borderRadius: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/register-doctor" style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#0d9488',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #ccfbf1',
                backgroundColor: '#f0fdfa'
              }}>
                Join as Doctor
              </Link>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .user-text-meta { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

