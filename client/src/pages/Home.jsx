import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Clock, 
  Stethoscope, 
  Star, 
  ArrowRight,
  Heart,
  UserPlus,
  Activity,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import AppointmentModal from '../components/AppointmentModal';
import { useAuth } from '../context/AuthContext';

const SPECIALTIES = [
  { name: 'Cardiology', icon: '❤️', desc: 'Heart & cardiovascular care' },
  { name: 'Dermatology', icon: '🧴', desc: 'Skin, hair & nail health' },
  { name: 'Pediatrics', icon: '👶', desc: 'Child health & development' },
  { name: 'Neurology', icon: '🧠', desc: 'Brain & nervous system' },
  { name: 'Orthopedics', icon: '🦴', desc: 'Bones, joints & spine' },
  { name: 'General Physician', icon: '🩺', desc: 'Primary diagnosis & wellness' },
  { name: 'Gynecology', icon: '🌸', desc: 'Women’s health & maternity' },
  { name: 'Ophthalmology', icon: '👁️', desc: 'Eye care & vision surgery' },
];

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { isAuthenticated, isPatient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      const res = await api.get('/doctors?limit=4&sort=rating');
      if (res.data.success) {
        setFeaturedDoctors(res.data.doctors || []);
      }
    } catch (err) {
      console.error('Failed to load featured doctors:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleBookClick = (doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setBookingModalOpen(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: '1px solid #bae6fd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0284c7',
              marginBottom: '1.5rem'
            }}>
              <ShieldCheck size={18} /> Verified Specialist Doctors &bull; Instant Confirmation
            </div>

            <h1 className="title-xl" style={{ fontSize: '3rem', marginBottom: '1.25rem', color: '#0f172a' }}>
              Compassionate Care, <br />
              <span style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Scheduled in Minutes
              </span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Connect with top certified doctors, manage medical records, and receive digital prescriptions with seamless clinical coordination.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '0.5rem 0.5rem 0.5rem 1.25rem',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.15)',
              border: '1px solid #cbd5e1',
              maxWidth: '620px',
              margin: '0 auto 2.5rem auto'
            }}>
              <Search size={22} style={{ color: '#94a3b8', marginRight: '0.75rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or clinic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#0f172a',
                  width: '100%',
                  background: 'transparent'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '12px' }}>
                Search
              </button>
            </form>

            {/* Highlights bullet badges */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> 100% Free Cancellation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Verified Medical Licenses
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Secure Digital Prescriptions
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="title-lg" style={{ color: '#0f172a' }}>Top Medical Specialties</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Browse specialists across key healthcare departments</p>
            </div>
            <Link to="/doctors" style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              View all doctors <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {SPECIALTIES.map((spec) => (
              <div
                key={spec.name}
                className="card"
                onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec.name)}`)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  borderRadius: '16px'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {spec.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                    {spec.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {spec.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="title-lg" style={{ color: '#0f172a' }}>Highly Rated Doctors</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Consult with licensed professionals experienced in dedicated clinical care</p>
            </div>
            <Link to="/doctors" className="btn btn-secondary">
              Browse All ({featuredDoctors.length})
            </Link>
          </div>

          {featuredDoctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>No featured doctors currently available.</p>
            </div>
          ) : (
            <div className="grid-4">
              {featuredDoctors.map((doc) => (
                <div key={doc._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #bae6fd'
                    }}>
                      {doc.user?.name ? doc.user.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        Dr. {doc.user?.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', flex: 1 }}>
                    <p style={{ marginBottom: '0.4rem' }}>
                      <strong>Experience:</strong> {doc.experience} Years
                    </p>
                    <p style={{ marginBottom: '0.4rem' }}>
                      <strong>Clinic:</strong> {doc.hospital || 'CareSync Medical Center'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={16} fill="#f59e0b" />
                      <span>{doc.rating || 5.0}</span>
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>({doc.totalReviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Fee</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{doc.consultationFee || 500}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBookClick(doc)}
                      className="btn btn-primary btn-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Doctor Join Banner */}
      <section style={{ padding: '4.5rem 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Stethoscope size={18} /> FOR HEALTHCARE PROVIDERS
              </div>
              <h2 className="title-lg" style={{ color: '#fff', marginBottom: '1rem' }}>
                Are You a Licensed Medical Doctor?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
                Join CareSync's medical network. Manage digital appointments, issue verified prescriptions, and grow your clinical practice with state-of-the-art tools.
              </p>
            </div>
            <div>
              <Link to="/register-doctor" className="btn btn-primary btn-lg" style={{ backgroundColor: '#0284c7' }}>
                <UserPlus size={18} /> Apply as Specialist Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AppointmentModal
        doctor={selectedDoctor}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};

export default Home;

