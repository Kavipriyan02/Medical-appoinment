const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: Number, default: 0 }, // years
  consultationFee: { type: Number, required: true, default: 500 },
  about: { type: String },
  hospital: { type: String },
  languages: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  availableSlots: [
    {
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String }, // "09:00"
      endTime: { type: String },   // "17:00"
      slotDuration: { type: Number, default: 30 }, // minutes
    }
  ],
  reviews: [
    {
      patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
