const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['lab-report', 'prescription', 'scan', 'x-ray', 'vaccination', 'surgery-report', 'other'],
    default: 'other',
  },
  description: { type: String },
  fileUrl: { type: String },
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
