import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Star, Filter, Calendar, MapPin, DollarSign, Award, Stethoscope } from 'lucide-react';
import api from '../services/api';
import AppointmentModal from '../components/AppointmentModal';
import { useAuth } from '../context/AuthContext';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states from URL
  const selectedSpecialization = searchParams.get('specialization') || 'all';
  const querySearch = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'rating';

  const [searchInput, setSearchInput] = useState(querySearch);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchSpecializations = async () => {
    try {
      const res = await api.get('/doctors/specializations');
      if (res.data.success) {
        setSpecializations(res.data.specializations || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSpecialization && selectedSpecialization !== 'all') {
        params.append('specialization', selectedSpecialization);
      }
      if (querySearch) {
        params.append('search', querySearch);
      }
      if (sortBy) {
        params.append('sort', sortBy);
      }
      params.append('limit', '50');

      const res = await api.get(`/doctors?${params.toString()}`);
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleSpecialtyChange = (spec) => {
    const newParams = new URLSearchParams(searchParams);
    if (spec === 'all') {
      newParams.delete('specialization');
    } else {
      newParams.set('specialization', spec);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  const handleBook = (doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setBookingModalOpen(true);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-lg" style={{ color: '#0f172a', marginBottom: '0.5rem' }}>
          Find & Consult Specialist Doctors
        </h1>
        <p style={{ color: '#64748b' }}>
          Schedule video or clinic consultations with licensed medical professionals
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by doctor name or clinic..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          
          {/* Specialty Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Specialty:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={selectedSpecialization}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Sort by:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="recent">Newest Joined</option>
            </select>
          </div>

        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <p>Loading medical specialists...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <Stethoscope size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Doctors Found
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Try adjusting your search criteria or resetting the filters.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {doctors.map((doc) => (
            <div key={doc._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #bae6fd',
                  flexShrink: 0
                }}>
                  {doc.user?.name ? doc.user.name.charAt(0).toUpperCase() : 'D'}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                    Dr. {doc.user?.name}
                  </h3>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                    {doc.specialization}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={15} fill="#f59e0b" />
                    <span>{doc.rating || 5.0}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>({doc.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <span>{doc.experience} Years Experience &bull; {doc.qualifications || 'MBBS, MD'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <span>{doc.hospital || 'CareSync Medical Center'}</span>
                </div>
                {doc.about && (
                  <p style={{ marginTop: '0.5rem', color: '#475569', fontSize: '0.825rem', lineHeight: 1.5 }}>
                    {doc.about.length > 110 ? `${doc.about.slice(0, 110)}...` : doc.about}
                  </p>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Consultation Fee</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                    ₹{doc.consultationFee || 500}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/doctors/${doc._id}`} className="btn btn-secondary btn-sm">
                    View
                  </Link>
                  <button onClick={() => handleBook(doc)} className="btn btn-primary btn-sm">
                    Book Now
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AppointmentModal
        doctor={selectedDoctor}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

    </div>
  );
};

export default Doctors;

