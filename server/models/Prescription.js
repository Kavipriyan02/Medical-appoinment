const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  diagnosis: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true }, // "500mg"
      frequency: { type: String, required: true }, // "twice daily"
      duration: { type: String, required: true }, // "7 days"
      instructions: { type: String }, // "after food"
    }
  ],
  instructions: { type: String },
  followUpDate: { type: Date },
  tests: [{ type: String }], // lab tests recommended
  issuedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
