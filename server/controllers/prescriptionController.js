const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// @desc   Create prescription (doctor)
// @route  POST /api/prescriptions
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medicines, instructions, followUpDate, tests } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('patient', 'name');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctor = await require('../models/Doctor').findOne({ user: req.user._id });

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: doctor._id,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
      tests: tests || [],
    });

    // Link prescription to appointment
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    await appointment.save();

    // Notify patient
    await Notification.create({
      user: appointment.patient._id,
      title: 'Prescription Ready',
      message: `Dr. has issued a prescription for your appointment. Diagnosis: ${diagnosis}`,
      type: 'prescription',
      relatedId: prescription._id,
    });

    res.status(201).json({ success: true, message: 'Prescription created', prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get prescription by ID
// @route  GET /api/prescriptions/:id
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email dateOfBirth gender bloodGroup')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .populate('appointment');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get my prescriptions (patient)
// @route  GET /api/prescriptions/my
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get doctor's issued prescriptions
// @route  GET /api/prescriptions/doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await require('../models/Doctor').findOne({ user: req.user._id });
    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate('patient', 'name email dateOfBirth gender')
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createPrescription, getPrescriptionById, getMyPrescriptions, getDoctorPrescriptions };
