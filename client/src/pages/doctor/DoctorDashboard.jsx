import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Plus, 
  Trash2, 
  AlertCircle, 
  DollarSign, 
  Stethoscope,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Prescription creation modal
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: 'Twice daily', duration: '5 days' }
  ]);
  const [submittingPrescription, setSubmittingPrescription] = useState(false);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const [appRes, profileRes] = await Promise.all([
        api.get('/appointments/doctor'),
        api.get('/doctors/my-profile')
      ]);

      if (appRes.data.success) {
        setAppointments(appRes.data.appointments || []);
      }
      if (profileRes.data.success) {
        setDoctorProfile(profileRes.data.doctor);
      }
    } catch (err) {
      console.error('Error fetching doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const res = await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Appointment marked as ${newStatus}`);
        fetchDoctorData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis(appointment.reason || '');
    setMedicines([{ name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' }]);
    setInstructions('');
    setFollowUpDate('');
    setPrescriptionModalOpen(true);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' }]);
  };

  const handleRemoveMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error('Please enter a clinical diagnosis');
      return;
    }
    const validMeds = medicines.filter(m => m.name.trim() !== '');
    if (validMeds.length === 0) {
      toast.error('Please prescribe at least one medication');
      return;
    }

    try {
      setSubmittingPrescription(true);
      const payload = {
        appointmentId: selectedAppointment._id,
        diagnosis,
        medicines: validMeds,
        instructions,
        followUpDate: followUpDate || undefined,
      };

      const res = await api.post('/prescriptions', payload);
      if (res.data.success) {
        toast.success('Prescription created & appointment marked completed!');
        setPrescriptionModalOpen(false);
        fetchDoctorData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue prescription');
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Doctor Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #047857 100%)',
        color: '#ffffff',
        border: 'none',
        marginBottom: '2rem',
        padding: '2rem'
      }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#a7f3d0', fontWeight: 700 }}>
              Physician Consultation Portal
            </span>
            <h1 className="title-lg" style={{ color: '#ffffff', marginTop: '0.2rem' }}>
              Welcome, Dr. {user?.name}
            </h1>
            <p style={{ color: '#e6fffa', fontSize: '0.925rem' }}>
              Specialization: <strong>{doctorProfile?.specialization || 'Consultant'}</strong> &bull; Hospital: <strong>{doctorProfile?.hospital || 'CareSync Medical'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.85rem 1.25rem', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>{pendingCount}</span>
              <span style={{ fontSize: '0.75rem', color: '#e6fffa' }}>Pending</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>{confirmedCount}</span>
              <span style={{ fontSize: '0.75rem', color: '#e6fffa' }}>Upcoming</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>{completedCount}</span>
              <span style={{ fontSize: '0.75rem', color: '#e6fffa' }}>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Title */}
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="title-md">Patient Appointments Schedule</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage your schedule, confirm visits, or issue prescriptions</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading consultations...</p>
      ) : filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Calendar size={40} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
          <h4 style={{ color: '#0f172a' }}>No Appointments Found</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No patient bookings under the "{statusFilter}" category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAppointments.map(app => (
            <div key={app._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              
              {/* Patient info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #cbd5e1'
                }}>
                  {app.patient?.name ? app.patient.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {app.patient?.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {app.patient?.phone || app.patient?.email}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>
                    Reason: <span style={{ fontWeight: 400, color: '#475569' }}>{app.reason}</span>
                  </p>
                </div>
              </div>

              {/* Slot & Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#0f172a' }}>
                  <Calendar size={16} style={{ color: '#0d9488' }} />
                  <span>{new Date(app.appointmentDate).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                  <Clock size={16} />
                  <span>{app.timeSlot} &bull; <strong style={{ textTransform: 'capitalize' }}>{app.type}</strong></span>
                </div>
              </div>

              {/* Symptoms */}
              {app.symptoms?.length > 0 && (
                <div style={{ maxWidth: '200px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Symptoms</span>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '2px' }}>
                    {app.symptoms.map((s, idx) => (
                      <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div>
                <span className={`badge badge-${app.status}`}>
                  {app.status}
                </span>
              </div>

              {/* Doctor action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app._id, 'confirmed')}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={15} /> Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'cancelled')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={15} /> Decline
                    </button>
                  </>
                )}

                {app.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => openPrescriptionModal(app)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#0d9488' }}
                    >
                      <FileText size={15} /> Issue Prescription
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'completed')}
                      className="btn btn-secondary btn-sm"
                    >
                      Mark Done
                    </button>
                  </>
                )}

                {app.status === 'completed' && (
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ Consultation Complete
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Prescription Creation Modal */}
      {prescriptionModalOpen && selectedAppointment && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3 className="title-md">Issue Medical Prescription</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Patient: {selectedAppointment.patient?.name} &bull; Date: {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setPrescriptionModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handlePrescriptionSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Diagnosis */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Clinical Diagnosis</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Acute Pharyngitis, Essential Hypertension"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                {/* Medicines List */}
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Medications (Rx)</label>
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Plus size={14} /> Add Medicine
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {medicines.map((med, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr auto', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                          placeholder="Dosage (500mg)"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                          placeholder="Twice daily"
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                          placeholder="5 days"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        />
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instructions & Dietary Precautions</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Take after meals. Drink plenty of water. Avoid cold beverages..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                {/* Follow-up date */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Recommended Follow-up Date (Optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPrescriptionModalOpen(false)}
                  disabled={submittingPrescription}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#0d9488' }}
                  disabled={submittingPrescription}
                >
                  {submittingPrescription ? 'Saving...' : 'Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;

