import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Mail, Lock, Phone, Award, DollarSign, Building, FileText, ArrowRight } from 'lucide-react';

const COMMON_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'General Physician',
  'Gynecology',
  'Ophthalmology',
  'Psychiatry',
  'ENT (Ear, Nose, Throat)',
  'Endocrinology',
  'Gastroenterology',
];

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD',
    experience: 5,
    consultationFee: 700,
    hospital: 'Apollo Hospitals',
    about: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await registerDoctor(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1rem auto'
          }}>
            <Stethoscope size={26} />
          </div>
          <h2 className="title-md" style={{ fontSize: '1.5rem', color: '#0f172a' }}>Doctor Enrollment</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join the verified physician network on CareSync
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Doctor's Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Dr. Gregory House"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="doctor@hospital.org"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select
                name="specialization"
                className="form-select"
                value={formData.specialization}
                onChange={handleChange}
              >
                {COMMON_SPECIALTIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Qualifications</label>
              <input
                type="text"
                name="qualifications"
                className="form-input"
                placeholder="MBBS, MD, FACC"
                value={formData.qualifications}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                className="form-input"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                className="form-input"
                min="0"
                step="50"
                value={formData.consultationFee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Hospital / Clinic Name</label>
            <input
              type="text"
              name="hospital"
              className="form-input"
              placeholder="e.g. St. Jude Healthcare & Research Center"
              value={formData.hospital}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Professional Bio / About</label>
            <textarea
              name="about"
              className="form-textarea"
              placeholder="Describe your medical experience, clinical philosophy, and areas of expertise..."
              value={formData.about}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{
            padding: '0.85rem',
            backgroundColor: '#f0fdfa',
            borderRadius: '8px',
            border: '1px solid #ccfbf1',
            fontSize: '0.825rem',
            color: '#0f766e',
            marginBottom: '1.5rem'
          }}>
            ℹ️ All doctor applications are reviewed and verified by the clinical administrator before becoming visible to patients.
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0d9488' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting Application...' : 'Submit Doctor Registration'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already approved?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterDoctor;

