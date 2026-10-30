const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['appointment', 'prescription', 'reminder', 'system', 'review'],
    default: 'system',
  },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // optional redirect link
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // appointment/prescription id
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
