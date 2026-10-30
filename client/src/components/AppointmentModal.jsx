import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Video, UserCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DEFAULT_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const AppointmentModal = ({ doctor, isOpen, onClose, onSuccess }) => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [type, setType] = useState('in-person');
  const [reason, setReason] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !doctor) return null;

  // Available slots from doctor or fallback default
  const availableSlots = doctor.availableSlots?.length > 0
    ? doctor.availableSlots.map(s => `${s.day} ${s.startTime} - ${s.endTime}`)
    : DEFAULT_SLOTS;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDate) {
      toast.error('Please choose an appointment date');
      return;
    }
    if (!timeSlot) {
      toast.error('Please choose a time slot');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for the consultation');
      return;
    }

    try {
      setSubmitting(true);
      const symptoms = symptomsInput
        ? symptomsInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        doctorId: doctor._id,
        appointmentDate,
        timeSlot,
        type,
        reason,
        symptoms,
      };

      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        toast.success('Appointment booked successfully!');
        if (onSuccess) onSuccess(res.data.appointment);
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="title-md" style={{ color: '#0f172a' }}>Book Appointment</h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              with Dr. {doctor.user?.name} &bull; {doctor.specialization}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Consultation Fee Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '10px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontSize: '0.875rem', fontWeight: 600 }}>
                <DollarSign size={18} />
                <span>Consultation Fee</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                ₹{doctor.consultationFee || 500}
              </span>
            </div>

            {/* Appointment Type */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Consultation Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setType('in-person')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: type === 'in-person' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: type === 'in-person' ? '#f0f9ff' : '#ffffff',
                    color: type === 'in-person' ? '#0284c7' : '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <UserCheck size={18} /> In-Person Visit
                </button>
                <button
                  type="button"
                  onClick={() => setType('online')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: type === 'online' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: type === 'online' ? '#f0f9ff' : '#ffffff',
                    color: type === 'online' ? '#0284c7' : '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <Video size={18} /> Online Video Call
                </button>
              </div>
            </div>

            {/* Date selection */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-input"
                min={today}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>

            {/* Time Slot Selection */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Preferred Time Slot</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                maxHeight: '160px',
                overflowY: 'auto',
                padding: '4px'
              }}>
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    style={{
                      padding: '0.5rem 0.25rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: timeSlot === slot ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: timeSlot === slot ? '#e0f2fe' : '#ffffff',
                      color: timeSlot === slot ? '#0284c7' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Reason for Visit</label>
              <textarea
                className="form-textarea"
                placeholder="Briefly describe your symptoms or reason for consulting the doctor..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Symptoms */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Symptoms <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma separated, optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Headache, Fever, Cough, Chest tightness"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !appointmentDate || !timeSlot}
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AppointmentModal;
