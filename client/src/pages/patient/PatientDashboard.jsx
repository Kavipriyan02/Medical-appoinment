import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Stethoscope, 
  DollarSign, 
  Video, 
  UserCheck, 
  Printer, 
  Star,
  Trash2,
  FolderOpen
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import PrescriptionModal from '../../components/PrescriptionModal';
import ReviewModal from '../../components/ReviewModal';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'records'
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedDoctorForReview, setSelectedDoctorForReview] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // New Record modal state
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    type: 'lab-report',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchMedicalRecords();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/my');
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const res = await api.get('/medical-records/my');
      if (res.data.success) {
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error('Error loading medical records:', err);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.put(`/appointments/${id}/cancel`, { cancellationReason: 'Patient requested cancellation' });
      if (res.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleViewPrescription = async (prescriptionId) => {
    try {
      const res = await api.get(`/prescriptions/${prescriptionId}`);
      if (res.data.success) {
        setSelectedPrescription(res.data.prescription);
        setPrescriptionModalOpen(true);
      }
    } catch (err) {
      toast.error('Unable to load prescription');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/medical-records', newRecord);
      if (res.data.success) {
        toast.success('Medical record saved');
        setRecordModalOpen(false);
        setNewRecord({
          title: '',
          type: 'lab-report',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
        fetchMedicalRecords();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add medical record');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this medical record?')) return;
    try {
      const res = await api.delete(`/medical-records/${id}`);
      if (res.data.success) {
        toast.success('Record deleted');
        fetchMedicalRecords();
      }
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Welcome banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        marginBottom: '2rem',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 className="title-lg" style={{ color: '#ffffff', marginBottom: '0.25rem' }}>
            Hello, {user?.name}!
          </h1>
          <p style={{ color: '#e0f2fe', fontSize: '0.95rem' }}>
            Track and manage your upcoming consultations and personal health history.
          </p>
        </div>
        <Link to="/doctors" className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: '#0284c7', fontWeight: 700 }}>
          <Calendar size={18} /> Book New Appointment
        </Link>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'appointments' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'appointments' ? '3px solid #0284c7' : 'none',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={18} /> My Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('records')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'records' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'records' ? '3px solid #0284c7' : 'none',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText size={18} /> Medical Records & Reports ({records.length})
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div>
          
          {/* Status Filter Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
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

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Calendar size={40} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.4rem' }}>No Appointments Found</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                You don't have any appointments in the "{statusFilter}" status.
              </p>
              <Link to="/doctors" className="btn btn-primary btn-sm">
                Browse Doctors
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredAppointments.map((app) => (
                <div key={app._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                  
                  {/* Doctor Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #bae6fd'
                    }}>
                      {app.doctor?.user?.name ? app.doctor.user.name.charAt(0).toUpperCase() : 'D'}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                        Dr. {app.doctor?.user?.name}
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: '#0284c7', fontWeight: 600 }}>
                        {app.doctor?.specialization || 'Specialist'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Reason: {app.reason}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 600 }}>
                      <Calendar size={16} style={{ color: '#0284c7' }} />
                      <span>{new Date(app.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Clock size={16} />
                      <span>{app.timeSlot}</span>
                    </div>
                  </div>

                  {/* Mode & Fee */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                      {app.type === 'online' || app.type === 'video' ? <Video size={16} style={{ color: '#0284c7' }} /> : <UserCheck size={16} style={{ color: '#0d9488' }} />}
                      <span style={{ textTransform: 'capitalize' }}>{app.type === 'online' ? 'Online Video' : app.type} Consultation</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      Fee: ₹{app.fee || 500}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`badge badge-${app.status}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {app.prescription && (
                      <button
                        onClick={() => handleViewPrescription(typeof app.prescription === 'string' ? app.prescription : app.prescription._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#0284c7' }}
                      >
                        <FileText size={15} /> Rx Prescription
                      </button>
                    )}

                    {app.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedDoctorForReview(app.doctor);
                          setReviewModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Star size={15} style={{ color: '#f59e0b' }} /> Review
                      </button>
                    )}

                    {['pending', 'confirmed'].includes(app.status) && (
                      <button
                        onClick={() => handleCancelAppointment(app._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle size={15} /> Cancel
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Medical Records */}
      {activeTab === 'records' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 className="title-md">Your Medical History</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Safely manage lab reports, past diagnoses, and medical summaries</p>
            </div>
            <button onClick={() => setRecordModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Medical Record
            </button>
          </div>

          {records.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <FolderOpen size={40} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>No Medical Records Saved</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Keep your health history organized in one secure place.</p>
              <button onClick={() => setRecordModalOpen(true)} className="btn btn-primary btn-sm">
                Add Your First Record
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {records.map((rec) => (
                <div key={rec._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{rec.type}</span>
                    <button
                      onClick={() => handleDeleteRecord(rec._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {rec.title}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Date: {new Date(rec.date).toLocaleDateString()}
                  </p>

                  {rec.description && (
                    <p style={{ fontSize: '0.825rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: 'auto' }}>
                      {rec.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prescription View Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        doctor={selectedDoctorForReview}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      {/* Add Record Modal */}
      {recordModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="title-md">Add Medical Record</h3>
              <button onClick={() => setRecordModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddRecord}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Record Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Annual Blood Panel Report"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                    >
                      <option value="lab-report">Lab Report</option>
                      <option value="prescription">Prescription</option>
                      <option value="scan">Scan / MRI</option>
                      <option value="x-ray">X-Ray</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="surgery-report">Surgery Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Details & Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter diagnostic details, findings, lab values..."
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRecordModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
