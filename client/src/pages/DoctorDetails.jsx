import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  Calendar, 
  DollarSign, 
  Languages, 
  CheckCircle, 
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import AppointmentModal from '../components/AppointmentModal';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const { isAuthenticated, isPatient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/${id}`);
      if (res.data.success) {
        setDoctor(res.data.doctor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b' }}>
        <p>Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Doctor not found</h2>
        <Link to="/doctors" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Back button */}
      <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Doctor Directory
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Card */}
          <div className="card" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '20px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              fontSize: '2.25rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #bae6fd',
              flexShrink: 0
            }}>
              {doctor.user?.name ? doctor.user.name.charAt(0).toUpperCase() : 'D'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 className="title-lg" style={{ color: '#0f172a' }}>
                  Dr. {doctor.user?.name}
                </h1>
                <span className="badge badge-confirmed">
                  <CheckCircle size={13} /> Verified Specialist
                </span>
              </div>

              <p style={{ color: '#0284c7', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
                {doctor.specialization} &bull; {doctor.qualifications || 'MBBS, MD'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" />
                  <span>{doctor.rating || 5.0}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>({doctor.totalReviews || 0} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} style={{ color: '#0284c7' }} />
                  <span>{doctor.experience} Years Exp.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} style={{ color: '#0284c7' }} />
                  <span>{doctor.hospital || 'CareSync Medical Center'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Doctor */}
          <div className="card">
            <h3 className="title-md" style={{ marginBottom: '1rem' }}>About Dr. {doctor.user?.name}</h3>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {doctor.about || `Dr. ${doctor.user?.name} is a board-certified ${doctor.specialization} specialist committed to delivering exceptional, evidence-based medical treatment. Specializing in preventative care, accurate diagnosis, and personalized therapy plans.`}
            </p>

            {doctor.languages?.length > 0 && (
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                <Languages size={18} style={{ color: '#0284c7' }} />
                <span>Languages spoken: <strong>{doctor.languages.join(', ')}</strong></span>
              </div>
            )}
          </div>

          {/* Patient Reviews */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3 className="title-md">Patient Feedback</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Verified ratings from consultation patients</p>
              </div>

              {isPatient && (
                <button onClick={() => setReviewModalOpen(true)} className="btn btn-secondary btn-sm">
                  <MessageSquare size={15} /> Write a Review
                </button>
              )}
            </div>

            {doctor.reviews?.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No patient reviews yet. Be the first to share your experience!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {doctor.reviews?.map((r, i) => (
                  <div key={i} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                        {r.patient?.name || 'Verified Patient'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                        {[...Array(r.rating || 5)].map((_, s) => (
                          <Star key={s} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      "{r.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Booking Card */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="card" style={{ border: '2px solid #bae6fd', boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.15)' }}>
            
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Consultation Fee
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>
                  ₹{doctor.consultationFee || 500}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/ visit</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
                <span>Instant appointment confirmation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
                <span>Video consultation or in-person clinic visit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
                <span>Digital prescription included</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Calendar size={18} /> Book Appointment
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.85rem' }}>
              No upfront charges &bull; Free cancellation
            </p>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <AppointmentModal
        doctor={doctor}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        doctor={doctor}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={fetchDoctor}
      />

    </div>
  );
};

export default DoctorDetails;

