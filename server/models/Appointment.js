const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // "09:00 - 09:30"
  type: { type: String, enum: ['in-person', 'online'], default: 'in-person' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending',
  },
  reason: { type: String }, // reason for visit
  symptoms: [{ type: String }],
  notes: { type: String }, // doctor notes
  fee: { type: Number },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin'] },
  cancellationReason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
