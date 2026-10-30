import React from 'react';
import { X, Printer, Pill, FileText, Calendar, User, Stethoscope } from 'lucide-react';

const PrescriptionModal = ({ prescription, isOpen, onClose }) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const doctorName = prescription.doctor?.user?.name || 'Medical Specialist';
  const patientName = prescription.patient?.name || 'Patient';

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: '#0284c7' }} />
            <h3 className="title-md" style={{ color: '#0f172a' }}>Medical Prescription</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Prescription Printable Body */}
        <div className="modal-body printable-prescription" style={{ padding: '2rem' }}>
          
          {/* Clinic Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0284c7',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', margin: 0 }}>
                CareSync Medical Clinic
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Accredited Multi-Specialty Health Center
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Rx #{prescription._id?.slice(-8).toUpperCase()}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Date: {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Doctor & Patient Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Prescribed By
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Dr. {doctorName}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                {prescription.doctor?.specialization || 'Consultant Physician'}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Patient Details
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                {patientName}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                Gender: {prescription.patient?.gender || 'N/A'} &bull; Blood: {prescription.patient?.bloodGroup || 'N/A'}
              </p>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Diagnosis
            </h4>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#e0f2fe', borderRadius: '8px', color: '#0369a1', fontWeight: 600 }}>
              {prescription.diagnosis}
            </div>
          </div>

          {/* Medicines Rx Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Prescribed Medications (Rx)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Medicine</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Dosage</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Frequency</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines?.map((med, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: '#0f172a' }}>
                      {med.name}
                    </td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{med.dosage || '1 tab'}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{med.frequency || 'Once daily'}</td>
                    <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{med.duration || '5 days'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Special Advice / Instructions */}
          {prescription.instructions && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Instructions & Dietary Advice
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#334155', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {prescription.instructions}
              </p>
            </div>
          )}

          {/* Follow up date */}
          {prescription.followUpDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
              <Calendar size={16} />
              <span>Recommended Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Prescription
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrescriptionModal;

